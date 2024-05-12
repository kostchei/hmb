import Phaser from 'phaser';

// Game configuration with a forest green background color
const config = {
  type: Phaser.AUTO,
  width: 3840,
  height: 2160,
  backgroundColor: '#228B22', // Forest green
  scene: {
    preload: preload,
    create: create
  }
};

// Game instance
const game = new Phaser.Game(config);

function preload() {
    this.load.image('village', 'assets/village.png');
    this.load.image('ruin', 'assets/ruin.png');
    this.load.image('forest', 'assets/forest.png');
    this.load.image('water', 'assets/water.png');
    this.load.image('hills', 'assets/hills.png');
    this.load.image('open', 'assets/open.png');


}

// Hexagon properties
const HEX_SIZE = 30; // Radius of a single hexagon
const HEX_WIDTH = 2 * HEX_SIZE; // Width of a flat-topped hexagon
const HEX_HEIGHT = Math.sqrt(3) * HEX_SIZE; // Height of a flat-topped hexagon

// List of available terrain types with their probabilities
const terrainTypes = [
    { type: 'village', probability: 0.02 },
    { type: 'water', probability: 0.04 },
    { type: 'hills', probability: 0.05 },
    { type: 'ruin', probability: 0.01 },
    { type: 'open', probability: 0.12 },
    { type: 'forest', probability: 0.76 }
  ];

// Function to assign random terrain to each hex based on defined probabilities
function generateTerrain() {
  const rand = Math.random(); // Generate a random number between 0 and 1
  let cumulativeProbability = 0;

  for (const terrain of terrainTypes) {
    cumulativeProbability += terrain.probability; // Increase the cumulative probability
    if (rand < cumulativeProbability) {
      return terrain.type; // Return the terrain type if the random number falls within its probability range
    }
  }
}

// Function to place and scale terrain tiles on the map
function placeTerrain(scene, terrain, x, y) {
    const scaleRatio = HEX_WIDTH / 210; // Calculate scale ratio based on hex width and original image size
    const image = scene.add.image(x, y, terrain).setOrigin(0.5, 0.5);
    image.setScale(scaleRatio); // Scale the image to fit within the hexagon
}

// Helper function to calculate hexagon coordinates for flat-topped orientation
function getHexCoordinatesFlatTop(q, r) {
  const x = HEX_WIDTH * (3 / 4 * q);
  const y = HEX_HEIGHT * (r + q / 2);
  return { x, y };
}

function create() {
    console.log('Creating hex grid...');
    const graphics = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0 }, lineStyle: { width: 2, color: 0xFFF1E6 } });

    // Calculate number of hexagons needed
    const numHexesX = Math.ceil(config.width / HEX_WIDTH);
    const numHexesY = Math.ceil(config.height / (0.75 * HEX_HEIGHT));

    for (let q = -numHexesX; q <= numHexesX; q++) {
        for (let r = -numHexesY; r <= numHexesY; r++) {
            const { x, y } = getHexCoordinatesFlatTop(q, r);
            console.log(`Drawing hex at: (${x}, ${y})`);
            drawHexagonFlatTop(graphics, x + config.width / 2, y + config.height / 2);
            
            // Generate terrain for this hex
            const terrain = generateTerrain();
            placeTerrain(this, terrain, x + config.width / 2, y + config.height / 2);
        }
    }
}

// Function to draw an individual flat-topped hexagon
function drawHexagonFlatTop(graphics, centerX, centerY) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i;
    const angleRad = Math.PI / 180 * angleDeg;
    points.push({
      x: centerX + HEX_SIZE * Math.cos(angleRad),
      y: centerY + HEX_SIZE * Math.sin(angleRad)
    });
  }

  // Draw and fill the hexagon
  graphics.beginPath();
  graphics.moveTo(points[0].x, points[0].y);
  for (const point of points.slice(1)) {
    graphics.lineTo(point.x, point.y);
  }
  graphics.lineTo(points[0].x, points[0].y);
  graphics.closePath();
  graphics.fillPath(); // Fill the hexagon with the current fill style (brown)
  graphics.strokePath(); // Outline the hexagon with the current line style (white)
}