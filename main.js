const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs-extra'); 

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false, // 隐藏标题栏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

app.on('ready', createWindow);

ipcMain.handle('select-mod-path', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory', 'multiSelections']
  });
  if (result.canceled) {
    return null;
  } else {
    return result.filePaths;
  }
});

ipcMain.on('install-mod', async (event, modPaths, targetDir) => {
  try {
    for (const modPath of modPaths) {
      const stats = await fs.stat(modPath);
      if (stats.isDirectory()) {
        await fs.copy(modPath, targetDir, { overwrite: true });
      } else {
        const modName = path.basename(modPath);
        await fs.copy(modPath, path.join(targetDir, modName), { overwrite: true });
      }
    }
    event.reply('install-mod-reply', 'Success');
  } catch (error) {
    event.reply('install-mod-reply', 'Failed: ' + error.message);
  }
});
