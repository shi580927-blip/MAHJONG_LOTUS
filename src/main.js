import { MapScene } from './scenes/MapScene.js?v=20260929-6';
import { GameScene } from './scenes/GameScene.js?v=20260929-6';

const params = new URLSearchParams(window.location.search);
const initialScene = params.get('screen') === 'game'
  ? [GameScene, MapScene]
  : [MapScene, GameScene];

function showBootError(message) {
  const root = document.getElementById('game-root');
  if (!root) return;
  root.innerHTML = '';
  const box = document.createElement('div');
  box.style.cssText = [
    'position:absolute',
    'inset:0',
    'display:flex',
    'align-items:center',
    'justify-content:center',
    'padding:24px',
    'box-sizing:border-box',
    'background:#071f1b',
    'color:#fff3cc',
    'font:20px/1.45 Georgia,serif',
    'text-align:center'
  ].join(';');
  box.textContent = `Ошибка запуска игры: ${message}`;
  root.appendChild(box);
}

try {
  if (typeof Phaser === 'undefined') {
    throw new Error('Phaser не загрузился');
  }

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
    scene: initialScene,
  };

  new Phaser.Game(config);
} catch (error) {
  console.error('[Mahjong Lotus] boot failed', error);
  showBootError(error?.message || String(error));
}
