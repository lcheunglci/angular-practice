const path = require('path');
const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const { loadProjects, saveProjects, setProjectDeploy, toProject } = require('./settings');
const { runningRunId, startRun, startDeploy, cancelRun } = require('./runner');
const { buildApplicationMenu } = require('./menu');

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
  // live window if that renderer was recreated mid-run.
  const emitTo = (win) => (event) => {
    if (win && !win.isDestroyed()) {
      win.webContents.send('run:event', event);
      return;
    }
    const fallback = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
    if (fallback) {
      fallback.webContents.send('run:event', event);
    }
  };

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

  ipcMain.handle('run:start', (_event, payload) => {
    const win = BrowserWindow.fromWebContents(_event.sender);
    return startRun(payload, emitTo(win));
  });

  ipcMain.handle('deploy:start', (_event, projectPath) => {
    const win = BrowserWindow.fromWebContents(_event.sender);
    const record = loadProjects().find((entry) => entry.path === projectPath);
    return startDeploy({ projectPath, deployTo: record ? record.deployTo : null }, emitTo(win));
  });

  ipcMain.handle('run:cancel', (_event, runId) => cancelRun(runId));

  ipcMain.handle('run:status', () => runningRunId());
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(buildApplicationMenu());
  const win = createWindow();

  registerIpc();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
