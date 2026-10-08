// First two locations have authored review layouts; later locations retain the test layout.
export const FIRST_LOCATION = [
  { name: 'Первые шаги', layers: [['######', '######']] },
  { name: 'Две тропинки', layers: [['##..##', '##..##', '##..##', '##..##']] },
  { name: 'Берег пруда', layers: [['.####.', '######', '######', '.####.']] },
  { name: 'Каменный мост', layers: [['##..##', '######', '######', '##..##'], ['......', '..##..', '..##..']] },
  { name: 'Кувшинка', layers: [['..##..', '.####.', '######', '.####.', '..##..'], ['......', '......', '..##..']] },
  { name: 'Отражение', layers: [['######', '######', '######', '######'], ['.####.', '......', '......', '.####.']] },
  { name: 'Островки', layers: [['##..##', '##..##', '######', '##..##', '##..##'], ['......', '.#..#.', '.#..#.']] },
  { name: 'Лепестки', layers: [['.####.', '######', '######', '######', '.####.'], ['......', '..##..', '..##..', '..##..']] },
  { name: 'Тихая пагода', layers: [['######', '######', '######', '######', '######'], ['......', '.####.', '.####.'], ['......', '......', '..##..']] },
  { name: 'Раскрытие лотоса', layers: [['.####.', '######', '######', '######', '.####.'], ['......', '.####.', '.####.', '.####.'], ['......', '......', '..##..']] }
];
export const SECOND_LOCATION = [
  { name: 'Вход в рощу', layers: [['######', '######', '######', '######'], ['......', '.####.', '.####.']] },
  { name: 'Бамбуковые стебли', layers: [['##..##', '##..##', '##..##', '##..##', '##..##'], ['##..##', '##..##', '......', '##..##', '##..##']] },
  { name: 'Лесная тропа', layers: [['####..', '.####.', '..####', '.####.', '####..'], ['.##...', '..##..', '...##.', '..##..', '.##...']] },
  { name: 'Нефритовые ворота', layers: [['######', '######', '##..##', '##..##', '######'], ['.####.', '.####.', '......', '......', '.####.']] },
  { name: 'Солнечный просвет', layers: [['.####.', '######', '######', '######', '.####.'], ['.####.', '......', '.####.', '......', '.####.']] },
  { name: 'Перекрёсток', layers: [['..##..', '######', '######', '######', '..##..'], ['......', '.####.', '.####.', '.####.'], ['......', '......', '..##..']] },
  { name: 'Мост над ручьём', layers: [['######', '######', '######', '######', '######'], ['##..##', '######', '##..##', '######', '##..##']] },
  { name: 'Зелёные террасы', layers: [['######', '######', '######', '######', '######'], ['......', '######', '.####.', '######'], ['......', '......', '..##..']] },
  { name: 'Бамбуковая пагода', layers: [['######', '######', '######', '######', '######'], ['.####.', '.####.', '.####.', '.####.', '.####.'], ['......', '..##..', '..##..', '..##..']] },
  { name: 'Врата Безмятежности', layers: [['######', '######', '######', '######', '######'], ['.####.', '.####.', '.####.', '.####.', '.####.'], ['......', '.####.', '......', '.####.'], ['......', '......', '..##..']] }
];
export const LEVELS = [...FIRST_LOCATION, ...SECOND_LOCATION];
export function geometry(level) {
  const template = LEVELS[level - 1];
  if (!template) return testGeometry();
  const cells = [];
  template.layers.forEach((rows, z) => rows.forEach((row, y) => [...row].forEach((cell, x) => {
    if (cell === '#') cells.push({ id: cells.length, x, y, z });
  })));
  return cells;
}
// Bounds use the whole starting board so removing edge pairs cannot move it.
export function boardPlacement(cells, width, height, preferredWidth) {
  const minX = Math.min(...cells.map(t => t.x)), maxX = Math.max(...cells.map(t => t.x));
  const minY = Math.min(...cells.map(t => t.y)), maxY = Math.max(...cells.map(t => t.y));
  const maxZ = Math.max(...cells.map(t => t.z));
  const cols = maxX - minX + 1, rows = maxY - minY + 1;
  const tw = Math.min(preferredWidth, (width - (cols - 1)*3 - maxZ*10)/cols, (height - (rows - 1)*4 - maxZ*13)/(rows*1.25));
  const th = tw*1.25, dx = tw+3, dy = th+4;
  return { tw, th, dx, dy, ox: -(minX+maxX)*dx/2 + maxZ*5, oy: -(minY+maxY)*dy/2 + maxZ*6.5 };
}
function testGeometry() {
  const cells = [];
  for (let y = 0; y < 4; y++) for (let x = 0; x < 6; x++) {
    if ((y === 0 || y === 3) && (x === 0 || x === 5)) continue;
    cells.push({ id: cells.length, x, y, z: 0 });
  }
  for (let y = 1; y < 3; y++) for (let x = 2; x < 4; x++) cells.push({ id: cells.length, x, y, z: 1 });
  return cells;
}
export function free(tile, tiles) {
  if (tile.removed) return false;
  const alive = tiles.filter(t => !t.removed && t.id !== tile.id);
  if (alive.some(t => t.z > tile.z && Math.abs(t.x - tile.x) < 1 && Math.abs(t.y - tile.y) < 1)) return false;
  const side = d => alive.some(t => t.z === tile.z && t.x === tile.x + d && Math.abs(t.y - tile.y) < 1);
  return !side(-1) || !side(1);
}
export function pairs(tiles) {
  const open = tiles.filter(t => free(t, tiles));
  const result = [];
  for (let i = 0; i < open.length; i++) for (let j = i + 1; j < open.length; j++) {
    if (open[i].symbol === open[j].symbol) result.push([open[i], open[j]]);
  }
  return result;
}
// Find an actual removal sequence before assigning symbols. If a player's
// choices leave a geometric trap, shuffle safely repacks the remaining tiles.
export function deal(cells, random = Math.random) {
  const alive = cells.filter(t => !t.removed);
  let solution;
  for (let attempt = 0; attempt < 64 && !solution; attempt++) {
    const work = alive.map(t => ({ ...t, removed: false }));
    const sequence = [];
    while (work.some(t => !t.removed)) {
      const open = work.filter(t => free(t, work));
      if (open.length < 2) break;
      open.sort((a, b) => b.z - a.z);
      const a = open.shift();
      const b = open[attempt === 0 ? 0 : Math.floor(random() * open.length)];
      a.removed = b.removed = true;
      sequence.push([a.id, b.id]);
    }
    if (sequence.length * 2 === alive.length) solution = sequence;
  }
  if (!solution) {
    alive.forEach((tile, i) => Object.assign(tile, { x: i % 6, y: Math.floor(i / 6), z: 0 }));
    return deal(cells, random);
  }
  for (const ids of solution) {
    const symbol = Math.floor(random() * 12);
    ids.forEach(id => { cells.find(t => t.id === id).symbol = symbol; });
  }
  return solution;
}
