const path = require('path');
const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const { loadProjects, saveProjects, toProject } = require('./settings');
const { runningRunId, startRun, cancelRun } = require('./runner');
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

  ipcMain.handle('projects:remove', (_event, projectPath) => {
    saveProjects(loadProjects().filter((entry) => entry.path !== projectPath));
    return true;
  });

  ipcMain.handle('run:start', (_event, payload) => {
    // Use the window that sent the request so events follow it even after a re-create.
    const win = BrowserWindow.fromWebContents(_event.sender);
    const result = startRun(payload, (event) => {
      if (win && !win.isDestroyed()) {
        win.webContents.send('run:event', event);
      } else {
        // Fall back to any live window (e.g. renderer recreated mid-run).
        const fallback = BrowserWindow.getAllWindows().find((w) => !w.isDestroyed());
        if (fallback) {
          fallback.webContents.send('run:event', event);
        }
      }
    });
    return result;
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
