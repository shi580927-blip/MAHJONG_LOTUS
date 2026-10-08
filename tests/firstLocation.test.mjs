import assert from 'node:assert/strict';
import { geometry, deal, free, boardPlacement, FIRST_LOCATION } from '../src/data/reviewBoard.js';
let seed=193;
const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
const footprints=new Set();
const counts=[];
for(let level=1;level<=10;level++) {
  const starting=geometry(level);
  const footprint=JSON.stringify(starting);
  footprints.add(footprint); counts.push(starting.length);
  assert.equal(starting.length%2,0);
  for(let run=0;run<100;run++) {
    const tiles=geometry(level), solution=deal(tiles,random);
    assert.equal(JSON.stringify(tiles.map(({id,x,y,z})=>({id,x,y,z}))),footprint,'Initial deal must keep the designed shape');
    for(const ids of solution) {
      const pair=ids.map(id=>tiles.find(t=>t.id===id));
      assert(pair.every(t=>free(t,tiles))); assert.equal(pair[0].symbol,pair[1].symbol);
      pair.forEach(t=>{t.removed=true;});
    }
    assert(tiles.every(t=>t.removed));
  }
  for(const [width,height,preferred] of [[800,870,134],[1180,520,116]]) {
    const placement=boardPlacement(starting,width,height,preferred);
    for(const t of starting) {
      const x=placement.ox+t.x*placement.dx-t.z*10, y=placement.oy+t.y*placement.dy-t.z*13;
      assert(Math.abs(x)+placement.tw/2<=width/2+.001);
      assert(Math.abs(y)+placement.th/2<=height/2+.001);
    }
    starting[0].removed=true;
    assert.deepEqual(boardPlacement(starting,width,height,preferred),placement,'Pair removal must not recenter the board');
  }
}
assert.equal(footprints.size,10);
assert.equal(FIRST_LOCATION.length,10);
assert.deepEqual(geometry(11),geometry());
console.log('PASS: ten distinct layouts, 1,000 complete solutions, stable fit in both orientations; tile counts:',counts.join(', '));
