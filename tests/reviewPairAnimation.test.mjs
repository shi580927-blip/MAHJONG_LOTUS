import assert from 'node:assert/strict';
globalThis.Phaser={Scene:class {}};
const {ScreenReviewScene}=await import('../src/scenes/ScreenReviewScene.js');
function setup(motion) {
 const scene=new ScreenReviewScene();
 scene.state={motion};scene.input={enabled:true};scene.tiles=[{id:0,symbol:1,removed:false},{id:1,symbol:1,removed:false}];
 scene.boardObjects=scene.tiles.map(tile=>({tile,symbol:{},g:{}}));
 scene.draw=()=>{scene.redraws=(scene.redraws||0)+1;};
 scene.tweens={add:config=>{scene.animation=config;}};
 return scene;
}
const scene=setup(true);
scene.removePair(scene.tiles,'Пара найдена');
assert.ok(scene.tiles.every(tile=>tile.removed),'Move must be committed before animation');
assert.equal(scene.input.enabled,false);assert.equal(scene.resolvingPair,true);
scene.boost(1);scene.removePair(scene.tiles,'duplicate');
assert.equal(scene.redraws,undefined,'Repeated input must not reshuffle or redraw during animation');
scene.animation.onComplete();
assert.equal(scene.redraws,1);assert.equal(scene.input.enabled,true);assert.equal(scene.resolvingPair,false);
const quiet=setup(false);quiet.removePair(quiet.tiles,'Пара найдена');
assert.equal(quiet.redraws,1);assert.equal(quiet.animation,undefined,'Motion setting must skip tween');
const modal=setup(true);modal.modal=true;modal.removePair(modal.tiles,'blocked');
assert.ok(modal.tiles.every(tile=>!tile.removed),'Modal must block moves');
console.log('PASS: pair committed once, repeated input blocked, input restored, reduced motion and modal respected');
