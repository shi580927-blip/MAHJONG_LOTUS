import assert from 'node:assert/strict';
import { geometry, free, pairs, deal } from '../src/data/reviewBoard.js';
let seed=17;
const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
for(let run=0;run<200;run++) {
  const tiles=geometry();
  const solution=deal(tiles,random);
  for(const ids of solution){
    const [a,b]=ids.map(id=>tiles.find(t=>t.id===id));
    assert(free(a,tiles)&&free(b,tiles));assert.equal(a.symbol,b.symbol);
    a.removed=b.removed=true;
  }
  assert(tiles.every(t=>t.removed));
  const partial=geometry();deal(partial,random);
  for(let k=0;k<7;k++){
    const available=pairs(partial);if(!available.length)break;
    available[Math.floor(random()*available.length)].forEach(t=>{t.removed=true;});
  }
  const count=partial.filter(t=>!t.removed).length;
  const next=deal(partial,random);assert.equal(next.length*2,count);
  for(const ids of next){const ts=ids.map(id=>partial.find(t=>t.id===id));assert(ts.every(t=>free(t,partial)));assert.equal(ts[0].symbol,ts[1].symbol);ts.forEach(t=>{t.removed=true;});}
}
const trapped=[{id:1,x:0,y:0,z:0},{id:2,x:0,y:0,z:1}];
const recovery=deal(trapped,random);assert.equal(recovery.length,1);assert(trapped.every(t=>free(t,trapped)));
const full=geometry();assert(!free(full.find(t=>t.x===2&&t.y===1&&t.z===0),full));
console.log('PASS: 200 full deals, 200 partial-board shuffles, stacked trap recovery, covering rule');
