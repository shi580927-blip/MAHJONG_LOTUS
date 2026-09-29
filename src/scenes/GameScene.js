export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.level = 1;
  }

  init(data) {
    const requested = Number(data?.level || 1);
    this.level = Phaser.Math.Clamp(Number.isFinite(requested) ? requested : 1, 1, 60);
  }

  preload() {
    this.load.image(
      'ch1_level_bg_16x9',
      'assets/runtime/backgrounds/ch1/gameplay/ch1_level_bg_16x9.webp?v=20260929-4'
    );
    this.load.image(
      'ch1_level_bg_9x16',
      'assets/runtime/backgrounds/ch1/gameplay/ch1_level_bg_9x16.webp?v=20260929-4'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#0d3b32');
    this.createBackground();
    this.createHud();

    this.scale.on('resize', () => this.scene.restart({ level: this.level }));
  }

  createBackground() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const key = portrait ? 'ch1_level_bg_9x16' : 'ch1_level_bg_16x9';

    if (!this.textures.exists(key)) {
      const g = this.add.graphics().setDepth(-100);
      g.fillGradientStyle(0x163f38, 0x1f5b4d, 0x0a2b27, 0x0e3931, 1);
      g.fillRect(0, 0, width, height);
      return;
    }

    const source = this.textures.get(key).getSourceImage();
    const scale = Math.max(width / source.width, height / source.height);

    this.add.image(width / 2, height / 2, key)
      .setOrigin(0.5)
      .setScale(scale)
      .setDepth(-100);

    // Very light readability veil. The artwork remains visible, but the future
    // tile field gets a calmer center without baking anything into the image.
    const veil = this.add.graphics().setDepth(-90);
    veil.fillStyle(0x062f29, portrait ? 0.07 : 0.05);
    veil.fillRect(0, 0, width, height);
  }

  createHud() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const edge = Phaser.Math.Clamp(width * 0.045, 14, 32);
    const top = edge;
    const titleSize = portrait
      ? Phaser.Math.Clamp(width * 0.074, 26, 34)
      : Phaser.Math.Clamp(height * 0.05, 28, 38);

    this.add.text(edge, top, 'Уровень', {
      fontFamily: 'Georgia, serif',
      fontSize: `${Math.round(titleSize * 0.52)}px`,
      color: '#f4dfaa',
      stroke: '#123b31',
      strokeThickness: 5,
    }).setDepth(1000);

    this.add.text(edge, top + titleSize * 0.52, String(this.level), {
      fontFamily: 'Georgia, serif',
      fontSize: `${Math.round(titleSize)}px`,
      fontStyle: 'bold',
      color: '#fff3cc',
      stroke: '#123b31',
      strokeThickness: 6,
    }).setDepth(1000);

    const backW = portrait
      ? Phaser.Math.Clamp(width * 0.29, 118, 160)
      : Phaser.Math.Clamp(width * 0.13, 130, 176);
    const backH = Phaser.Math.Clamp(height * 0.07, 48, 62);
    const backX = width - edge - backW / 2;
    const backY = edge + backH / 2;

    const back = this.add.rectangle(backX, backY, backW, backH, 0x075247, 0.94)
      .setStrokeStyle(3, 0xe1b44b, 1)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(backX, backY, 'На карту', {
      fontFamily: 'Georgia, serif',
      fontSize: `${Phaser.Math.Clamp(width * (portrait ? 0.045 : 0.018), 17, 22)}px`,
      color: '#fff3cc',
    }).setOrigin(0.5).setDepth(1001);

    const goBack = () => this.scene.start('MapScene');
    back.on('pointerdown', goBack);
    label.setInteractive({ useHandCursor: true }).on('pointerdown', goBack);

    if (new URLSearchParams(window.location.search).get('debug') === '1') {
      this.drawSafeAreaGuide();
    }
  }

  drawSafeAreaGuide() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const g = this.add.graphics().setDepth(900);

    const top = portrait ? height * 0.12 : height * 0.14;
    const bottom = portrait ? height * 0.82 : height * 0.80;
    const side = portrait ? width * 0.08 : width * 0.12;

    g.lineStyle(2, 0xffffff, 0.35);
    g.strokeRect(side, top, width - side * 2, bottom - top);

    this.add.text(side + 8, top + 6, 'SAFE AREA', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#ffffff',
    }).setAlpha(0.55).setDepth(901);
  }
}
