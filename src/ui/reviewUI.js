export const C = { ink: '#173f36', muted: '#698579', jade: 0x145347, gold: 0xc3a25e, ivory: 0xf8f2e4, pink: 0xd58d9b };
export function text(s, x, y, value, size = 28, color = C.ink, serif = false) {
  return s.add.text(x, y, value, { fontFamily: serif ? 'Georgia, serif' : 'Arial, sans-serif', fontSize: `${size}px`, color, align: 'center' }).setOrigin(.5);
}
export function panel(s, x, y, w, h, fill = C.ivory, alpha = 1, radius = 26) {
  const g = s.add.graphics();
  g.fillStyle(0x082f28, .12).fillRoundedRect(x - w/2, y - h/2 + 7, w, h, radius);
  g.fillStyle(fill, alpha).fillRoundedRect(x - w/2, y - h/2, w, h, radius);
  g.lineStyle(1, 0xffe7ac, .8).strokeRoundedRect(x - w/2 + 5, y - h/2 + 5, w - 10, h - 10, Math.max(6,radius-4));
  g.lineStyle(2, C.gold, .85).strokeRoundedRect(x - w/2, y - h/2, w, h, radius);
  return g;
}
export function button(s, x, y, w, h, title, action, primary = false, size = 28, enabled = true) {
  const iconFrame = ({'‹':'back','›':'next','☰':'settings'})[title];
  const hasIcon = iconFrame && s.textures.exists('review-ui');
  const hasSkin = !hasIcon && s.art !== false && s.textures.exists('review-buttons');
  const frame = enabled ? (primary ? 'primary' : 'secondary') : 'disabled';
  const bg = hasIcon
    ? s.add.image(0,0,'review-ui',iconFrame).setDisplaySize(Math.min(w,h),Math.min(w,h))
    : hasSkin
      ? (s.game?.renderer?.type === Phaser.WEBGL
        ? s.add.nineslice(0,0,'review-buttons',frame,w,h,64,64,28,28)
        : s.add.image(0,0,'review-buttons',frame).setDisplaySize(w,h))
      : panel(s, 0, 0, w, h, !enabled ? 0xdbe1d7 : primary ? C.jade : C.ivory);
  const label = text(s, 0, 0, title, size, !enabled ? '#78867b' : primary ? '#fff4d6' : C.ink);
  if(hasIcon) label.setVisible(false);
  else if(label.width>w-72) label.setFontSize(size*(w-72)/label.width);
  const hit = s.add.zone(0, 0, w, h);
  if(enabled) hit.setInteractive({ useHandCursor: true });
  const container = s.add.container(x, y, [bg, label, hit]);
  container.setData('enabled',enabled);
  container.setData('label',label);
  container.setData('hit',hit);
  let pressedY;
  const allowed = () => container.getData('enabled') && (!s.modal || container.getData('modal'));
  const restore = () => {
    if(pressedY!==undefined) {label.setY(pressedY);pressedY=undefined;}
    if(bg.clearTint) bg.clearTint(); else bg.setAlpha(1);
  };
  hit.on('pointerover', () => { if(allowed()) {if(bg.setTint) bg.setTint(0xfff4d6); else bg.setAlpha(.9);} });
  hit.on('pointerdown', () => {
    if(!allowed()) return;
    if(pressedY===undefined) pressedY=label.y;
    label.setY(pressedY+2);
    if(bg.setTint) bg.setTint(0xc7d7c7); else bg.setAlpha(.75);
  });
  hit.on('pointerout',restore);
  hit.on('pointerup', () => {restore(); if(allowed()) {s.tone?.();action();} });
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
