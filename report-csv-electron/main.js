const { app, BrowserWindow } = require('electron');
const path = require('path');

const DEV_URL = process.env.ELECTRON_START_URL;
const PROD_INDEX = path.join(
  __dirname,
  'dist',
  'report-csv-electron',
  'browser',
  'index.html'
);

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
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
}

app.whenReady().then(() => {
  createWindow();

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