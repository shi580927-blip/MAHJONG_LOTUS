import { MapScene } from './scenes/MapScene.js?v=20260929-2';

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#071f1b',
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
  input: {
    activePointers: 3,
  },
  scene: [MapScene, GameScene],
};

new Phaser.Game(config);
