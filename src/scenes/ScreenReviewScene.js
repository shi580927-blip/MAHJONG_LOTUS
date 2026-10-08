import { C, text, panel, button, lotus } from '../ui/reviewUI.js?v=20261008-14';
import { geometry, deal, free, pairs, boardPlacement, LEVELS } from '../data/reviewBoard.js?v=20261008-14';
const KEY = 'lotus.screen-review.v1';
const CHAPTERS = ['Сад Безмятежности', 'Сад Цветущей Сакуры', 'Храм Лотоса'];
const LOCATIONS = [
  { name: 'Тихий пруд', sky: 0xe8efe0, water: 0xa9cec2, foliage: 0x6f9982 },
  { name: 'Бамбуковая роща', sky: 0xe4ecd1, water: 0xb7c99c, foliage: 0x577d53 },
  { name: 'Аллея сакуры', sky: 0xf5e4e5, water: 0xd6bfcf, foliage: 0xc7869f },
  { name: 'Сад у моста', sky: 0xf1e7d8, water: 0xb0c8cf, foliage: 0xb47c91 },
  { name: 'Храмовый двор', sky: 0xe8e3d6, water: 0xb4c6bc, foliage: 0x718e82 },
  { name: 'Святилище Лотоса', sky: 0xe4e1ef, water: 0xb7bad5, foliage: 0x8986ad }
];
const SYMBOLS = ['一', '二', '三', '竹', '中', '白', '✿', '❖', '◉', '☽', '山', '水'];
export class ScreenReviewScene extends Phaser.Scene {
  constructor() { super('ScreenReviewScene'); }
  preload() {
    const params = new URLSearchParams(location.search);
    this.editMode = params.get('edit') === '1';
    this.art = params.get('art') !== '0' && params.get('debug') !== '1';
    this.load.atlas('review-map', 'assets/runtime/atlases/map_common/map_common.webp', 'assets/runtime/atlases/map_common/map_common.json');
    this.load.atlas('review-tiles', 'assets/runtime/atlases/review_tiles/review_tiles.webp', 'assets/runtime/atlases/review_tiles/review_tiles.json');
    this.load.atlas('review-buttons', 'assets/runtime/atlases/review_buttons/review_buttons.webp', 'assets/runtime/atlases/review_buttons/review_buttons.json');
    this.load.atlas('review-ui', 'assets/runtime/atlases/review_ui/review_ui.webp', 'assets/runtime/atlases/review_ui/review_ui.json');
    const portrait = this.scale.height > this.scale.width;
    if (this.art) this.load.image(`gameplay-${portrait?'9x16':'16x9'}`, `assets/runtime/backgrounds/ch1/gameplay/ch1_level_bg_${portrait?'9x16':'16x9'}.webp`);
    this.load.on('progress', value => this.loadingStatus('Загружаем сад', value));
    this.load.on('loaderror', file => this.loadingStatus('Не удалось загрузить файл. Обновите страницу.', 0));

  }
  create() {
    this.state = { completed: [], sound: false, motion: true };
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved) this.state = { ...this.state, ...saved, completed: Array.isArray(saved.completed) ? saved.completed.filter(n => Number.isInteger(n) && n > 0 && n <= 60) : [] };
    } catch { /* Storage may be unavailable. The review remains playable. */ }
    this.current = Math.min(60, Math.max(0, ...this.state.completed) + 1);
    this.level = this.current;
    this.section = Math.floor((this.current-1)/10);
    const params = new URLSearchParams(location.search);
    const preview = Number(params.get('previewLevel'));
    this.preview = Number.isInteger(preview) && preview >= 1 && preview <= LEVELS.length;
    if (this.preview) this.level = preview;
    this.guides = params.get('debug') === '1';
    this.editMode = params.get('edit') === '1';
    this.mode = this.preview ? 'game' : this.editMode ? 'map' : (['menu', 'map', 'game'].includes(params.get('screen')) ? params.get('screen') : 'menu');
    const requestedSection = Number(params.get('section'));
    if (this.mode === 'map' && Number.isInteger(requestedSection) && requestedSection >= 1 && requestedSection <= LOCATIONS.length) this.section = requestedSection-1;
    this.editorNotice = 'Перетаскивайте ноды. Путь перестраивается автоматически.';
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
  go(mode) { if (this.preview && mode !== 'game') { this.preview=false; this.tiles=null; this.level=this.current; } if (mode === 'map' && this.mode !== 'map') this.section = Math.floor((this.current-1)/10); this.mode = mode; this.modal = null; this.selected = null; this.draw(); }
  loadingStatus(message, progress) {
    const overlay = document.getElementById('loading-screen');
    if (!overlay) return;
    overlay.hidden = false;
    document.getElementById('loading-message').textContent = message;
    document.getElementById('loading-progress').value = progress;
  }
  ensureBackground() {
    if (!this.art) return true;
    const ratio = this.scale.height > this.scale.width ? 'portrait' : 'landscape';
    const aspect = ratio === 'portrait' ? '9x16' : '16x9';
    let key, path;
    if (this.mode === 'map' && !this.editMode) {
      if (this.section > 2) return true;
      const section = String(this.section + 1).padStart(2,'0');
      key = `section${section}-${ratio}`;
      path = `assets/runtime/backgrounds/sections/${section}/map_${ratio}.webp`;
    } else if (this.mode === 'game' && this.level >= 11 && this.level <= 30) {
      const section = String(Math.floor((this.level-1)/10)+1).padStart(2,'0');
      key = `section${section}-${ratio}`;
      path = `assets/runtime/backgrounds/sections/${section}/map_${ratio}.webp`;
    } else {
      const mode = this.mode === 'map' ? 'map' : 'gameplay';
      key = `${mode}-${aspect}`;
      path = `assets/runtime/backgrounds/ch1/${mode}/ch1_${mode==='map'?'map':'level'}_bg_${aspect}.webp`;
    }
    if (this.textures.exists(key)) return true;
    if (this.backgroundLoading) return false;
    if (this.failedBackgrounds?.has(key)) return true;
    this.backgroundLoading = true;
    this.input.enabled = false;
    this.loadingStatus('Открываем локацию',0);
    const failed = file => { if(file.key === key) { this.failedBackgrounds ||= new Set(); this.failedBackgrounds.add(key); } };
    this.load.on('loaderror',failed);
    this.load.once('complete',() => {
      this.load.off('loaderror',failed);
      this.backgroundLoading = false;
      this.input.enabled = true;
      this.draw();
    });
    this.load.image(key,path);
    this.load.start();
    return false;
  }
  draw() {
    if (!this.ensureBackground()) return;
    const loading = document.getElementById('loading-screen');
    if (loading) loading.hidden = true;
    this.tweens.killAll();
    this.resolvingPair = false;
    this.input.enabled = true;
    // DisplayList.removeAll removes rendering entries, not interactive objects.
    // Destroy the previous view so invisible map nodes/buttons cannot receive taps.
    for (const child of [...this.children.list]) child.destroy();
    this.input.removeAllListeners();
    this.modal = null; this.w = this.scale.width; this.h = this.scale.height; this.p = this.h > this.w;
    this.background();
    if (this.mode === 'menu') this.menu();
    if (this.mode === 'map') this.map();
    if (this.mode === 'game') { if (!this.tiles) this.newBoard(); this.gameplay(); }
    if (this.guides) this.overlay();
  }
  background() {
    if (this.mode === 'map' && !this.editMode) { this.locationBackground(); return; }
    const g = this.add.graphics();
    g.fillStyle(0xeeeede, 1).fillRect(0, 0, this.w, this.h);
    const locationGame = this.mode === 'game' && this.level >= 11 && this.level <= 30;
    const section = String(Math.floor((this.level-1)/10)+1).padStart(2,'0');
    const key = locationGame ? `section${section}-${this.p ? 'portrait' : 'landscape'}` : `${this.mode === 'map' ? 'map' : 'gameplay'}-${this.p ? '9x16' : '16x9'}`;
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
  locationBackground() {
    const key = `section${String(this.section+1).padStart(2,'0')}-${this.p ? 'portrait' : 'landscape'}`;
    if(this.art && this.section<=2 && this.textures.exists(key)) {
      this.add.image(this.w/2,this.h/2,key).setDisplaySize(this.w,this.h);
      return;
    }
    const theme = LOCATIONS[this.section], g = this.add.graphics();
    g.fillStyle(theme.sky).fillRect(0, 0, this.w, this.h);
    g.fillStyle(theme.water, .65).fillEllipse(this.w*.5, this.h*.68, this.w*1.35, this.h*.66);
    g.lineStyle(3, 0xffffff, .28);
    for (let i=0; i<7; i++) g.strokeEllipse(this.w*.5, this.h*.7, this.w*.5+i*135, this.h*.2+i*60);
    for (const x of [this.w*.05, this.w*.95]) {
      if (this.section === 1) {
        for(let i=0;i<5;i++) {
          const bx=x+(i-2)*28;
          g.lineStyle(13,theme.foliage,.7).lineBetween(bx,this.h*.85,bx+30,this.h*.22);
          for(let j=0;j<6;j++) g.fillStyle(theme.foliage,.6).fillEllipse(bx+45,this.h*(.3+j*.07),95,22);
        }
      } else if (this.section < 4) {
        g.fillStyle(0x846e5e,.5).fillRoundedRect(x-15,this.h*.31,30,this.h*.5,10);
        for(let i=0;i<5;i++) g.fillStyle(theme.foliage,.45).fillCircle(x+Math.sin(i*2)*95,this.h*.28+Math.cos(i*2)*70,110);
      } else {
        g.fillStyle(theme.foliage,.5).fillRect(x-70,this.h*.32,140,this.h*.43);
        g.fillStyle(0x65576f,.65).fillTriangle(x-130,this.h*.34,x+130,this.h*.34,x,this.h*.22);
        g.lineStyle(5,0xc3a25e,.65).lineBetween(x-100,this.h*.34,x+100,this.h*.34);
      }
    }
    if(this.section === 3) {
      g.lineStyle(20,0x9b7761,.45).strokeEllipse(this.w*.5,this.h*.82,this.w*.85,this.h*.18);
    }
    lotus(this,this.w*.13,this.h*.83,1.3,this.section>=2);
    lotus(this,this.w*.87,this.h*.74,1.1,this.section>=2);
  }
  sectionMap() {
    const first=this.section*10+1, last=first+9;
    this.level=first;
    const polished=this.art && this.section<=2;
    const points=Array.from({length:10},(_,i)=>this.p
      ? {x: [310,770,770,310,310,770,770,310,310,770][i], y:1450-Math.floor(i/2)*245}
      : {x:260+(i%5)*350,y:i<5?400:740});
    let order=this.p?points:points.slice(0,5).concat(points.slice(5).reverse());
    if(polished && this.section===0) {
      // Art has no labels: sequence is authoritative and supplied by code.
      order=this.p
        ? [[.277,.742],[.735,.742],[.728,.565],[.31,.565],[.32,.425],[.717,.425],[.719,.309],[.339,.309],[.355,.205],[.718,.185]].map(([x,y])=>({x:x*this.w,y:y*this.h}))
        : [[.20,.358],[.35,.358],[.50,.358],[.65,.358],[.81,.358],[.81,.665],[.65,.665],[.50,.665],[.35,.665],[.20,.665]].map(([x,y])=>({x:x*this.w,y:y*this.h}));
    }
    if(polished && this.section===1) {
      order=this.p
        ? [[.28,.67],[.72,.67],[.72,.51],[.28,.51],[.28,.40],[.72,.40],[.72,.29],[.28,.29],[.28,.20],[.72,.20]].map(([x,y])=>({x:x*this.w,y:y*this.h}))
        : [[.14,.39],[.32,.39],[.50,.39],[.68,.39],[.86,.39],[.86,.63],[.68,.63],[.50,.63],[.32,.63],[.14,.63]].map(([x,y])=>({x:x*this.w,y:y*this.h}));
    }
    if(polished && this.section===2) {
      order=this.p
        ? [[.28,.71],[.72,.71],[.72,.547],[.28,.547],[.28,.41],[.72,.41],[.72,.293],[.28,.293],[.28,.193],[.72,.193]].map(([x,y])=>({x:x*this.w,y:y*this.h}))
        : [[.14,.372],[.32,.372],[.50,.372],[.68,.372],[.86,.372],[.86,.60],[.68,.60],[.50,.60],[.32,.60],[.14,.60]].map(([x,y])=>({x:x*this.w,y:y*this.h}));
    }
    this.mapPoints=order;
    const g=this.add.graphics();
    for(let i=0;i<9;i++) {
      const a=order[i],b=order[i+1];
      if(!polished) g.lineStyle(6,C.gold,.7).lineBetween(a.x,a.y,b.x,b.y);
      // On artwork, discreet progression dots clarify the visiting order.
      else for(let k=1;k<6;k++) g.fillStyle(C.gold,.85).fillCircle(a.x+(b.x-a.x)*k/6,a.y+(b.y-a.y)*k/6,4);
    }
    order.forEach((point,i)=>{
      const n=first+i,complete=this.state.completed.includes(n),locked=n>this.current;
      const frame=locked?'locked':n===this.current?'current':complete?'completed':'available';
      if(this.textures.exists('review-map')) this.add.image(point.x,point.y,'review-map',`map_node_${frame}`).setDisplaySize(150,150);
      else this.add.circle(point.x,point.y,65,locked?0x82948b:C.jade);
      text(this,point.x,point.y+42,String(n),29,'#fff6d5');
      if(n===this.current) {
        const tagY=point.y+(polished && this.section===2 && this.p && i>=8 ? 95 : -108);
        panel(this,point.x,tagY,190,42,C.ivory,.96,14); text(this,point.x,tagY,'ВЫ ЗДЕСЬ',20,C.ink);
      }
      if(i===9 && !(polished && this.section>=1 && this.p)) { panel(this,point.x,point.y+115,220,42,C.ivory,.96,14); text(this,point.x,point.y+115,n%20===0?'Врата главы':'Новая локация',21,C.ink); }
      if(!locked) this.add.zone(point.x,point.y,170,170).setInteractive({useHandCursor:true}).on('pointerup',()=>{
        if(this.modal)return;this.level=n;this.newBoard();this.go('game');
      });
    });
    this.hud('Глава '+(Math.floor(this.section/2)+1),LOCATIONS[this.section].name);
    panel(this,this.w/2,this.p?250:175,this.p?730:850,48,C.ivory,.95,16);
    text(this,this.w/2,this.p?250:175,`Участок ${this.section+1} из 6 · Уровни ${first}–${last}`,26,C.ink);
    const by=this.p?1775:995;
    panel(this,this.w/2,by,this.w-64,this.p?210:130,C.ivory,.97);
    button(this,this.p?150:180,by,110,82,'‹',()=>{if(this.section>0){this.section--;this.draw();}},false,46);
    button(this,this.w-(this.p?150:180),by,110,82,'›',()=>{if(this.section<5){this.section++;this.draw();}},false,46);
    const count=this.state.completed.filter(n=>n>=first&&n<=last).length;
    text(this,this.w/2,by-(this.p?55:35),`${count} / 10 пройдено`,24,C.muted);
    const target=this.current>=first&&this.current<=last?this.current:first;
    const available=first<=this.current;
    button(this,this.w/2,by+30,this.p?590:620,78,available?`Играть · ${target}`:'Локация пока закрыта',()=>{
      if(!available)return;this.level=target;this.newBoard();this.go('game');
    },available,28,available);
    if(this.section!==Math.floor((this.current-1)/10)) button(this,this.w/2,this.p?1625:875,380,68,'К текущему участку',()=>{this.section=Math.floor((this.current-1)/10);this.draw();},false,24);
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
  defaultMapPoints() {
    const step = this.p ? 225 : 275;
    const bottom = this.p ? 1640 : 900;
    return Array.from({ length: 60 }, (_, i) => this.p
      ? { x: 540 + Math.sin(i*.95)*245, y: bottom-140-i*step }
      : { x: 260+i*step, y: 530+Math.sin(i*.95)*200 });
  }
  editorFrameKey() { return this.p ? 'portrait' : 'landscape'; }
  readEditorStore() {
    try {
      const parsed = JSON.parse(localStorage.getItem('lotus.path-editor.v1'));
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch { return {}; }
  }
  editorPoints() {
    const fallback = this.defaultMapPoints();
    const saved = this.readEditorStore()[this.editorFrameKey()];
    if (!Array.isArray(saved) || saved.length !== 60) return fallback;
    const valid = saved.every(p => p && Number.isFinite(Number(p.x)) && Number.isFinite(Number(p.y)));
    return valid ? saved.map(p => ({ x: Number(p.x), y: Number(p.y) })) : fallback;
  }
  saveEditorPoints() {
    if (!this.mapPoints?.length) return;
    const store = this.readEditorStore();
    store[this.editorFrameKey()] = this.mapPoints.map(p => ({ x: Math.round(p.x), y: Math.round(p.y) }));
    store.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem('lotus.path-editor.v1', JSON.stringify(store));
      this.editorNotice = 'Сохранено в этом браузере';
    } catch {
      this.editorNotice = 'Не удалось сохранить: localStorage недоступен';
    }
  }
  resetEditorPoints() {
    const store = this.readEditorStore();
    delete store[this.editorFrameKey()];
    try { localStorage.setItem('lotus.path-editor.v1', JSON.stringify(store)); } catch {}
    this.offset = undefined;
    this.editorNotice = 'Расстановка этого формата сброшена';
    this.draw();
  }
  editorPayload() {
    this.saveEditorPoints();
    const store = this.readEditorStore();
    const normalize = (items) => Array.isArray(items) && items.length === 60
      ? items.map((p, i) => ({ level: i+1, x: Math.round(Number(p.x)), y: Math.round(Number(p.y)) }))
      : null;
    return {
      schema: 'mahjong-lotus-path-layout/v1',
      status: 'TEST',
      designFrames: { landscape: [1920,1080], portrait: [1080,1920] },
      landscape: normalize(store.landscape),
      portrait: normalize(store.portrait),
      updatedAt: store.updatedAt || new Date().toISOString()
    };
  }
  downloadEditorJSON() {
    const payload = JSON.stringify(this.editorPayload(), null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lotus-path-layout.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.editorNotice = 'JSON скачан';
    this.draw();
  }
  switchEditorFrame() {
    this.saveEditorPoints();
    const q = new URLSearchParams(location.search);
    q.set('screen', 'map');
    q.set('edit', '1');
    q.set('art', '1');
    q.set('frame', this.p ? 'landscape' : 'portrait');
    location.search = q.toString();
  }
  leaveEditor() {
    this.saveEditorPoints();
    const q = new URLSearchParams(location.search);
    q.set('screen', 'map');
    q.set('art', '1');
    q.set('frame', this.p ? 'portrait' : 'landscape');
    q.delete('edit');
    q.delete('debug');
    location.search = q.toString();
  }
  editorBar() {
    if (this.p) {
      panel(this, 540, 1790, 1016, 250, C.ivory, .98, 26);
      text(this, 540, 1695, 'РЕДАКТОР ПУТИ · 9:16', 22, C.ink, true);
      text(this, 540, 1730, this.editorNotice, 18, C.muted);
      button(this, 280, 1790, 430, 76, 'Сохранить', () => { this.saveEditorPoints(); this.draw(); }, true, 23);
      button(this, 800, 1790, 430, 76, 'Скачать JSON', () => this.downloadEditorJSON(), false, 23);
      button(this, 205, 1880, 250, 68, '16:9', () => this.switchEditorFrame(), false, 22);
      button(this, 540, 1880, 300, 68, 'Сбросить', () => this.resetEditorPoints(), false, 22);
      button(this, 875, 1880, 250, 68, 'Готово', () => this.leaveEditor(), true, 22);
    } else {
      panel(this, this.w/2, 1000, this.w-64, 132, C.ivory, .98, 24);
      text(this, 225, 974, 'РЕДАКТОР ПУТИ · 16:9', 20, C.ink, true);
      text(this, 225, 1012, this.editorNotice, 16, C.muted);
      button(this, 640, 1000, 245, 78, 'Сохранить', () => { this.saveEditorPoints(); this.draw(); }, true, 22);
      button(this, 915, 1000, 245, 78, 'Скачать JSON', () => this.downloadEditorJSON(), false, 22);
      button(this, 1190, 1000, 210, 78, '9:16', () => this.switchEditorFrame(), false, 22);
      button(this, 1435, 1000, 230, 78, 'Сбросить', () => this.resetEditorPoints(), false, 22);
      button(this, 1690, 1000, 210, 78, 'Готово', () => this.leaveEditor(), true, 22);
    }
  }
  map() {
    if (!this.editMode) { this.sectionMap(); return; }
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
    const points = this.editMode ? this.editorPoints() : this.defaultMapPoints();
    this.mapPoints = points;
    const g = this.add.graphics(); this.pathContainer.add(g);
    const redrawPath = () => {
      g.clear();
      for (let i=0; i<59; i++) {
        const a=points[i], b=points[i+1];
        g.lineStyle(5, C.gold, i<this.current-1 ? .8 : .25);
        g.lineBetween(a.x, a.y, b.x, b.y);
        for(let k=1;k<6;k++) g.fillStyle(C.gold, .65).fillCircle(Phaser.Math.Linear(a.x,b.x,k/6),Phaser.Math.Linear(a.y,b.y,k/6),4);
      }
    };
    this.redrawPath = redrawPath;
    redrawPath();
    this.mapNodes = [];
    points.forEach((point, index) => {
      const n = index+1, complete = this.state.completed.includes(n), locked = n > this.current;
      const frame = locked ? 'locked' : n === this.current ? 'current' : complete ? 'completed' : 'available';
      const node = this.textures.exists('review-map')
        ? this.add.image(point.x,point.y,'review-map',`map_node_${frame}`).setDisplaySize(n%5===0 ? 174 : 146,n%5===0 ? 174 : 146)
        : this.add.circle(point.x,point.y,65,locked ? 0x82948b : C.jade);
      this.pathContainer.add(node);
      const number=text(this,point.x,point.y+42,String(n),29,'#fff6d5'); this.pathContainer.add(number);
      const hit = this.add.zone(point.x,point.y,180,180).setInteractive({useHandCursor:this.editMode || !locked}); this.pathContainer.add(hit);
      const currentTag = n===this.current ? text(this,point.x,point.y-105,'ВЫ ЗДЕСЬ',20,C.ink) : null;
      const milestoneTag = n%5===0 ? text(this,point.x,point.y+112,n%20===0?'Врата главы':'Пробуждение',19,C.muted) : null;
      if(currentTag) this.pathContainer.add(currentTag);
      if(milestoneTag) this.pathContainer.add(milestoneTag);
      const entry = { n, hit, point, node, number, currentTag, milestoneTag };
      entry.position = () => {
        node.setPosition(point.x, point.y);
        number.setPosition(point.x, point.y+42);
        hit.setPosition(point.x, point.y);
        currentTag?.setPosition(point.x, point.y-105);
        milestoneTag?.setPosition(point.x, point.y+112);
      };
      this.mapNodes.push(entry);
      if (this.editMode) {
        hit.on('pointerdown', (_pointer, _localX, _localY, event) => {
          event?.stopPropagation?.();
          if (this.modal) return;
          this.editorDrag = entry;
          this.drag = null;
          this.dragDistance = 0;
          this.editorNotice = `Двигаем уровень ${n}`;
        });
      } else {
        hit.on('pointerup', pointer => {
          if(this.modal || locked || this.dragDistance>12 || pointer.y<top || pointer.y>bottom || (!this.p && (pointer.x<120 || pointer.x>1800))) return;
          this.level=n; this.newBoard(); this.go('game');
        });
      }
    });
    const move=()=> { this.offset=Phaser.Math.Clamp(this.offset,0,this.mapMax); this.pathContainer.setPosition(this.p?0:-this.offset,this.p?this.offset:0); };
    move(); this.dragDistance=0;
    this.input.on('pointerdown', p => {
      if(this.editorDrag) return;
      if(!this.modal && p.y>top && p.y<bottom) { this.drag={x:p.x,y:p.y,offset:this.offset};this.dragDistance=0; }
    });
    this.input.on('pointermove', p => {
      if (this.editorDrag && p.isDown && !this.modal) {
        const entry = this.editorDrag;
        entry.point.x = Math.round(this.p ? Phaser.Math.Clamp(p.x, 130, 950) : p.x + this.offset);
        entry.point.y = Math.round(this.p ? p.y - this.offset : Phaser.Math.Clamp(p.y, 230, 850));
        entry.position();
        redrawPath();
        this.editorNotice = `Уровень ${entry.n}: x ${entry.point.x}, y ${entry.point.y}`;
        return;
      }
      if(!p.isDown || !this.drag || this.modal) return;
      const d=this.p?p.y-this.drag.y:this.drag.x-p.x;
      this.dragDistance=Math.max(this.dragDistance,Math.abs(d));
      this.offset=this.drag.offset+d;
      move();
    });
    this.input.on('pointerup',()=>{
      if (this.editorDrag) {
        this.saveEditorPoints();
        this.editorDrag = null;
      }
      this.drag=null;
    });
    this.input.on('wheel',(_p,_o,dx,dy)=>{if(this.modal)return;this.offset+=(this.p?dy:(Math.abs(dx)>Math.abs(dy)?dx:dy))*.9;move();});
    this.hud('Глава '+(Math.floor((this.current-1)/20)+1),this.p?'Путь Лотоса':CHAPTERS[Math.floor((this.current-1)/20)]);
    if (this.editMode) { this.editorBar(); return; }
    const by=this.p?1785:997;
    panel(this,this.w/2,by,this.w-64,this.p?200:128,C.ivory,.97);
    text(this,this.p?270:400,by-25,'ВАШ ПУТЬ',20,C.muted);
    text(this,this.p?270:400,by+20,`${this.state.completed.length} / 60`,36,C.ink,true);
    button(this,this.p?735:this.w/2,by,this.p?460:460,92,`Играть · ${this.current}`,()=>{this.level=this.current;this.newBoard();this.go('game');},true,32);
    if(!this.p) button(this,this.w-345,by,420,82,'К текущему уровню',()=>{this.offset=undefined;this.draw();},false,25);
    else button(this,540,1620,280,68,'К текущему',()=>{this.offset=undefined;this.draw();},false,24);
  }
  newBoard() { this.tiles=geometry(this.level); deal(this.tiles); this.selected=null; this.hinted=[]; this.notice=null; }
  gameplay() {
    this.hud(this.preview ? 'Просмотр уровня' : 'Уровень',String(this.level));
    const bx=this.p?540:960, by=this.p?885:525, bw=this.p?900:1280, bh=this.p?1050:700;
    panel(this,bx,by,bw,bh,C.jade,this.art ? .92 : .98,36);
    text(this,bx,by-bh/2+40,LEVELS[this.level-1]?.name.toUpperCase() || 'СОБИРАЙТЕ ОДИНАКОВЫЕ СВОБОДНЫЕ ПАРЫ',this.p?20:19,'#bfd3c1');
    // Same board geometry in both orientations: mobile reflows nothing mid-game.
    const placement=boardPlacement(this.tiles,bw-100,bh-180,this.p?134:116);
    const {tw,th,dx,dy}=placement;
    const ox=bx+placement.ox, oy=by+placement.oy;
    this.boardObjects=[];
    const live=this.tiles.filter(t=>!t.removed).sort((a,b)=>a.z-b.z||a.y-b.y||a.x-b.x);
    for(const tile of live) {
      const x=ox+tile.x*dx-tile.z*10, y=oy+tile.y*dy-tile.z*13;
      const isFree=free(tile,this.tiles), selected=tile.id===this.selected, hinted=this.hinted?.includes(tile.id);
      const g=this.add.graphics();
      let symbol;
      if(this.textures.exists('review-tiles')) {
        symbol=this.add.image(x,y,'review-tiles',`tile_${String(tile.symbol).padStart(2,'0')}`).setDisplaySize(tw,th);
        if(!isFree) symbol.setTint(0xb5c1b6);
        if(selected) symbol.setDisplaySize(tw*1.045,th*1.045);
        if(selected||hinted) g.lineStyle(5,0xf6ca65,1).strokeRoundedRect(x-tw/2-2,y-th/2-2,tw+4,th+4,12);
      } else {
        g.fillStyle(isFree?0xfff9eb:0xd3d7c5).fillRoundedRect(x-tw/2,y-th/2,tw,th,12);
        symbol=text(this,x,y-5,SYMBOLS[tile.symbol],49,C.ink);
      }
      const hit=this.add.zone(x,y,tw,th).setInteractive({useHandCursor:isFree});
      hit.on('pointerup',()=>this.selectTile(tile));
      this.boardObjects.push({tile,hit,x,y,g,symbol});
    }
    const left=live.length/2;
    text(this,bx,by+bh/2-36,`Осталось пар: ${left}     ·     Доступно: ${pairs(this.tiles).length}`,25,'#dbe6cf');
    const by2=this.p?1710:965, spacing=this.p?310:330;
    ['Подсказка','Перемешать','Благословение'].forEach((name,i)=>{
      const x=this.w/2+(i-1)*spacing;
      const control=button(this,x,by2,this.p?280:300,this.p?150:116,name,()=>this.boost(i),false,this.p?25:26);
      control.getData('label').setY(this.p?38:25);
      if(this.textures.exists('review-ui')) this.add.image(x,by2-(this.p?45:34),'review-ui',['hint','shuffle','blessing'][i]).setDisplaySize(this.p?100:86,this.p?100:86);
    });
    panel(this,this.w/2,this.p?1820:1043,this.p?940:1140,48,C.ivory,.98,16);
    text(this,this.w/2,this.p?1820:1043,this.notice||'Свободная плитка открыта сверху и хотя бы с одной стороны',this.p?23:22,C.muted);
    if(!left) this.victory();
  }
  selectTile(tile) {
    if(this.resolvingPair || this.modal || tile.removed || !free(tile,this.tiles))return;
    this.tone();
    if(this.selected===tile.id){this.selected=null;this.draw();return;}
    const previous=this.tiles.find(t=>t.id===this.selected);
    if(previous && previous.symbol===tile.symbol && free(previous,this.tiles)) {
      this.removePair([previous,tile],'Пара найдена');
    } else {this.selected=tile.id;this.notice=previous?'Выберите плитку с таким же символом':null;this.draw();}
  }
  removePair(pair, notice) {
    if(this.resolvingPair || this.modal || pair.length!==2 || pair.some(tile=>tile.removed)) return;
    // Commit the move before its visual effect; resizing must never resurrect tiles.
    pair.forEach(tile=>{tile.removed=true;});
    this.selected=null;this.hinted=[];this.notice=notice;
    const finish=()=>{
      this.resolvingPair=false;this.input.enabled=true;this.draw();
      if(this.tiles.some(tile=>!tile.removed)&&!pairs(this.tiles).length)this.noMoves();
    };
    const targets=this.boardObjects?.filter(item=>pair.includes(item.tile)).flatMap(item=>[item.symbol,item.g]) || [];
    if(!this.state.motion || !targets.length) {finish();return;}
    this.resolvingPair=true;this.input.enabled=false;
    this.tweens.add({targets,alpha:0,duration:220,ease:'Sine.easeIn',onComplete:finish});
  }
  boost(index) {
    if(this.resolvingPair || this.modal) return;
    const pair=pairs(this.tiles)[0];
    if(index===1) {deal(this.tiles);this.selected=null;this.hinted=[];this.notice='Плитки перемешаны. Есть решение.';this.draw();return;}
    if(!pair){this.noMoves();return;}
    if(index===0){this.hinted=pair.map(t=>t.id);this.notice='Выделена доступная пара';this.draw();}
    if(index===2) this.removePair(pair,'Благословение убрало одну пару');
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
    const replay = this.state.completed.includes(this.level);
    if(!this.preview && !replay){this.state.completed.push(this.level);this.save();}
    this.current=Math.min(60,Math.max(0,...this.state.completed)+1);
    const last=this.level===(this.preview?LEVELS.length:60);
    const sectionEnd=this.level%10===0;
    const nextLocation=LOCATIONS[Math.floor(this.level/10)]?.name;
    const title=last ? (this.preview?'Просмотр завершён':'Путь Лотоса пройден')
      : sectionEnd ? 'Новая локация впереди' : 'Уровень завершён';
    const detail=this.preview ? 'Тестовый просмотр · прогресс не сохраняется'
      : last ? 'Все 60 уровней завершены. Спасибо за путешествие!'
      : sectionEnd ? `Далее — ${nextLocation}`
      : this.level%5===0 ? 'Вы достигли нового рубежа Пути' : 'Ещё один шаг по Пути Лотоса';
    const progress=this.preview ? `Уровень ${this.level}`
      : `Уровень ${this.level} · Пройдено ${new Set(this.state.completed).size} из 60`;
    this.popup(title,`${progress}\n${detail}`,[
      [last?'На карту':sectionEnd?'В следующую локацию':`Далее · Уровень ${this.level+1}`,()=>{
        if(last){this.go('map');return;}
        this.level++;this.section=Math.floor((this.level-1)/10);
        this.newBoard();this.draw();
      }],
      [last?'Сыграть ещё раз':'Вернуться на Путь',()=>{
        if(last){this.newBoard();this.draw();return;}
        this.offset=undefined;this.go('map');
      }]
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
