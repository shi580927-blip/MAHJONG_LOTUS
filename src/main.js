import { MapScene } from './scenes/MapScene.js?v=20260930-1';
import { GameScene } from './scenes/GameScene.js?v=20260930-1';

const params = new URLSearchParams(window.location.search);
const initialScene = params.get('screen') === 'game'
  ? [GameScene, MapScene]
  : [MapScene, GameScene];

function designSize() {
  const portrait = window.innerHeight > window.innerWidth;
  return portrait
    ? { width: 1080, height: 1920, portrait: true }
    : { width: 1920, height: 1080, portrait: false };
}

let design = designSize();

const config = {
  type: Phaser.AUTO,
  parent: 'game-root',
  backgroundColor: '#071b18',
  width: design.width,
  height: design.height,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: design.width,
    height: design.height,
  },
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: false,
  },
  input: {
    activePointers: 3,
  },
  scene: initialScene,
};

const game = new Phaser.Game(config);

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    const next = designSize();
    if (next.portrait !== design.portrait) {
      design = next;
      game.scale.setGameSize(design.width, design.height);
      game.scale.refresh();
      const active = game.scene.getScenes(true)[0];
      if (active) {
        const data = active.scene.key === 'GameScene' ? { level: active.level || 1 } : undefined;
        active.scene.restart(data);
      }
    } else {
      game.scale.refresh();
    }
  }, 120);
});
