const { spawn } = require('child_process');

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

function cancelRun(runId) {
  if (!current || current.runId !== runId) {
    return { canceled: false };
  }

  const { child } = current;
  if (process.platform === 'win32' && child.pid) {
    // Killing the shell is not enough: npm spawns node children that survive it.
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true });
  } else {
    child.kill('SIGTERM');
  }
  return { canceled: true };
}

module.exports = { isRunning, runningRunId, startRun, cancelRun };
