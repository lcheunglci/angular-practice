const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('reportApi', {
  openCsvDialog: () => ipcRenderer.invoke('report:open-csv'),
  importReport: (filePath, name) => ipcRenderer.invoke('report:import', { filePath, name }),
  listReports: () => ipcRenderer.invoke('report:list'),
  getReport: (id) => ipcRenderer.invoke('report:get', id),
  renameReport: (id, name) => ipcRenderer.invoke('report:rename', { id, name }),
  updateRow: (id, values) => ipcRenderer.invoke('report:update-row', { id, values }),
  deleteReport: (id) => ipcRenderer.invoke('report:delete', id),
  clearAllReports: () => ipcRenderer.invoke('report:clear'),
  exportReport: (id, format) => ipcRenderer.invoke('report:export', { id, format })
});