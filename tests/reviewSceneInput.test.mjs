import assert from 'node:assert/strict';
globalThis.Phaser = { Scene: class {} };
const { ScreenReviewScene } = await import('../src/scenes/ScreenReviewScene.js');
const scene = new ScreenReviewScene();
const active = new Set();
scene.children = { list: [], removeAll() { this.list = []; } };
function zone(action) {
  const item = { action, destroy() { active.delete(this); scene.children.list = scene.children.list.filter(x => x !== this); } };
  active.add(item); scene.children.list.push(item); return item;
}
let restarts = 0;
zone(() => { restarts++; scene.tiles = [{id:0,symbol:99,removed:false}]; }); // Previous map node.
scene.tiles = [{id:0,symbol:3,removed:true},{id:1,symbol:7,removed:false}];
const before = JSON.stringify(scene.tiles);
scene.tweens = { killAll() {} };
scene.input = { removeAllListeners() {} };
scene.scale = { width:1920,height:1080 };
globalThis.document = {getElementById:()=>null};
scene.ensureBackground = () => true;
scene.mode = 'game'; scene.background = () => {};
scene.gameplay = () => zone(() => {});
scene.newBoard = () => { restarts++; };
scene.draw();
for (const hit of [...active]) hit.action();
assert.equal(restarts,0,'Invisible previous map node must not restart the board');
assert.equal(JSON.stringify(scene.tiles),before,'Redraw must preserve symbols and removed tiles');
for(let i=0;i<20;i++) scene.draw();
assert.equal(active.size,1,'Redraw must not accumulate interactive objects');
console.log('PASS: old map input destroyed, board retained, repeated redraw input bounded');
