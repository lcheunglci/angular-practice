const path = require('path');
const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const fs = require('fs');
const { spawn } = require('child_process');
const { loadProjects, saveProjects, setProjectDeploy, updateProject, toProject } = require('./settings');
const { runningRunId, startRun, startDeploy, cancelRun } = require('./runner');
const { buildApplicationMenu } = require('./menu');
const tray = require('./tray');

const DEV_URL = process.env.ELECTRON_START_URL;
const PROD_INDEX = path.join(
  __dirname,
  'dist',
  'builder-tool-electron',
  'browser',
  'index.html'
);

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 780,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (DEV_URL) {
    win.loadURL(DEV_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(PROD_INDEX);
  }

  return win;
}

function registerIpc() {
  // Delivers run:event to the window that started the run, falling back to any
  // live window if that renderer was recreated mid-run. The tray watches the
  // same events so it can show progress/outcome while the window is hidden.
  const streamTo = (win) => (event) => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('run:event', event);
    } else {
      const fallback = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
      if (fallback) {
        fallback.webContents.send('run:event', event);
      }
    }
    tray.handleRunEvent(event);
  };

  function repoNameFromUrl(u) {
    try {
      const s = String(u).trim().replace(/\.git$/, '').replace(/\/+$/, '');
      const base = path.basename(s.split('#')[0].split('?')[0]);
      return base || 'repo';
    } catch {
      return 'repo';
    }
  }

  function detectNode(root) {
    const pkg = path.join(root, 'package.json');
    if (!fs.existsSync(pkg)) return { node: false };
    try {
      const p = JSON.parse(fs.readFileSync(pkg, 'utf8'));
      const scripts = p && typeof p.scripts === 'object' ? Object.keys(p.scripts) : [];
      return {
        node: true,
        hasBuild: Boolean(p.scripts && p.scripts.build),
        scripts
      };
    } catch {
      return { node: false };
    }
  }

  function spawnGitClone(url, dest) {
    return new Promise((resolve, reject) => {
      const git = spawn('git', ['clone', '--depth', '1', url, dest], { shell: false });
      let stderr = '';
      git.stderr.on('data', (d) => {
        stderr += d.toString();
      });
      git.on('error', (err) => reject(err));
      git.on('close', (code) => {
        if (code === 0) return resolve();
        reject(new Error(stderr.trim() || `git clone exited with code ${code}`));
      });
    });
  }

  ipcMain.handle('projects:list', () => loadProjects().map(toProject));

  ipcMain.handle('projects:add', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Add project folder',
      buttonLabel: 'Add project',
      properties: ['openDirectory']
    });
    if (result.canceled || !result.filePaths.length) {
      return { canceled: true, added: false };
    }

    const dirPath = result.filePaths[0];
    const projects = loadProjects();
    if (projects.some((entry) => entry.path === dirPath)) {
      return { canceled: false, added: false, reason: 'That folder is already in the list.' };
    }

    projects.push({ path: dirPath });
    saveProjects(projects);
    return { canceled: false, added: true, project: toProject({ path: dirPath }) };
  });

  ipcMain.handle('projects:set-deploy', async (_event, projectPath) => {
    const result = await dialog.showOpenDialog({
      title: 'Deploy destination for this project',
      buttonLabel: 'Select destination',
      properties: ['openDirectory', 'createDirectory']
    });
    if (result.canceled || !result.filePaths.length) {
      return { canceled: true, set: false };
    }
    if (!setProjectDeploy(projectPath, result.filePaths[0])) {
      return { canceled: false, set: false, reason: 'Project is not in the saved list.' };
    }
    const record = loadProjects().find((entry) => entry.path === projectPath);
    return { canceled: false, set: true, project: record ? toProject(record) : undefined };
  });

  ipcMain.handle('projects:remove', (_event, projectPath) => {
    saveProjects(loadProjects().filter((entry) => entry.path !== projectPath));
    return true;
  });

  ipcMain.handle('projects:update', (_event, projectPath, changes) =>
    updateProject(projectPath, changes ?? {})
  );

  ipcMain.handle('projects:pick-dir', async (_event, options = {}) => {
    const result = await dialog.showOpenDialog({
      title: options.title ?? 'Select directory',
      buttonLabel: options.buttonLabel ?? 'Select',
      properties: ['openDirectory', 'createDirectory']
    });
    if (result.canceled || !result.filePaths.length) {
      return { canceled: true };
    }
    return { canceled: false, path: result.filePaths[0] };
  });

  ipcMain.handle('projects:pick-text', async (_event, options = {}) => {
    const result = await dialog.showInputBox({
      title: options.title ?? 'Enter value',
      placeholder: options.placeholder,
      value: options.value ?? ''
    });
    if (result.canceled) {
      return { canceled: true };
    }
    return { canceled: false, value: result.value ?? '' };
  });

  ipcMain.handle('projects:clone', async (_event, { url, parentDir, folderName }) => {
    const trimmedUrl = String(url || '').trim();
    if (!trimmedUrl) {
      return { cloned: false, reason: 'Repository URL is required.' };
    }
    if (!parentDir || !fs.existsSync(parentDir) || !fs.statSync(parentDir).isDirectory()) {
      return { cloned: false, reason: 'Parent directory does not exist or is not a directory.' };
    }
    const name = String(folderName || '').trim() || repoNameFromUrl(trimmedUrl);
    const dest = path.join(parentDir, name);
    if (fs.existsSync(dest)) {
      return { cloned: false, reason: `Folder already exists: ${dest}` };
    }
    try {
      await spawnGitClone(trimmedUrl, dest);
      const det = detectNode(dest);
      const projects = loadProjects();
      projects.push({ path: dest });
      saveProjects(projects);
      const record = projects.find((entry) => entry.path === dest);
      return { cloned: true, path: dest, ...det, project: record ? toProject(record) : undefined };
    } catch (err) {
      try {
        fs.rmSync(dest, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
      return { cloned: false, reason: err.message || String(err) };
    }
  });

  ipcMain.handle('run:start', (_event, payload) => {
    const win = BrowserWindow.fromWebContents(_event.sender);
    return startRun(payload, streamTo(win));
  });

  ipcMain.handle('deploy:start', (_event, projectPath) => {
    const win = BrowserWindow.fromWebContents(_event.sender);
    const record = loadProjects().find((entry) => entry.path === projectPath);
    return startDeploy({ projectPath, deployTo: record ? record.deployTo : null }, streamTo(win));
  });

  ipcMain.handle('run:cancel', (_event, runId) => cancelRun(runId));

  ipcMain.handle('run:status', () => runningRunId());
}

// Required on Windows so toast notifications carry the app name/icon.
app.setAppUserModelId('com.example.buildertool');

app.whenReady().then(() => {
  Menu.setApplicationMenu(buildApplicationMenu());
  const win = createWindow();

  tray.initTray({
    onShow: () => {
      const existing = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
      if (!existing) {
        createWindow();
        return;
      }
      if (existing.isMinimized()) existing.restore();
      existing.show();
      existing.focus();
    }
  });

  registerIpc();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('before-quit', () => tray.destroyTray());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
