const path = require('path');
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const {
  openDb,
  parseCsv,
  listReports,
  getReport,
  insertReport,
  renameReport,
  deleteReport,
  exportRowsToJson,
  exportRowsToSpreadsheet
} = require('./db');

const DEV_URL = process.env.ELECTRON_START_URL;
const PROD_INDEX = path.join(
  __dirname,
  'dist',
  'report-csv-electron',
  'browser',
  'index.html'
);

let db;

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
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
}

function registerIpc() {
  ipcMain.handle('report:open-csv', async () => {
    const result = await dialog.showOpenDialog({
      title: 'Select CSV report file',
      filters: [{ name: 'CSV files', extensions: ['csv'] }],
      properties: ['openFile']
    });
    if (result.canceled) return { canceled: true };
    return { canceled: false, filePath: result.filePaths[0] };
  });

  ipcMain.handle('report:import', (_event, { filePath, name }) => {
    const rows = parseCsv(filePath);
    const sourceFile = path.basename(filePath);
    const reportName = name && name.trim() ? name.trim() : sourceFile;
    return insertReport(db, reportName, sourceFile, rows);
  });

  ipcMain.handle('report:list', () => listReports(db));

  ipcMain.handle('report:get', (_event, id) => getReport(db, id));

  ipcMain.handle('report:rename', (_event, { id, name }) =>
    renameReport(db, id, name.trim())
  );

  ipcMain.handle('report:delete', (_event, id) => deleteReport(db, id));

  ipcMain.handle('report:export', async (_event, { id, format }) => {
    const extensions =
      format === 'json' ? ['json'] : format === 'ods' ? ['ods'] : ['xlsx'];
    const result = await dialog.showSaveDialog({
      title: 'Export report',
      defaultPath: `${id}-report.${extensions[0]}`,
      filters: [
        { name: extensions[0].toUpperCase(), extensions }
      ]
    });
    if (result.canceled || !result.filePath) return { canceled: true };

    if (format === 'json') {
      return exportRowsToJson(db, id, result.filePath);
    }
    return exportRowsToSpreadsheet(db, id, result.filePath, format);
  });
}

app.whenReady().then(() => {
  const dbPath = path.join(app.getPath('userData'), 'reports.db');
  db = openDb(dbPath);
  registerIpc();
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