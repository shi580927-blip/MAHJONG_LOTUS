export const C = { ink: '#173f36', muted: '#698579', jade: 0x145347, gold: 0xc3a25e, ivory: 0xf8f2e4, pink: 0xd58d9b };
export function text(s, x, y, value, size = 28, color = C.ink, serif = false) {
  return s.add.text(x, y, value, { fontFamily: serif ? 'Georgia, serif' : 'Arial, sans-serif', fontSize: `${size}px`, color, align: 'center' }).setOrigin(.5);
}
export function panel(s, x, y, w, h, fill = C.ivory, alpha = 1, radius = 26) {
  const g = s.add.graphics();
  g.fillStyle(0x082f28, .12).fillRoundedRect(x - w/2, y - h/2 + 7, w, h, radius);
  g.fillStyle(fill, alpha).fillRoundedRect(x - w/2, y - h/2, w, h, radius);
  g.lineStyle(2, C.gold, .85).strokeRoundedRect(x - w/2, y - h/2, w, h, radius);
  return g;
}
export function button(s, x, y, w, h, title, action, primary = false, size = 28) {
  const bg = panel(s, 0, 0, w, h, primary ? C.jade : C.ivory);
  const label = text(s, 0, 0, title, size, primary ? '#fff4d6' : C.ink);
  const hit = s.add.zone(0, 0, w, h).setInteractive({ useHandCursor: true });
  const container = s.add.container(x, y, [bg, label, hit]);
  hit.on('pointerover', () => { bg.setAlpha(.84); });
  hit.on('pointerout', () => { bg.setAlpha(1); });
  hit.on('pointerup', () => { if (!s.modal || container.getData('modal')) { s.tone?.(); action(); } });
  container.setData('label', label);
  return container;
}
export function lotus(s, x, y, scale = 1, pink = false) {
  const g = s.add.graphics();
  g.fillStyle(pink ? C.pink : 0xf1dec0, 1);
  for (let i = -2; i <= 2; i++) {
    const a = i * .48;
    g.fillEllipse(x + Math.sin(a) * 35 * scale, y - Math.cos(a) * 22 * scale, 26 * scale, (70 - Math.abs(i)*10) * scale);
  }
  g.lineStyle(2, C.gold, .9).strokeEllipse(x, y + 14 * scale, 104 * scale, 28 * scale);
  return g;
}
