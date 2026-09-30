import { CHAPTER_1, nodeState } from '../data/mapChapter1.js';

const ATLAS_KEY = 'map_common';
const FRAME_BY_STATE = {
  completed: 'map_node_completed',
  current: 'map_node_current',
  available: 'map_node_available',
  locked: 'map_node_locked',
  milestone: 'map_node_milestone',
  chapter_end: 'map_node_chapter_end',
};

export class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
    this.currentLevel = 6;
    this.dragStart = null;
    this.worldExtent = 0;
    this.reviewArt = false;
  }

  preload() {
    this.reviewArt = new URLSearchParams(window.location.search).get('art') === '1';
    if (!this.reviewArt) return;

    this.load.atlas(
      ATLAS_KEY,
      'assets/runtime/atlases/map_common/map_common.webp?v=20260930-1',
      'assets/runtime/atlases/map_common/map_common.json?v=20260930-1'
    );
    this.load.image(
      'ch1_map_bg_16x9',
      'assets/runtime/backgrounds/ch1/map/ch1_map_bg_16x9.webp?v=20260930-1'
    );
    this.load.image(
      'ch1_map_bg_9x16',
      'assets/runtime/backgrounds/ch1/map/ch1_map_bg_9x16.webp?v=20260930-1'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#112a26');
    this.createFallbackMapTextures();
    this.buildPath();

    if (this.reviewArt) {
      const bgKey = this.scale.height > this.scale.width ? 'ch1_map_bg_9x16' : 'ch1_map_bg_16x9';
      if (this.textures.exists(bgKey)) this.createWorldBackground(bgKey);
      else this.createWireframeBackground();
    } else {
      this.createWireframeBackground();
    }

    this.createHud();
    this.enableMapScroll();
  }

  createFallbackMapTextures() {
    if (this.textures.exists('fallback_completed')) return;

    const specs = {
      completed: 0xe9e0c7,
      current: 0xff9fbd,
      available: 0xfff3d8,
      locked: 0x777d79,
      milestone: 0xf3c36b,
      chapter_end: 0xd9a64c,
    };

    Object.entries(specs).forEach(([state, fill]) => {
      const size = state === 'chapter_end' ? 192 : state === 'milestone' ? 176 : 160;
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x075247, 1);
      g.fillCircle(size / 2, size / 2, size * 0.34);
      g.lineStyle(Math.max(5, size * 0.035), 0xe0b34b, 1);
      g.strokeCircle(size / 2, size / 2, size * 0.34);
      g.fillStyle(fill, 1);
      g.fillCircle(size / 2, size / 2, size * 0.22);
      if (state === 'locked') {
        g.fillStyle(0xe0b34b, 1);
        g.fillRoundedRect(size * 0.41, size * 0.41, size * 0.18, size * 0.20, 8);
      }
      g.generateTexture(`fallback_${state}`, size, size);
      g.destroy();
    });

    const d = this.make.graphics({ x: 0, y: 0, add: false });
    d.fillStyle(0xe9bd54, 1);
    d.fillCircle(24, 24, 9);
    d.generateTexture('fallback_path_dot', 48, 48);
    d.destroy();
  }

  createWireframeBackground() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const g = this.add.graphics().setDepth(-100);

    g.fillStyle(0xe9e2d4, 1);
    g.fillRect(0, 0, portrait ? width : this.worldExtent, portrait ? this.worldExtent : height);

    // Fixed design frame zones.
    const topH = portrait ? 240 : 170;
    const bottomH = portrait ? 250 : 150;

    g.fillStyle(0x173e36, 0.14);
    g.fillRect(0, 0, portrait ? width : this.worldExtent, topH);

    if (portrait) {
      for (let y = height; y < this.worldExtent; y += height) {
        g.fillRect(0, y, width, topH);
      }
    }

    g.fillStyle(0x173e36, 0.10);
    if (portrait) {
      for (let y = bottomH; y < this.worldExtent; y += height) {
        g.fillRect(0, y - bottomH, width, bottomH);
      }
    } else {
      g.fillRect(0, height - bottomH, this.worldExtent, bottomH);
    }

    g.lineStyle(5, 0x0b5a4a, 0.42);
    if (portrait) {
      const corridorW = width * 0.72;
      g.strokeRect((width - corridorW) / 2, topH, corridorW, this.worldExtent - topH - bottomH);
    } else {
      const corridorH = height - topH - bottomH;
      g.strokeRect(0, topH, this.worldExtent, corridorH);
    }

    this.add.text(width / 2, portrait ? 285 : 205, 'WIREFRAME · PATH CORRIDOR', {
      fontFamily: 'Arial, sans-serif',
      fontSize: portrait ? '30px' : '26px',
      color: '#31584f',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(-80);
  }

  createWorldBackground(bgKey) {
    const { width, height } = this.scale;
    const portrait = height > width;
    const source = this.textures.get(bgKey).getSourceImage();
    const scale = Math.max(width / source.width, height / source.height);
    const span = portrait ? height : width;
    const count = Math.ceil(this.worldExtent / span) + 1;

    for (let i = 0; i < count; i++) {
      const x = portrait ? width / 2 : i * span + width / 2;
      const y = portrait ? i * span + height / 2 : height / 2;
      this.add.image(x, y, bgKey)
        .setOrigin(0.5)
        .setScale(scale)
        .setFlipX(i % 2 === 1)
        .setDepth(-100);
    }

    const veil = this.add.graphics().setDepth(-90);
    veil.fillStyle(0x062f29, 0.22);
    if (portrait) veil.fillRect(0, 0, width, this.worldExtent);
    else veil.fillRect(0, 0, this.worldExtent, height);
  }

  createHud() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const edge = portrait ? 48 : 54;

    this.add.text(edge, edge, `Уровень ${this.currentLevel}`, {
      fontFamily: 'Georgia, serif',
      fontSize: portrait ? '54px' : '52px',
      fontStyle: 'bold',
      color: this.reviewArt ? '#fff3cc' : '#183f37',
      stroke: this.reviewArt ? '#123b31' : '#e9e2d4',
      strokeThickness: 6,
    }).setScrollFactor(0).setDepth(1000);

    const chapter = this.add.text(
      portrait ? width / 2 : width - edge,
      portrait ? 130 : edge + 8,
      `Глава I · ${CHAPTER_1.title}`,
      {
        fontFamily: 'Georgia, serif',
        fontSize: portrait ? '34px' : '34px',
        color: this.reviewArt ? '#f4dfaa' : '#31584f',
        stroke: this.reviewArt ? '#123b31' : '#e9e2d4',
        strokeThickness: 5,
        align: 'center',
      }
    ).setScrollFactor(0).setDepth(1000);

    chapter.setOrigin(portrait ? 0.5 : 1, 0);
  }

  buildPath() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const positions = portrait ? this.makePortraitPositions() : this.makeLandscapePositions();

    this.worldExtent = portrait
      ? positions[positions.length - 1].y + 300
      : positions[positions.length - 1].x + 360;

    if (portrait) this.cameras.main.setBounds(0, 0, width, this.worldExtent);
    else this.cameras.main.setBounds(0, 0, this.worldExtent, height);

    this.drawPathDots(positions);

    positions.forEach((p, index) => {
      const level = index + 1;
      let state = nodeState(level, this.currentLevel);
      if ([5, 10, 15].includes(level) && level < this.currentLevel) state = 'milestone';
      if (level === 20) state = this.currentLevel >= 20 ? 'chapter_end' : 'locked';

      const useAtlas = this.reviewArt && this.textures.exists(ATLAS_KEY);
      const node = useAtlas
        ? this.add.image(p.x, p.y, ATLAS_KEY, FRAME_BY_STATE[state])
        : this.add.image(p.x, p.y, `fallback_${state}`);

      const nodeScale = portrait ? 1.0 : 0.92;
      node
        .setScale(level % 5 === 0 ? nodeScale * 1.12 : nodeScale)
        .setDepth(20)
        .setInteractive({ useHandCursor: state !== 'locked' });

      this.add.text(p.x, p.y + (portrait ? 82 : 72), String(level), {
        fontFamily: 'Georgia, serif',
        fontSize: portrait ? '34px' : '30px',
        fontStyle: 'bold',
        color: this.reviewArt ? '#fff6d5' : '#163f37',
        stroke: this.reviewArt ? '#0a4036' : '#f3ead9',
        strokeThickness: 5,
      }).setOrigin(0.5).setDepth(30);

      if (state !== 'locked') node.on('pointerdown', () => this.onNodePressed(level));
    });

    const target = positions[Math.max(0, this.currentLevel - 1)];
    if (portrait) {
      this.cameras.main.scrollY = Phaser.Math.Clamp(
        target.y - height * 0.55, 0, Math.max(0, this.worldExtent - height)
      );
    } else {
      this.cameras.main.scrollX = Phaser.Math.Clamp(
        target.x - width * 0.42, 0, Math.max(0, this.worldExtent - width)
      );
    }
  }

  drawPathDots(positions) {
    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i];
      const b = positions[i + 1];
      const distance = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      const count = Math.max(2, Math.floor(distance / 58));
      for (let n = 1; n < count; n++) {
        const t = n / count;
        const useAtlas = this.reviewArt && this.textures.exists(ATLAS_KEY);
        const dot = useAtlas
          ? this.add.image(Phaser.Math.Linear(a.x, b.x, t), Phaser.Math.Linear(a.y, b.y, t), ATLAS_KEY, 'map_path_dot')
          : this.add.image(Phaser.Math.Linear(a.x, b.x, t), Phaser.Math.Linear(a.y, b.y, t), 'fallback_path_dot');
        dot.setScale(useAtlas ? 0.34 : 0.48).setAlpha(i + 1 < this.currentLevel ? 0.95 : 0.45).setDepth(5);
      }
    }
  }

  makePortraitPositions() {
    const width = 1080;
    const edge = 170;
    const usable = width - edge * 2;
    const startY = 320;
    const stepY = 225;

    return Array.from({ length: 20 }, (_, i) => ({
      x: edge + usable * (0.5 + Math.sin(i * 0.88) * 0.43),
      y: startY + i * stepY,
    }));
  }

  makeLandscapePositions() {
    const height = 1080;
    const minY = 245;
    const maxY = 840;
    const centerY = (minY + maxY) / 2;
    const amplitude = 245;
    const startX = 210;
    const stepX = 275;

    return Array.from({ length: 20 }, (_, i) => ({
      x: startX + i * stepX,
      y: Phaser.Math.Clamp(centerY + Math.sin(i * 0.95) * amplitude, minY, maxY),
    }));
  }

  enableMapScroll() {
    const cam = this.cameras.main;
    const portrait = this.scale.height > this.scale.width;

    this.input.on('pointerdown', pointer => {
      this.dragStart = { x: pointer.x, y: pointer.y, scrollX: cam.scrollX, scrollY: cam.scrollY };
    });

    this.input.on('pointermove', pointer => {
      if (!pointer.isDown || !this.dragStart) return;
      if (portrait) cam.scrollY = this.dragStart.scrollY + (this.dragStart.y - pointer.y);
      else cam.scrollX = this.dragStart.scrollX + (this.dragStart.x - pointer.x);
    });

    this.input.on('pointerup', () => { this.dragStart = null; });
    this.input.on('wheel', (_pointer, _objects, dx, dy) => {
      if (portrait) cam.scrollY += dy * 0.8;
      else cam.scrollX += (Math.abs(dx) > Math.abs(dy) ? dx : dy) * 0.8;
    });
  }

  onNodePressed(level) {
    if (level > this.currentLevel + 1) return;
    this.scene.start('GameScene', { level });
  }
}
