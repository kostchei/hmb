// src/dbOperations.js
let db;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("HexMapDatabase", 1);

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains('maps')) {
                db.createObjectStore('maps', { keyPath: "id" });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            resolve();
        };

        request.onerror = function(event) {
            console.error("Error opening DB", event);
            reject(event);
        };
    });
}

function saveMapToDB(mapId, mapData) {
    const transaction = db.transaction(["maps"], "readwrite");
    const store = transaction.objectStore("maps");
    const map = { id: mapId, data: JSON.stringify(mapData) };
    store.put(map);
}

function fetchAllMaps() {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["maps"]);
        const store = transaction.objectStore("maps");

        const maps = [];
        store.openCursor().onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                maps.push(cursor.value);
                cursor.continue();
            } else {
                resolve(maps);
            }
        };

        store.openCursor().onerror = function(event) {
            reject("Error fetching maps", event);
        };
    });
}

function loadMap(mapId) {
    const transaction = db.transaction(["maps"]);
    const store = transaction.objectStore("maps");
    const request = store.get(mapId);

    return new Promise((resolve, reject) => {
        request.onsuccess = function() {
            resolve(request.result.data);
        };

        request.onerror = function(event) {
            reject("Error fetching map", event);
        };
    });
}

module.exports = {
    initDB,
    saveMapToDB,
    fetchAllMaps,
    loadMap
};

