const COLORS = {
  matte: 0x061b18,
  frame: 0x102f2a,
  safe: 0x143d35,
  safeAlt: 0x1b4b41,
  line: 0xd6ad4a,
  text: '#fff0c9',
  muted: '#b9cfc8',
  board: 0xf4ead3,
  boardLine: 0xc79b3d,
};

export class LayoutReviewScene extends Phaser.Scene {
  constructor() {
    super('LayoutReviewScene');
  }

  create() {
    const params = new URLSearchParams(window.location.search);
    this.mode = params.get('screen') === 'game' ? 'game' : 'map';

    this.cameras.main.setBackgroundColor(COLORS.matte);

    if (this.mode === 'game') this.drawGameplayWireframe();
    else this.drawMapWireframe();

    this.drawHeader();
  }

  drawHeader() {
    const { width, height } = this.scale;
    const portrait = height > width;
    const pad = portrait ? 30 : 36;
    const size = portrait ? 28 : 30;
    const label = this.mode === 'game' ? 'GAMEPLAY WIREFRAME' : 'MAP WIREFRAME';

    this.add.text(width / 2, pad, `${label} · ${width}×${height}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: `${size}px`,
      fontStyle: 'bold',
      color: COLORS.text,
      backgroundColor: '#061b18cc',
      padding: { x: 18, y: 10 },
    }).setOrigin(0.5, 0).setDepth(1000);

    const switchLabel = this.mode === 'game' ? 'Карта' : 'Игровой экран';
    const switchW = portrait ? 250 : 260;
    const switchH = portrait ? 74 : 64;
    const x = width - pad - switchW / 2;
    const y = pad + switchH / 2;

    const button = this.add.rectangle(x, y, switchW, switchH, 0x075247, 0.98)
      .setStrokeStyle(3, COLORS.line, 1)
      .setInteractive({ useHandCursor: true })
      .setDepth(1001);

    const buttonText = this.add.text(x, y, switchLabel, {
      fontFamily: 'Arial, sans-serif',
      fontSize: portrait ? '25px' : '22px',
      color: COLORS.text,
    }).setOrigin(0.5).setDepth(1002).setInteractive({ useHandCursor: true });

    const navigate = () => {
      const url = new URL(window.location.href);
      url.searchParams.set('screen', this.mode === 'game' ? 'map' : 'game');
      window.location.href = url.toString();
    };
    button.on('pointerdown', navigate);
    buttonText.on('pointerdown', navigate);
  }

  zone(x, y, w, h, label, fill = COLORS.safe, alpha = 0.44) {
    const g = this.add.graphics();
    g.fillStyle(fill, alpha);
    g.fillRect(x, y, w, h);
    g.lineStyle(3, COLORS.line, 0.75);
    g.strokeRect(x, y, w, h);

    this.add.text(x + 18, y + 16, label, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '24px',
      color: COLORS.muted,
      backgroundColor: '#061b1899',
      padding: { x: 8, y: 5 },
    }).setDepth(50);
  }

  drawMapWireframe() {
    const { width, height } = this.scale;
    const portrait = height > width;

    const g = this.add.graphics();
    g.fillStyle(COLORS.frame, 1);
    g.fillRect(0, 0, width, height);

    if (portrait) {
      const hudH = 220;
      const navY = 1680;
      this.zone(0, 0, width, hudH, 'HUD SAFE · 0–220');
      this.zone(0, navY, width, height - navY, 'BOTTOM NAV SAFE · 1680–1920', COLORS.safeAlt);
      this.zone(90, 250, 900, 1390, 'PATH CORRIDOR · TEST', 0x0b5648, 0.24);

      const pts = [
        [270, 1520], [660, 1330], [370, 1130], [720, 930],
        [350, 720], [690, 510], [500, 330],
      ];
      this.drawPathAndNodes(pts, true);
    } else {
      const hudH = 150;
      const navY = 930;
      this.zone(0, 0, width, hudH, 'HUD SAFE · 0–150');
      this.zone(0, navY, width, height - navY, 'BOTTOM NAV SAFE · 930–1080', COLORS.safeAlt);
      this.zone(120, 180, 1680, 720, 'PATH CORRIDOR · TEST', 0x0b5648, 0.24);

      const pts = [
        [220, 700], [470, 560], [730, 690], [990, 500],
        [1250, 650], [1510, 470], [1740, 620],
      ];
      this.drawPathAndNodes(pts, false);
    }
  }

  drawPathAndNodes(points, portrait) {
    const g = this.add.graphics();
    g.lineStyle(portrait ? 14 : 12, 0xd6ad4a, 0.85);

    for (let i = 0; i < points.length - 1; i++) {
      g.lineBetween(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    }

    points.forEach((p, i) => {
      const milestone = (i + 1) % 5 === 0;
      const r = milestone ? (portrait ? 74 : 62) : (portrait ? 62 : 52);
      g.fillStyle(i < 3 ? 0xf4ead3 : i === 3 ? 0xe989ad : 0x767b78, 1);
      g.fillCircle(p[0], p[1], r);
      g.lineStyle(7, 0xd6ad4a, 1);
      g.strokeCircle(p[0], p[1], r);

      this.add.text(p[0], p[1], String(i + 1), {
        fontFamily: 'Arial, sans-serif',
        fontSize: portrait ? '34px' : '30px',
        fontStyle: 'bold',
        color: '#062c26',
      }).setOrigin(0.5).setDepth(20);
    });

    this.add.text(
      portrait ? 540 : 960,
      portrait ? 1600 : 875,
      portrait ? 'Путь читается снизу вверх' : 'Путь читается слева направо',
      {
        fontFamily: 'Arial, sans-serif',
        fontSize: portrait ? '25px' : '23px',
        color: COLORS.text,
      }
    ).setOrigin(0.5);
  }

  drawGameplayWireframe() {
    const { width, height } = this.scale;
    const portrait = height > width;

    const g = this.add.graphics();
    g.fillStyle(COLORS.frame, 1);
    g.fillRect(0, 0, width, height);

    if (portrait) {
      this.zone(0, 0, width, 220, 'HUD SAFE · 0–220');
      this.zone(80, 260, 920, 1240, 'BOARD SAFE · 80–1000 / 260–1500', 0x665c45, 0.27);
      this.zone(0, 1580, width, 340, 'BOOSTERS SAFE · 1580–1920', COLORS.safeAlt);
      this.drawTilePlaceholder(540, 880, 760, 960, true);
      this.drawBoosterPlaceholders(540, 1715, true);
    } else {
      this.zone(0, 0, width, 160, 'HUD SAFE · 0–160');
      this.zone(300, 170, 1320, 680, 'BOARD SAFE · 300–1620 / 170–850', 0x665c45, 0.27);
      this.zone(0, 880, width, 200, 'BOOSTERS SAFE · 880–1080', COLORS.safeAlt);
      this.drawTilePlaceholder(960, 510, 1120, 560, false);
      this.drawBoosterPlaceholders(960, 965, false);
    }
  }

  drawTilePlaceholder(cx, cy, w, h, portrait) {
    const g = this.add.graphics();
    g.lineStyle(4, COLORS.boardLine, 0.8);
    g.strokeRoundedRect(cx - w / 2, cy - h / 2, w, h, 24);

    const cols = portrait ? 6 : 10;
    const rows = portrait ? 8 : 5;
    const gap = portrait ? 12 : 14;
    const tileW = (w - gap * (cols + 1)) / cols;
    const tileH = Math.min(tileW * 1.28, (h - gap * (rows + 1)) / rows);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if ((row === 0 || row === rows - 1) && (col === 0 || col === cols - 1)) continue;
        const x = cx - w / 2 + gap + tileW / 2 + col * (tileW + gap);
        const y = cy - h / 2 + gap + tileH / 2 + row * (tileH + gap);
        g.fillStyle(COLORS.board, 0.78);
        g.fillRoundedRect(x - tileW / 2, y - tileH / 2, tileW, tileH, 10);
        g.lineStyle(2, COLORS.boardLine, 0.75);
        g.strokeRoundedRect(x - tileW / 2, y - tileH / 2, tileW, tileH, 10);
      }
    }

    this.add.text(cx, cy, 'РАСКЛАДКА / TILE FIELD', {
      fontFamily: 'Arial, sans-serif',
      fontSize: portrait ? '28px' : '27px',
      fontStyle: 'bold',
      color: '#493b22',
      backgroundColor: '#f4ead3dd',
      padding: { x: 12, y: 8 },
    }).setOrigin(0.5).setDepth(30);
  }

  drawBoosterPlaceholders(cx, cy, portrait) {
    const g = this.add.graphics();
    const spacing = portrait ? 250 : 290;
    const radius = portrait ? 74 : 64;

    [-1, 0, 1].forEach((offset, i) => {
      const x = cx + offset * spacing;
      g.fillStyle(0x075247, 1);
      g.fillCircle(x, cy, radius);
      g.lineStyle(5, COLORS.line, 1);
      g.strokeCircle(x, cy, radius);
      this.add.text(x, cy, ['H', 'S', 'L'][i], {
        fontFamily: 'Arial, sans-serif',
        fontSize: portrait ? '38px' : '32px',
        fontStyle: 'bold',
        color: COLORS.text,
      }).setOrigin(0.5);
    });
  }
}
