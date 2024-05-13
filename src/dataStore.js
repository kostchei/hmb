let db;
const request = indexedDB.open("HexMapDatabase", 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains('maps')) {
    db.createObjectStore('maps', { keyPath: "id" });
  }
};

request.onsuccess = function(event) {
  db = event.target.result;
};

request.onerror = function(event) {
  console.log("Error opening DB", event);
};
