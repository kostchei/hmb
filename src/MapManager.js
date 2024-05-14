// ./src/MapManager.js

import Phaser from 'phaser';

class MapManager {
    constructor(scene, config) {
        this.scene = scene;
        this.config = config;
        this.mapData = []; // Store map data here

        // Hexagon properties
        this.HEX_SIZE = 30;
        this.HEX_WIDTH = 2 * this.HEX_SIZE;
        this.HEX_HEIGHT = Math.sqrt(3) * this.HEX_SIZE;

        // Terrain types and probabilities
        this.terrainTypes = [
            { type: 'village', probability: 0.02 },
            { type: 'water', probability: 0.04 },
            { type: 'hills', probability: 0.05 },
            { type: 'ruin', probability: 0.01 },
            { type: 'open', probability: 0.12 },
            { type: 'forest', probability: 0.76 }
        ];
    }

    generateTerrain() {
        const rand = Math.random();
        let cumulativeProbability = 0;
        for (const terrain of this.terrainTypes) {
            cumulativeProbability += terrain.probability;
            if (rand < cumulativeProbability) {
                return terrain.type;
            }
        }
    }

    placeTerrain(terrain, x, y) {
        const scaleRatio = this.HEX_WIDTH / 210; // Assuming original sprite width is 210
        const image = this.scene.add.image(x, y, terrain).setOrigin(0.5, 0.5);
        image.setScale(scaleRatio);
        return image;
    }

    getHexCoordinatesFlatTop(q, r) {
        const x = this.HEX_WIDTH * (3 / 4 * q);
        const y = this.HEX_HEIGHT * (r + q / 2);
        return { x, y };
    }

    createMap() {
        console.log('Creating hex grid...');
        const graphics = this.scene.add.graphics({
            fillStyle: { color: 0x000000, alpha: 0 },
            lineStyle: { width: 2, color: 0xFFF1E6 }
        });

        const numHexesX = Math.ceil(this.config.width / this.HEX_WIDTH);
        const numHexesY = Math.ceil(this.config.height / (0.75 * this.HEX_HEIGHT));

        for (let q = -numHexesX; q <= numHexesX; q++) {
            for (let r = -numHexesY; r <= numHexesY; r++) {
                const { x, y } = this.getHexCoordinatesFlatTop(q, r);
                this.drawHexagonFlatTop(graphics, x + this.config.width / 2, y + this.config.height / 2);

                // Generate and place terrain
                const terrain = this.generateTerrain();
                this.placeTerrain(terrain, x + this.config.width / 2, y + this.config.height / 2);
                // Save map data
                this.mapData.push({ q, r, x, y, terrain });
            }
        }
    }

    drawHexagonFlatTop(graphics, centerX, centerY) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angleDeg = 60 * i;
            const angleRad = Math.PI / 180 * angleDeg;
            points.push({
                x: centerX + this.HEX_SIZE * Math.cos(angleRad),
                y: centerY + this.HEX_SIZE * Math.sin(angleRad)
            });
        }

        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (const point of points.slice(1)) {
            graphics.lineTo(point.x, point.y);
        }
        graphics.lineTo(points[0].x, points[0].y);
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
    }
}

export default MapManager;