// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    fetchAllMaps: () => ipcRenderer.invoke('fetch-all-maps'),
    saveMapToDB: (mapId, mapData) => ipcRenderer.invoke('save-map-to-db', mapId, mapData),
    initDB: () => ipcRenderer.invoke('init-db'),
});

