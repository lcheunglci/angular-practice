const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('builderApi', {
  listProjects: () => ipcRenderer.invoke('projects:list'),
  addProject: () => ipcRenderer.invoke('projects:add'),
  removeProject: (projectPath) => ipcRenderer.invoke('projects:remove', projectPath),
  updateProject: (projectPath, changes) =>
    ipcRenderer.invoke('projects:update', projectPath, changes),
  cloneRepo: (url, parentDir, folderName) =>
    ipcRenderer.invoke('projects:clone', { url, parentDir, folderName }),
  pickDir: (options) => ipcRenderer.invoke('projects:pick-dir', options),
  pickText: (options) => ipcRenderer.invoke('projects:pick-text', options),
  setDeployDir: (projectPath) => ipcRenderer.invoke('projects:set-deploy', projectPath),
  runScript: (projectPath, script) => ipcRenderer.invoke('run:start', { projectPath, script }),
  startDeploy: (projectPath) => ipcRenderer.invoke('deploy:start', projectPath),
  cancelRun: (runId) => ipcRenderer.invoke('run:cancel', runId),
  runningRunId: () => ipcRenderer.invoke('run:status'),
  onRunEvent: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('run:event', listener);
    return () => ipcRenderer.removeListener('run:event', listener);
  }
});
