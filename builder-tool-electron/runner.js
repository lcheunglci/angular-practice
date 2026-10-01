const { spawn } = require('child_process');
const deploy = require('./deploy');

// npm is a .cmd shim on Windows, so a bare `npm` spawn fails without a shell.
const NPM_COMMAND = process.platform === 'win32' ? 'npm.cmd' : 'npm';

let current = null;
let nextRunId = 1;

function isRunning() {
  return current !== null;
}

function runningRunId() {
  return current ? current.runId : null;
}

function startRun({ projectPath, script }, emit) {
  if (current) {
    return { started: false, reason: 'Another command is already running.' };
  }

  const args = script === 'install' ? ['install'] : ['run', script];
  const runId = nextRunId++;
  const child = spawn(NPM_COMMAND, args, {
    cwd: projectPath,
    shell: true,
    windowsHide: true,
    env: {
      ...process.env,
      // Keep the streamed console readable as plain text.
      FORCE_COLOR: '0',
      NO_COLOR: '1'
    }
  });

  current = { runId, child, projectPath, script };
  emit({ type: 'started', runId, projectPath, script, command: `npm ${args.join(' ')}` });

  const forward = (type) => (chunk) => {
    if (!current || current.runId !== runId) return;
    for (const line of String(chunk).split(/\r?\n/)) {
      if (line.length > 0) emit({ type, runId, line });
    }
  };

  child.stdout.on('data', forward('stdout'));
  child.stderr.on('data', forward('stderr'));

  child.on('error', (err) => {
    if (current && current.runId === runId) current = null;
    emit({ type: 'error', runId, message: err.message });
  });

  child.on('close', (code) => {
    if (current && current.runId === runId) current = null;
    emit({ type: 'exit', runId, code: code === null ? -1 : code });
  });

  return { started: true, runId };
}

// Deploy is not a child process but shares the same single-concurrency slot,
// so it reuses the runId/current/lock machinery and its events stream into the
// same console.
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function startDeploy({ projectPath, deployTo }, emit) {
  if (current) {
    return { started: false, reason: 'Another command is already running.' };
  }

  const runId = nextRunId++;
  // Reserve the single-run slot synchronously so a competing run cannot slip
  // in while the source folder is being resolved below.
  current = { runId, projectPath, script: 'deploy', aborted: false };
  const release = () => {
    if (current && current.runId === runId) current = null;
  };

  (async () => {
    try {
      const src = await deploy.resolveBuildOutput(projectPath).catch(() => null);
      if (!src) {
        emit({
          type: 'error',
          runId,
          message: 'No build output found under "dist". Run Build first.'
        });
        return;
      }
      if (!deployTo) {
        emit({
          type: 'error',
          runId,
          message: 'No deploy destination is set for this project.'
        });
        return;
      }
      if (deploy.isInside(src, deployTo)) {
        emit({
          type: 'error',
          runId,
          message: 'The deploy destination cannot be inside the build output folder.'
        });
        return;
      }

      emit({
        type: 'started',
        runId,
        projectPath,
        script: 'deploy',
        command: `deploy → ${deployTo}`
      });
      emit({ type: 'stdout', runId, line: `Copying ${src} → ${deployTo}` });
      const { copiedItems, bytes } = await deploy.copyDeployment(src, deployTo, () =>
        Boolean(current?.aborted)
      );
      if (current?.aborted) {
        emit({ type: 'error', runId, message: 'Deploy canceled.' });
      } else {
        emit({
          type: 'stdout',
          runId,
          line: `Deployment complete — ${copiedItems} item(s), ${formatBytes(bytes)} copied.`
        });
        emit({ type: 'exit', runId, code: 0 });
      }
    } catch (err) {
      emit({ type: 'error', runId, message: `Deploy failed: ${err.message}` });
    } finally {
      release();
    }
  })();

  return { started: true, runId };
}

function cancelRun(runId) {
  if (!current || current.runId !== runId) {
    return { canceled: false };
  }

  const { child } = current;
  if (child) {
    if (process.platform === 'win32' && child.pid) {
      // Killing the shell is not enough: npm spawns node children that survive it.
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true });
    } else {
      child.kill('SIGTERM');
    }
  } else {
    // Deploy has no child; flag it and let the copy loop stop at the next entry.
    current.aborted = true;
  }
  return { canceled: true };
}

module.exports = { isRunning, runningRunId, startRun, startDeploy, cancelRun };
