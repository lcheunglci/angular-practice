const { app, dialog, Menu } = require('electron');

function showAbout() {
  dialog.showMessageBox({
    type: 'info',
    title: `About ${app.getName()}`,
    message: app.getName(),
    detail: `Version ${app.getVersion()}\nDesktop CSV report viewer built with Electron + Angular.`
  });
}

function buildApplicationMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { type: 'separator' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Reports Insight',
          click: () => showAbout()
        }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
}

module.exports = { buildApplicationMenu };