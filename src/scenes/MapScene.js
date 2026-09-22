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
  }

  preload() {
    this.load.atlas(
      ATLAS_KEY,
      'assets/runtime/atlases/map_common/map_common.webp?v=20260922-1',
      'assets/runtime/atlases/map_common/map_common.json?v=20260922-1'
    );

    this.load.image(
      'ch1_bg_master',
      'assets/runtime/backgrounds/ch1/ch1_bg_master.webp?v=20260922-1'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#0d3b32');

    if (!this.textures.exists(ATLAS_KEY)) {
      this.createFallbackMapTextures();
    }

    this.buildPath();

    if (this.textures.exists('ch1_bg_master')) {
      this.createWorldBackground();
    } else {
      this.createFallbackBackground();
    }

    this.createHud();
    this.enableMapScroll();

    this.scale.on('resize', () => this.scene.restart());
  }

  createFallbackMapTextures() {
    const specs = {
      completed: 0xf7efd8,
      current: 0xff79a9,
      available: 0xf8f0dc,
      locked: 0x777777,
      milestone: 0xff8eb7,
      chapter_end: 0xffa3c3,
    };

    Object.entries(specs).forEach(([state, fill]) => {
      const size = state === 'chapter_end' ? 192 : state === 'milestone' ? 176 : 160;
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x064d42, 1);
      g.fillCircle(size / 2, size * 0.58, size * 0.34);
      g.lineStyle(Math.max(4, size * 0.035), 0xe8b94f, 1);
      g.strokeCircle(size / 2, size * 0.58, size * 0.34);
      g.fillStyle(fill, 1);
      g.fillCircle(size / 2, size * 0.43, size * 0.23);

      if (state === 'locked') {
        g.fillStyle(0xe8b94f, 1);
        g.fillRoundedRect(size * 0.38, size * 0.38, size * 0.24, size * 0.22, 8);
      }

      g.generateTexture(`fallback_${state}`, size, size);
      g.destroy();
    });

    const d = this.make.graphics({ x: 0, y: 0, add: false });
    d.fillStyle(0xf5c451, 1);
    d.fillCircle(24, 24, 11);
    d.lineStyle(3, 0xffefb0, 1);
    d.strokeCircle(24, 24, 11);
    d.generateTexture('fallback_path_dot', 48, 48);
    d.destroy();
  }

  createWorldBackground() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const srcW = 1920;
    const srcH = 1080;

    // TEST background pass: one approved-style Chapter 1 master is repeated/mirrored
    // to cover the whole scrollable path. Final Batch D will replace this with
    // ch1_bg_far / ch1_bg_water / ch1_fg_soft without changing the map logic.
    const scale = Math.max(width / srcW, height / srcH) * 1.06;
    const chunkW = srcW * scale;
    const chunkH = srcH * scale;
    const span = portrait ? Math.max(height * 0.92, chunkH * 0.72) : Math.max(width * 0.92, chunkW * 0.72);
    const count = Math.ceil(this.worldExtent / span) + 1;

    for (let i = 0; i < count; i++) {
      const x = portrait ? width / 2 : i * span + span / 2;
      const y = portrait ? i * span + span / 2 : height / 2;

      this.add.image(x, y, 'ch1_bg_master')
        .setOrigin(0.5)
        .setScale(scale)
        .setFlipX(i % 2 === 1)
        .setDepth(-100);
    }

    const veil = this.add.graphics().setDepth(-90);
    veil.fillStyle(0x062f29, 0.12);
    if (portrait) {
      veil.fillRect(0, 0, width, this.worldExtent);
    } else {
      veil.fillRect(0, 0, this.worldExtent, height);
    }
  }

  createFallbackBackground() {
    const { width, height } = this.scale;
    const g = this.add.graphics().setScrollFactor(0).setDepth(-100);
    g.fillGradientStyle(0x123f35, 0x164f43, 0x071f1b, 0x0a2f29, 1);
    g.fillRect(0, 0, width, height);

    for (let i = 0; i < 18; i++) {
      const x = (i * 173) % width;
      const y = 90 + ((i * 97) % Math.max(160, height - 180));
      g.fillStyle(0xffffff, 0.035);
      g.fillCircle(x, y, 80 + (i % 4) * 22);
    }
  }

  createHud() {
    const { width } = this.scale;
    const portrait = this.scale.height > width;
    const pad = portrait ? 18 : 26;

    const title = this.add.text(pad, pad, `Уровень ${this.currentLevel}`, {
      fontFamily: 'Georgia, serif',
      fontSize: portrait ? '30px' : '34px',
      fontStyle: 'bold',
      color: '#fff3cc',
      stroke: '#123b31',
      strokeThickness: 6,
    }).setScrollFactor(0).setDepth(1000);

    const chapter = this.add.text(width - pad, pad + 4, `Глава I · ${CHAPTER_1.title}`, {
      fontFamily: 'Georgia, serif',
      fontSize: portrait ? '18px' : '22px',
      color: '#f4dfaa',
      stroke: '#123b31',
      strokeThickness: 5,
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1000);

    if (portrait && chapter.width > width * 0.56) chapter.setFontSize(16);
    return { title, chapter };
  }

  buildPath() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const positions = portrait
      ? this.makePortraitPositions(width)
      : this.makeLandscapePositions(height);

    this.worldExtent = portrait
      ? positions[positions.length - 1].y + 260
      : positions[positions.length - 1].x + 320;

    if (portrait) {
      this.cameras.main.setBounds(0, 0, width, this.worldExtent);
    } else {
      this.cameras.main.setBounds(0, 0, this.worldExtent, height);
    }

    this.drawPathDots(positions);

    positions.forEach((p, index) => {
      const level = index + 1;
      let state = nodeState(level, this.currentLevel);
      if ([5, 10, 15].includes(level) && level < this.currentLevel) state = 'milestone';
      if (level === 20) state = this.currentLevel >= 20 ? 'chapter_end' : 'locked';

      const hasAtlas = this.textures.exists(ATLAS_KEY);
      const node = hasAtlas
        ? this.add.image(p.x, p.y, ATLAS_KEY, FRAME_BY_STATE[state])
        : this.add.image(p.x, p.y, `fallback_${state}`);

      node
        .setDepth(20)
        .setInteractive({ useHandCursor: state !== 'locked' });

      const scale = portrait ? 0.72 : 0.78;
      node.setScale(level % 5 === 0 ? scale * 1.08 : scale);

      this.add.text(p.x, p.y + (portrait ? 49 : 54), String(level), {
        fontFamily: 'Georgia, serif',
        fontSize: portrait ? '22px' : '24px',
        fontStyle: 'bold',
        color: '#fff6d5',
        stroke: '#0a4036',
        strokeThickness: 5,
      }).setOrigin(0.5).setDepth(30);

      if (state !== 'locked') {
        node.on('pointerdown', () => this.onNodePressed(level));
      }
    });

    const target = positions[Math.max(0, this.currentLevel - 1)];
    if (portrait) {
      this.cameras.main.scrollY = Phaser.Math.Clamp(
        target.y - height * 0.55,
        0,
        Math.max(0, this.worldExtent - height)
      );
    } else {
      this.cameras.main.scrollX = Phaser.Math.Clamp(
        target.x - width * 0.45,
        0,
        Math.max(0, this.worldExtent - width)
      );
    }
  }

  drawPathDots(positions) {
    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i];
      const b = positions[i + 1];
      const distance = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y);
      const count = Math.max(2, Math.floor(distance / 44));

      for (let n = 1; n < count; n++) {
        const t = n / count;
        const dot = this.textures.exists(ATLAS_KEY)
          ? this.add.image(
              Phaser.Math.Linear(a.x, b.x, t),
              Phaser.Math.Linear(a.y, b.y, t),
              ATLAS_KEY,
              'map_path_dot'
            )
          : this.add.image(
              Phaser.Math.Linear(a.x, b.x, t),
              Phaser.Math.Linear(a.y, b.y, t),
              'fallback_path_dot'
            );

        dot
          .setScale(0.34)
          .setAlpha(i + 1 < this.currentLevel ? 0.95 : 0.48)
          .setDepth(5);
      }
    }
  }

  makePortraitPositions(width) {
    const margin = Math.max(100, width * 0.19);
    const usable = width - margin * 2;
    const stepY = 150;
    const startY = 180;

    return Array.from({ length: 20 }, (_, i) => ({
      x: margin + usable * (0.5 + Math.sin(i * 0.86) * 0.43),
      y: startY + i * stepY,
    }));
  }

  makeLandscapePositions(height) {
    const stepX = 175;
    const startX = 160;
    const centerY = height * 0.56;
    const amplitude = Math.min(190, height * 0.2);

    return Array.from({ length: 20 }, (_, i) => ({
      x: startX + i * stepX,
      y: centerY + Math.sin(i * 0.92) * amplitude,
    }));
  }

  enableMapScroll() {
    const cam = this.cameras.main;
    const portrait = this.scale.height > this.scale.width;

    this.input.on('pointerdown', pointer => {
      this.dragStart = {
        x: pointer.x,
        y: pointer.y,
        scrollX: cam.scrollX,
        scrollY: cam.scrollY,
      };
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
    console.log(`[MapScene] open level ${level}`);
  }
}
