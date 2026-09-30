import { LayoutReviewScene } from './scenes/LayoutReviewScene.js?v=20260930-1';
import { MapScene } from './scenes/MapScene.js?v=20260929-7';
import { GameScene } from './scenes/GameScene.js?v=20260929-7';

const params = new URLSearchParams(window.location.search);
const forcedFrame = params.get('frame');
const isPortrait = forcedFrame === 'portrait'
  ? true
  : forcedFrame === 'landscape'
    ? false
    : window.innerHeight > window.innerWidth;

const DESIGN = isPortrait
  ? { width: 1080, height: 1920, className: 'portrait-frame' }
  : { width: 1920, height: 1080, className: 'landscape-frame' };

const root = document.getElementById('game-root');
root?.classList.add(DESIGN.className);

let initialScene = [LayoutReviewScene, MapScene, GameScene];
if (params.get('legacy') === 'map') initialScene = [MapScene, LayoutReviewScene, GameScene];
if (params.get('legacy') === 'game') initialScene = [GameScene, LayoutReviewScene, MapScene];

function showBootError(message) {
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
  if (typeof Phaser === 'undefined') throw new Error('Phaser не загрузился');

  const config = {
    type: Phaser.AUTO,
    parent: 'game-root',
    backgroundColor: '#061b18',
    width: DESIGN.width,
    height: DESIGN.height,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: DESIGN.width,
      height: DESIGN.height,
      expandParent: false,
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    input: { activePointers: 3 },
    scene: initialScene,
  };

  new Phaser.Game(config);

  if (!forcedFrame) {
    let lastPortrait = isPortrait;
    let timer = null;
    window.addEventListener('resize', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const nowPortrait = window.innerHeight > window.innerWidth;
        if (nowPortrait !== lastPortrait) {
          lastPortrait = nowPortrait;
          window.location.reload();
        }
      }, 180);
    });
  }
} catch (error) {
  console.error('[Mahjong Lotus] boot failed', error);
  showBootError(error?.message || String(error));
}
