//main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const dbOperations = require('./src/dbOperations'); // Import dbOperations

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 3840,
        height: 2160,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true, 
            contextIsolation: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();
}

// Event handlers should be registered before the renderer tries to use them
ipcMain.handle('fetch-all-maps', dbOperations.fetchAllMaps);
ipcMain.handle('save-map-to-db', dbOperations.saveMapToDB);
ipcMain.handle('init-db', dbOperations.initDB);

app.whenReady().then(() => {
    createWindow();
    
    // Initialize the database when the main process is ready
    dbOperations.initDB()
        .then(() => console.log('Database initialized in main process'))
        .catch(err => console.error('Database initialization failed:', err));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
