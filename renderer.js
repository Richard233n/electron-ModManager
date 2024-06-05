document.getElementById('select-mod-path').addEventListener('click', async () => {
    const modPath = await ipcRenderer.invoke('select-mod-path');
    if (modPath) {
        document.getElementById('mod-path').value = modPath;
    }
});

document.getElementById('install-button').addEventListener('click', () => {
    const modPaths = document.getElementById('mod-path').value.split(';').filter(path => path.trim() !== '');
    const targetDir = document.getElementById('root-dir').value;

    if (modPaths.length === 0 || !targetDir) {
        document.getElementById('status').innerText = 'Please select the mod paths and game root directory.';
        return;
    }

    ipcRenderer.send('install-mod', modPaths, targetDir);
});

document.getElementById('close-button').addEventListener('click', () => {
    window.close();
});

