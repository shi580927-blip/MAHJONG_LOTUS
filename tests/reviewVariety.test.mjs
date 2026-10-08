import assert from 'node:assert/strict';
import { geometry, deal, free, pairs } from '../src/data/reviewBoard.js';
let seed=1847;
const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
let mirrored=0, comparisons=0, openings=0;
const pairings=new Set();
for(let run=0;run<200;run++) {
  const tiles=geometry(11), solution=deal(tiles,random);
  pairings.add(JSON.stringify(solution)); openings+=pairs(tiles).length;
  const counts=new Map();
  for(const tile of tiles) {
    counts.set(tile.symbol,(counts.get(tile.symbol)||0)+1);
    const opposite=tiles.find(t=>t.x===5-tile.x && t.y===tile.y && t.z===tile.z);
    if(opposite && tile.x<opposite.x) { comparisons++; if(opposite.symbol===tile.symbol) mirrored++; }
  }
  assert.equal(counts.size,12,'Use the full palette on a large board');
  assert([...counts.values()].every(n=>n%2===0 && n<=6),'Counts must be paired and bounded, without dominant faces');
  assert(new Set(counts.values()).size>1,'Different faces need not have equal counts');
}
assert(pairings.size>190,'Removal sequences must vary, not just change face labels');
assert(mirrored/comparisons<.25,'Deals must not encode a left-right mirror solution');
assert(openings/200<6,'Avoid the previous large collection of obvious opening matches');
for(const level of [13,17,18,19,20]) {
  const tiles=geometry(level);
  assert(tiles.some(t=>!Number.isInteger(t.x)||!Number.isInteger(t.y)));
  for(const tile of tiles.filter(t=>t.z>0)) assert(tiles.some(t=>t.z===tile.z-1 && Math.abs(t.x-tile.x)<1 && Math.abs(t.y-tile.y)<1),'Raised tiles need support');
  const solution=deal(tiles,random);
  // Shuffle after a legal partial play must retain removed tiles and IDs.
  solution.slice(0,3).flat().forEach(id=>{tiles.find(t=>t.id===id).removed=true;});
  const removed=tiles.filter(t=>t.removed).map(t=>({...t}));
  const count=tiles.filter(t=>!t.removed).length;
  const reshuffled=deal(tiles,random);
  assert.deepEqual(tiles.filter(t=>t.removed),removed);
  assert.equal(reshuffled.length*2,count);
  for(const ids of reshuffled) {
    const pair=ids.map(id=>tiles.find(t=>t.id===id));
    assert(pair.every(t=>free(t,tiles))); assert.equal(pair[0].symbol,pair[1].symbol);
    pair.forEach(t=>{t.removed=true;});
  }
}
const covering=[{id:0,x:0,y:0,z:0},{id:1,x:1,y:0,z:0},{id:2,x:.5,y:.5,z:1}];
assert(!free(covering[0],covering)&&!free(covering[1],covering),'Half-cell layer covers both lower tiles');
assert.deepEqual(deal([],random),[]);
console.log('PASS: randomized non-mirror pairings, varied bounded even face counts, shifted layer support/covering, partial shuffles');
