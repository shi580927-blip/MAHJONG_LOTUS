import assert from 'node:assert/strict';
import { button } from '../src/ui/reviewUI.js';
globalThis.Phaser={WEBGL:2};
function object(){return {y:0,width:100,data:{},handlers:{},setOrigin(){return this;},setDisplaySize(){return this;},setVisible(){return this;},setY(y){this.y=y;return this;},setFontSize(){return this;},setData(k,v){this.data[k]=v;return this;},getData(k){return this.data[k];},on(k,v){this.handlers[k]=v;return this;},setInteractive(){this.interactive=true;return this;},setTint(v){this.tint=v;return this;},clearTint(){this.tint=0xffffff;return this;}};}
const skins=[];
const scene={art:true,game:{renderer:{type:2}},textures:{exists:key=>key==='review-buttons'},add:{text:()=>object(),zone:()=>object(),nineslice:(x,y,key,frame,w,h)=>{const o=object();o.frame=frame;skins.push(o);return o;},container:(x,y,children)=>{const o=object();o.children=children;return o;}}};
let actions=0;
const control=button(scene,0,0,300,116,'Подсказка',()=>actions++);
const label=control.getData('label'),hit=control.getData('hit');
label.setY(25);hit.handlers.pointerdown();assert.equal(label.y,27);
hit.handlers.pointerout();assert.equal(label.y,25);
scene.modal=true;hit.handlers.pointerup();assert.equal(actions,0,'Underlying button must not act through modal');
control.setData('modal',true);hit.handlers.pointerup();assert.equal(actions,1,'Modal action remains usable');
const disabled=button(scene,0,0,620,78,'Локация пока закрыта',()=>actions++,false,28,false);
assert.equal(skins.at(-1).frame,'disabled');assert(!disabled.getData('hit').interactive);
disabled.getData('hit').handlers.pointerup();assert.equal(actions,1,'Inactive action must remain blocked');
console.log('PASS: booster label restored after press, modal guard retained, disabled skin cannot invoke action');
