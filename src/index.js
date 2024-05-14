// ./src/index.js
import Phaser from 'phaser';
import MapManager from './MapManager';

const config = {
    type: Phaser.AUTO,
    width: 3840,
    height: 2160,
    backgroundColor: '#338B33',
    scene: {
        preload: preload,
        create: create
    }
};


function preload() {
    this.load.image('village', 'assets/village.png');
    this.load.image('ruin', 'assets/ruin.png');
    this.load.image('forest', 'assets/forest.png');
    this.load.image('water', 'assets/water.png');
    this.load.image('hills', 'assets/hills.png');
    this.load.image('open', 'assets/open.png');
}


function create() {
    const mapManager = new MapManager(this, config);
    mapManager.createMap();

    // Save map data after creating the map
    const mapId = 'map-' + Date.now(); // Example map ID
    const mapData = mapManager.mapData;
    window.electronAPI.saveMapToDB(mapId, mapData).then(result => {
        if (result.success) {
            console.log('Map saved successfully');
        } else {
            console.error('Error saving map:', result.error);
        }
    });
}


const game = new Phaser.Game(config);
