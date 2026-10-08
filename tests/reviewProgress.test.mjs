import assert from 'node:assert/strict';
import { LEVELS, geometry } from '../src/data/reviewBoard.js';
globalThis.Phaser={Scene:class{}};
const { ScreenReviewScene }=await import('../src/scenes/ScreenReviewScene.js');
function victoryScene(level,preview,completed=[]) {
  const scene=new ScreenReviewScene();
  scene.level=level; scene.preview=preview; scene.state={completed:[...completed],motion:false};
  scene.save=()=>{scene.saves=(scene.saves||0)+1;};
  scene.popup=(title,subtitle,actions)=>{scene.actions=actions;scene.title=title;scene.subtitle=subtitle;};
  scene.draw=()=>{}; scene.go=mode=>{scene.mode=mode;};
  scene.victory(); return scene;
}
const normal=victoryScene(10,false,[1,2,3,4,5,6,7,8,9]);
assert.equal(normal.current,11); assert.equal(normal.saves,1);
normal.actions[0][1](); assert.equal(normal.level,11); assert.deepEqual(normal.tiles.map(({id,x,y,z})=>({id,x,y,z})),geometry(11));
const preview=victoryScene(20,true,[1]);
assert.deepEqual(preview.state.completed,[1]); assert.equal(preview.saves,undefined); assert.equal(preview.current,2);
preview.actions[0][1](); assert.equal(preview.mode,'map'); assert.equal(preview.level,20);
assert.equal(LEVELS.length,20);
assert.equal(new Set(LEVELS.map((_,i)=>JSON.stringify(geometry(i+1)))).size,20);
console.log('PASS: transition 10→11 uses bamboo layout; preview completion does not save or unlock; 20 distinct shapes');

assert.equal(normal.section,1);
assert.match(normal.subtitle,/Бамбуковая роща/);
const repeat=victoryScene(10,false,[1,10]);
repeat.victory();assert.equal(repeat.saves,undefined);assert.deepEqual(repeat.state.completed,[1,10]);
const final=victoryScene(60,false,Array.from({length:59},(_,i)=>i+1));
assert.equal(final.title,'Путь Лотоса пройден');assert.match(final.subtitle,/60 из 60/);
final.actions[0][1]();assert.equal(final.mode,'map');
final.actions[1][1]();assert.equal(final.level,60);assert.ok(final.tiles.every(t=>!t.removed));
const chapter=victoryScene(20,false,Array.from({length:19},(_,i)=>i+1));
assert.match(chapter.subtitle,/Аллея сакуры/);chapter.actions[0][1]();assert.equal(chapter.level,21);assert.equal(chapter.section,2);
