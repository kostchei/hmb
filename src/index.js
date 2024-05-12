import Phaser from 'phaser';
import MapManager from './MapManager';

const config = {
    type: Phaser.AUTO,
    width: 3840,
    height: 2160,
    backgroundColor: '#228B22',
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
}

const game = new Phaser.Game(config);
