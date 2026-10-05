import { C, text, panel, button, lotus } from '../ui/reviewUI.js?v=20261005-1';
import { geometry, deal, free, pairs } from '../data/reviewBoard.js?v=20261005-1';
const KEY = 'lotus.screen-review.v1';
const CHAPTERS = ['Сад Безмятежности', 'Сад Цветущей Сакуры', 'Храм Лотоса'];
const SYMBOLS = ['一', '二', '三', '竹', '中', '白', '✿', '❖', '◉', '☽', '山', '水'];
export class ScreenReviewScene extends Phaser.Scene {
  constructor() { super('ScreenReviewScene'); }
  preload() {
    this.art = new URLSearchParams(location.search).get('art') === '1';
    this.load.atlas('review-map', 'assets/runtime/atlases/map_common/map_common.webp', 'assets/runtime/atlases/map_common/map_common.json');
    if (this.art) {
      for (const mode of ['map', 'gameplay']) for (const ratio of ['16x9', '9x16']) {
        this.load.image(`${mode}-${ratio}`, `assets/runtime/backgrounds/ch1/${mode}/ch1_${mode === 'map' ? 'map' : 'level'}_bg_${ratio}.webp`);
      }
    }
  }
  create() {
    this.state = { completed: [], sound: false, motion: true };
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved) this.state = { ...this.state, ...saved, completed: Array.isArray(saved.completed) ? saved.completed.filter(n => Number.isInteger(n) && n > 0 && n <= 60) : [] };
    } catch { /* Storage may be unavailable. The review remains playable. */ }
    this.current = Math.min(60, Math.max(0, ...this.state.completed) + 1);
    this.level = this.current;
    this.guides = new URLSearchParams(location.search).get('debug') === '1';
    this.mode = ['menu', 'map', 'game'].includes(new URLSearchParams(location.search).get('screen')) ? new URLSearchParams(location.search).get('screen') : 'menu';
    this.draw();
    this.resizeHandler = () => this.draw();
    this.scale.on('resize', this.resizeHandler);
    this.events.once('shutdown', () => { this.scale.off('resize', this.resizeHandler); this.mapMaskShape?.destroy(); });
    // Opt-in diagnostics, not a second implementation of gameplay.
    if (new URLSearchParams(location.search).get('test') === '1') window.lotusReview = this;
  }
  save() { try { localStorage.setItem(KEY, JSON.stringify(this.state)); } catch { /* Session-only fallback. */ } }
  tone() {
    if (!this.state.sound) return;
    try {
      this.audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      this.audioContext.resume();
      const oscillator = this.audioContext.createOscillator(), gain = this.audioContext.createGain();
      oscillator.frequency.value = 660;
      gain.gain.setValueAtTime(.025, this.audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, this.audioContext.currentTime + .14);
      oscillator.connect(gain).connect(this.audioContext.destination);
      oscillator.start(); oscillator.stop(this.audioContext.currentTime + .14);
    } catch { /* Audio optional. */ }
  }
  go(mode) { this.mode = mode; this.modal = null; this.selected = null; this.draw(); }
  draw() {
    this.tweens.killAll(); this.children.removeAll(true); this.input.removeAllListeners();
    this.modal = null; this.w = this.scale.width; this.h = this.scale.height; this.p = this.h > this.w;
    this.background();
    if (this.mode === 'menu') this.menu();
    if (this.mode === 'map') this.map();
    if (this.mode === 'game') { if (!this.tiles) this.newBoard(); this.gameplay(); }
    if (this.guides) this.overlay();
  }
  background() {
    const g = this.add.graphics();
    g.fillGradientStyle(0xf6f1e4, 0xe9eee2, 0xd8e7dc, 0xeff0e3, 1).fillRect(0, 0, this.w, this.h);
    const key = `${this.mode === 'map' ? 'map' : 'gameplay'}-${this.p ? '9x16' : '16x9'}`;
    if (this.art && this.textures.exists(key)) {
      this.add.image(this.w/2, this.h/2, key).setDisplaySize(this.w, this.h);
      this.add.rectangle(this.w/2, this.h/2, this.w, this.h, 0xf3efdf, .2);
    } else {
      // Quiet layout backdrop only. No new production environment art.
      g.lineStyle(2, C.gold, .18);
      for (let i = 0; i < 5; i++) g.strokeEllipse(this.w/2, this.h*.68, this.w*.6 + i*170, this.h*.34 + i*92);
      lotus(this, this.p ? 85 : 145, this.h-140, this.p ? 1.1 : 1.5);
      lotus(this, this.w-100, this.p ? 340 : 250, 1);
    }
  }
  hud(title, subtitle = '') {
    const y = this.p ? 70 : 76;
    panel(this, this.w/2, this.p ? 104 : 77, this.w-64, this.p ? 176 : 116, C.ivory, .97);
    button(this, 104, y, 104, 82, '‹', () => this.go(this.mode === 'map' ? 'menu' : 'map'), false, 52);
    text(this, this.p ? 290 : 390, y-16, title, this.p ? 26 : 28, C.muted);
    text(this, this.p ? 290 : 390, y+25, subtitle, this.p ? 36 : 38, C.ink, true);
    const coinX = this.p ? 580 : this.w-595, petalX = this.p ? 785 : this.w-355;
    text(this, coinX, y-13, 'МОНЕТЫ', 18, C.muted);
    text(this, coinX, y+22, '◉  0', 34, '#9b7938');
    text(this, petalX, y-13, 'ЛЕПЕСТКИ', 18, C.muted);
    text(this, petalX, y+22, '✿  0', 34, '#b47186');
    button(this, this.w-104, y, 104, 82, '☰', () => this.settings(), false, 34);
    if (this.p) text(this, this.w/2, 168, CHAPTERS[Math.floor((this.level-1)/20)], 25, C.muted, true);
  }
  menu() {
    const cx = this.w/2, cy = this.h*.44;
    panel(this, cx, cy, this.p ? 870 : 840, this.p ? 970 : 700, C.ivory, .96, 44);
    lotus(this, cx, cy-(this.p ? 315 : 245), 1.8, true);
    text(this, cx, cy-(this.p ? 185 : 145), 'МАДЖОНГ', 24, C.muted);
    text(this, cx, cy-65, 'Путь Лотоса', this.p ? 84 : 82, C.ink, true);
    text(this, cx, cy+28, 'Найдите пару. Откройте свой путь.', 28, C.muted);
    button(this, cx, cy+150, 570, 106, this.current > 1 ? 'Продолжить путь' : 'Начать путь', () => this.go('map'), true, 34);
    button(this, cx, cy+280, 570, 86, 'Настройки', () => this.settings());
    text(this, cx, this.h-110, 'Без спешки · Без жизней · В своём ритме', this.p ? 28 : 25, C.muted);
  }
  map() {
    this.level = this.current;
    const top = this.p ? 250 : 180, bottom = this.p ? 1640 : 900;
    const step = this.p ? 225 : 275;
    const extent = step*59 + (this.p ? 900 : 600);
    const viewport = this.p ? bottom-top : this.w-240;
    this.mapMax = extent-viewport;
    if (!Number.isFinite(this.offset)) this.offset = Math.max(0, (this.current-1)*step - viewport*.3);
    this.offset = Phaser.Math.Clamp(this.offset, 0, this.mapMax);
    const maskShape = this.make.graphics({ add: false }).fillStyle(0xffffff).fillRect(this.p ? 90 : 120, top, this.p ? 900 : 1680, bottom-top);
    
    this.mapMaskShape?.destroy(); this.mapMaskShape = maskShape;
    this.pathContainer = this.add.container().setMask(maskShape.createGeometryMask());
    const points = Array.from({ length: 60 }, (_, i) => this.p
      ? { x: 540 + Math.sin(i*.95)*245, y: bottom-140-i*step }
      : { x: 260+i*step, y: 530+Math.sin(i*.95)*200 });
    const g = this.add.graphics(); this.pathContainer.add(g);
    for (let i=0; i<59; i++) {
      const a=points[i], b=points[i+1];
      g.lineStyle(5, C.gold, i<this.current-1 ? .8 : .25);
      g.lineBetween(a.x, a.y, b.x, b.y);
      for(let k=1;k<6;k++) { g.fillStyle(C.gold, .65).fillCircle(Phaser.Math.Linear(a.x,b.x,k/6),Phaser.Math.Linear(a.y,b.y,k/6),4); }
    }
    this.mapNodes = [];
    points.forEach((point, index) => {
      const n = index+1, complete = this.state.completed.includes(n), locked = n > this.current;
      const frame = locked ? 'locked' : n === this.current ? 'current' : complete ? 'completed' : 'available';
      const node = this.textures.exists('review-map')
        ? this.add.image(point.x,point.y,'review-map',`map_node_${frame}`).setDisplaySize(n%5===0 ? 174 : 146,n%5===0 ? 174 : 146)
        : this.add.circle(point.x,point.y,65,locked ? 0x82948b : C.jade);
      this.pathContainer.add(node);
      const number=text(this,point.x,point.y+42,String(n),29,'#fff6d5'); this.pathContainer.add(number);
      const hit = this.add.zone(point.x,point.y,180,180).setInteractive({useHandCursor:!locked}); this.pathContainer.add(hit);
      this.mapNodes.push({ n, hit, point });
      hit.on('pointerup', pointer => {
        if(this.modal || locked || this.dragDistance>12 || pointer.y<top || pointer.y>bottom || (!this.p && (pointer.x<120 || pointer.x>1800))) return;
        this.level=n; this.newBoard(); this.go('game');
      });
      if(n===this.current) this.pathContainer.add(text(this,point.x,point.y-105,'ВЫ ЗДЕСЬ',20,C.ink));
      if(n%5===0) this.pathContainer.add(text(this,point.x,point.y+112,n%20===0?'Врата главы':'Пробуждение',19,C.muted));
    });
    const move=()=> { this.offset=Phaser.Math.Clamp(this.offset,0,this.mapMax); this.pathContainer.setPosition(this.p?0:-this.offset,this.p?this.offset:0); };
    move(); this.dragDistance=0;
    this.input.on('pointerdown', p => { if(!this.modal && p.y>top && p.y<bottom) { this.drag={x:p.x,y:p.y,offset:this.offset};this.dragDistance=0; } });
    this.input.on('pointermove', p => { if(!p.isDown || !this.drag || this.modal) return; const d=this.p?p.y-this.drag.y:this.drag.x-p.x;this.dragDistance=Math.max(this.dragDistance,Math.abs(d));this.offset=this.drag.offset+d;move(); });
    this.input.on('pointerup',()=>{this.drag=null;});
    this.input.on('wheel',(_p,_o,dx,dy)=>{if(this.modal)return;this.offset+=(this.p?dy:(Math.abs(dx)>Math.abs(dy)?dx:dy))*.9;move();});
    this.hud('Глава '+(Math.floor((this.current-1)/20)+1),this.p?'Путь Лотоса':CHAPTERS[Math.floor((this.current-1)/20)]);
    const by=this.p?1785:997;
    panel(this,this.w/2,by,this.w-64,this.p?200:128,C.ivory,.97);
    text(this,this.p?270:400,by-25,'ВАШ ПУТЬ',20,C.muted);
    text(this,this.p?270:400,by+20,`${this.state.completed.length} / 60`,36,C.ink,true);
    button(this,this.p?735:this.w/2,by,this.p?460:460,92,`Играть · ${this.current}`,()=>{this.level=this.current;this.newBoard();this.go('game');},true,32);
    if(!this.p) button(this,this.w-345,by,420,82,'К текущему уровню',()=>{this.offset=undefined;this.draw();},false,25);
    else button(this,540,1620,280,68,'К текущему',()=>{this.offset=undefined;this.draw();},false,24);
  }
  newBoard() { this.tiles=geometry(); deal(this.tiles); this.selected=null; this.hinted=[]; this.notice=null; }
  gameplay() {
    this.hud('Уровень',String(this.level));
    const bx=this.p?540:960, by=this.p?885:525, bw=this.p?900:1280, bh=this.p?1140:640;
    panel(this,bx,by,bw,bh,C.jade,this.art ? .92 : .98,36);
    text(this,bx,by-bh/2+40,'СОБИРАЙТЕ ОДИНАКОВЫЕ СВОБОДНЫЕ ПАРЫ',this.p?20:19,'#bfd3c1');
    // Same board geometry in both orientations: mobile reflows nothing mid-game.
    const tw=this.p?134:102, th=tw*1.3, dx=tw+3, dy=th+4;
    const ox=bx-2.5*dx, oy=by-1.5*dy;
    this.boardObjects=[];
    const live=this.tiles.filter(t=>!t.removed).sort((a,b)=>a.z-b.z||a.y-b.y||a.x-b.x);
    for(const tile of live) {
      const x=ox+tile.x*dx-tile.z*10, y=oy+tile.y*dy-tile.z*13;
      const isFree=free(tile,this.tiles), selected=tile.id===this.selected, hinted=this.hinted?.includes(tile.id);
      const g=this.add.graphics();
      g.fillStyle(0x082b26,.3).fillRoundedRect(x-tw/2+4,y-th/2+12,tw,th,12);
      g.fillStyle(0x247263).fillRoundedRect(x-tw/2,y-th/2+6,tw,th,12);
      g.fillStyle(selected?0xffe5ac:hinted?0xf7dfad:isFree?0xfff9eb:0xd3d7c5).fillRoundedRect(x-tw/2+4,y-th/2,tw-8,th-7,10);
      g.lineStyle(selected||hinted?4:2,selected||hinted?0xf6ca65:C.gold,1).strokeRoundedRect(x-tw/2+4,y-th/2,tw-8,th-7,10);
      const symbol=text(this,x,y-5,SYMBOLS[tile.symbol],this.p?49:62,tile.symbol%3===0?'#ae626b':'#21614f',false);
      const hit=this.add.zone(x,y,tw,th).setInteractive({useHandCursor:isFree});
      hit.on('pointerup',()=>this.selectTile(tile));
      this.boardObjects.push({tile,hit,x,y,g,symbol});
    }
    const left=live.length/2;
    text(this,bx,by+bh/2-36,`Осталось пар: ${left}     ·     Доступно: ${pairs(this.tiles).length}`,25,'#dbe6cf');
    const by2=this.p?1710:965, spacing=this.p?310:330;
    ['Подсказка','Перемешать','Благословение'].forEach((name,i)=>{
      const x=this.w/2+(i-1)*spacing;
      button(this,x,by2,this.p?280:300,this.p?112:88,`${['◇','↻','✿'][i]}  ${name}`,()=>this.boost(i),i===2,this.p?25:26);
    });
    text(this,this.w/2,this.p?1820:1043,this.notice||'Свободная плитка открыта сверху и хотя бы с одной стороны',this.p?23:22,C.muted);
    if(!left) this.victory();
  }
  selectTile(tile) {
    if(this.modal || tile.removed || !free(tile,this.tiles))return;
    this.tone();
    if(this.selected===tile.id){this.selected=null;this.draw();return;}
    const previous=this.tiles.find(t=>t.id===this.selected);
    if(previous && previous.symbol===tile.symbol && free(previous,this.tiles)) {
      previous.removed=tile.removed=true;this.selected=null;this.hinted=[];this.notice='Пара найдена';this.draw();
      if(this.tiles.some(t=>!t.removed)&&!pairs(this.tiles).length)this.noMoves();
    } else {this.selected=tile.id;this.notice=previous?'Выберите плитку с таким же символом':null;this.draw();}
  }
  boost(index) {
    const pair=pairs(this.tiles)[0];
    if(index===1) {deal(this.tiles);this.selected=null;this.hinted=[];this.notice='Плитки перемешаны. Есть решение.';this.draw();return;}
    if(!pair){this.noMoves();return;}
    if(index===0){this.hinted=pair.map(t=>t.id);this.notice='Выделена доступная пара';this.draw();}
    if(index===2){pair.forEach(t=>{t.removed=true;});this.selected=null;this.hinted=[];this.notice='Благословение убрало одну пару';this.draw();if(this.tiles.some(t=>!t.removed)&&!pairs(this.tiles).length)this.noMoves();}
  }
  popup(title,description,actions) {
    this.modal=true;
    const shade=this.add.rectangle(this.w/2,this.h/2,this.w,this.h,0x082d27,.7).setInteractive().setDepth(500);
    const height=340+actions.length*110, cx=this.w/2, cy=this.h/2;
    const objects=[shade,panel(this,cx,cy,this.p?870:800,height,C.ivory,1,36),lotus(this,cx,cy-height/2+80,1,true),text(this,cx,cy-height/2+155,title,46,C.ink,true),text(this,cx,cy-height/2+218,description,25,C.muted)];
    actions.forEach((a,i)=>{const b=button(this,cx,cy-height/2+310+i*110,650,84,a[0],a[1],i===0,28);b.setData('modal',true);objects.push(b);});
    objects.forEach((o,i)=>o.setDepth(501+i));
  }
  settings() {
    this.popup('Настройки','Комфортный ритм игры',[
      [`Звуки: ${this.state.sound?'включены':'выключены'}`,()=>{this.state.sound=!this.state.sound;this.save();this.draw();this.settings();}],
      [`Анимация: ${this.state.motion?'включена':'выключена'}`,()=>{this.state.motion=!this.state.motion;this.save();this.draw();this.settings();}],
      ['Вернуться',()=>this.draw()]
    ]);
  }
  noMoves() {
    this.popup('Нет доступных пар','Можно продолжить без потери прогресса',[
      ['Перемешать',()=>{deal(this.tiles);this.selected=null;this.draw();}],
      ['Начать заново',()=>{this.newBoard();this.draw();}],
      ['На карту',()=>this.go('map')]
    ]);
  }
  victory() {
    if(!this.state.completed.includes(this.level)){this.state.completed.push(this.level);this.save();}
    this.current=Math.min(60,Math.max(...this.state.completed)+1);
    const milestone=this.level%5===0;
    this.popup('Путь становится светлее',milestone?'Вы достигли нового рубежа Пути':'Уровень '+this.level+' завершён',[
      [this.level===60?'На карту':'Следующий уровень',()=>{if(this.level===60){this.go('map');return;}this.level++;this.newBoard();this.draw();}],
      ['Вернуться на Путь',()=>{this.offset=undefined;this.go('map');}]
    ]);
    if(this.state.motion){const ring=this.add.circle(this.w/2,this.h/2-170,80).setStrokeStyle(5,C.gold,.8).setDepth(520);this.tweens.add({targets:ring,scale:4,alpha:0,duration:1300,onComplete:()=>ring.destroy()});}
  }
  overlay() {
    const game=this.mode==='game';
    const box=this.p?(game?[80,260,920,1240]:[90,250,900,1390]):(game?[300,170,1320,680]:[120,180,1680,720]);
    const g=this.add.graphics().setDepth(450);g.lineStyle(3,0xc2537a,.9).strokeRect(...box);
    text(this,this.w/2,this.p?225:158,`${this.w} × ${this.h} · SAFE ZONE · TEST`,22,'#a53c61').setDepth(451);
  }
}
