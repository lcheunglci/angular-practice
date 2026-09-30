const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('builderApi', {
  listProjects: () => ipcRenderer.invoke('projects:list'),
  addProject: () => ipcRenderer.invoke('projects:add'),
  removeProject: (projectPath) => ipcRenderer.invoke('projects:remove', projectPath),
  runScript: (projectPath, script) => ipcRenderer.invoke('run:start', { projectPath, script }),
  cancelRun: (runId) => ipcRenderer.invoke('run:cancel', runId),
  runningRunId: () => ipcRenderer.invoke('run:status'),
  onRunEvent: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('run:event', listener);
    return () => ipcRenderer.removeListener('run:event', listener);
  }
});
