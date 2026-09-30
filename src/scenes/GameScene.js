export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.level = 1;
    this.reviewArt = false;
  }

  init(data) {
    const requested = Number(data?.level || 1);
    this.level = Phaser.Math.Clamp(Number.isFinite(requested) ? requested : 1, 1, 60);
  }

  preload() {
    this.reviewArt = new URLSearchParams(window.location.search).get('art') === '1';
    if (!this.reviewArt) return;

    this.load.image(
      'ch1_level_bg_16x9',
      'assets/runtime/backgrounds/ch1/gameplay/ch1_level_bg_16x9.webp?v=20260930-1'
    );
    this.load.image(
      'ch1_level_bg_9x16',
      'assets/runtime/backgrounds/ch1/gameplay/ch1_level_bg_9x16.webp?v=20260930-1'
    );
  }

  create() {
    this.cameras.main.setBackgroundColor('#112a26');
    if (this.reviewArt) this.createArtBackground();
    else this.createWireframe();
    this.createHud();
  }

  createWireframe() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const g = this.add.graphics().setDepth(-100);

    g.fillStyle(0xe9e2d4, 1);
    g.fillRect(0, 0, width, height);

    const topH = portrait ? 240 : 170;
    const bottomH = portrait ? 320 : 220;
    g.fillStyle(0x173e36, 0.14);
    g.fillRect(0, 0, width, topH);
    g.fillRect(0, height - bottomH, width, bottomH);

    const board = portrait
      ? { x: 95, y: 285, w: 890, h: 1260 }
      : { x: 255, y: 205, w: 1410, h: 635 };

    g.fillStyle(0x0b5a4a, 0.07);
    g.fillRoundedRect(board.x, board.y, board.w, board.h, 36);
    g.lineStyle(6, 0x0b5a4a, 0.48);
    g.strokeRoundedRect(board.x, board.y, board.w, board.h, 36);

    this.add.text(board.x + board.w / 2, board.y + board.h / 2, 'MAHJONG BOARD SAFE AREA', {
      fontFamily: 'Arial, sans-serif',
      fontSize: portrait ? '38px' : '34px',
      fontStyle: 'bold',
      color: '#31584f',
    }).setOrigin(0.5).setDepth(-80);

    this.add.text(width / 2, height - bottomH / 2, 'BOOSTERS / BOTTOM UI', {
      fontFamily: 'Arial, sans-serif',
      fontSize: portrait ? '34px' : '30px',
      fontStyle: 'bold',
      color: '#31584f',
    }).setOrigin(0.5).setDepth(-80);
  }

  createArtBackground() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const key = portrait ? 'ch1_level_bg_9x16' : 'ch1_level_bg_16x9';
    if (!this.textures.exists(key)) {
      this.createWireframe();
      return;
    }

    const source = this.textures.get(key).getSourceImage();
    const scale = Math.max(width / source.width, height / source.height);
    this.add.image(width / 2, height / 2, key).setOrigin(0.5).setScale(scale).setDepth(-100);

    const veil = this.add.graphics().setDepth(-90);
    veil.fillStyle(0x062f29, 0.15);
    veil.fillRect(0, 0, width, height);
  }

  createHud() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const edge = portrait ? 48 : 54;

    this.add.text(edge, edge, 'Уровень', {
      fontFamily: 'Georgia, serif',
      fontSize: portrait ? '30px' : '28px',
      color: this.reviewArt ? '#f4dfaa' : '#31584f',
      stroke: this.reviewArt ? '#123b31' : '#e9e2d4',
      strokeThickness: 5,
    }).setDepth(1000);

    this.add.text(edge, portrait ? 82 : 78, String(this.level), {
      fontFamily: 'Georgia, serif',
      fontSize: portrait ? '58px' : '56px',
      fontStyle: 'bold',
      color: this.reviewArt ? '#fff3cc' : '#183f37',
      stroke: this.reviewArt ? '#123b31' : '#e9e2d4',
      strokeThickness: 6,
    }).setDepth(1000);

    const backW = portrait ? 250 : 210;
    const backH = portrait ? 86 : 68;
    const backX = width - edge - backW / 2;
    const backY = edge + backH / 2;

    const back = this.add.rectangle(
      backX, backY, backW, backH,
      this.reviewArt ? 0x075247 : 0xd8c9ad,
      0.96
    ).setStrokeStyle(4, this.reviewArt ? 0xe1b44b : 0x31584f, 1)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });

    const label = this.add.text(backX, backY, 'На карту', {
      fontFamily: 'Georgia, serif',
      fontSize: portrait ? '32px' : '26px',
      color: this.reviewArt ? '#fff3cc' : '#183f37',
    }).setOrigin(0.5).setDepth(1001);

    const goBack = () => this.scene.start('MapScene');
    back.on('pointerdown', goBack);
    label.setInteractive({ useHandCursor: true }).on('pointerdown', goBack);
  }
}
