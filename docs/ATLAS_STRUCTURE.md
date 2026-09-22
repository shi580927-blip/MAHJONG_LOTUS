# TEXTURE ATLAS & ASSET STRUCTURE — Маджонг: Путь Лотоса

**Цель:** минимизировать draw calls и число файлов, не загружая в GPU ассеты всех трёх глав одновременно.

---

## 1. ПРИНЦИП

Не делаем один гигантский atlas всей игры.

Разделяем:
1. common — нужен часто;
2. chapter-specific — загружается только для текущей главы;
3. large backgrounds — отдельные WebP/PNG;
4. FX — отдельные atlases после основного asset pass.

---

## 2. ПАПКИ

```text
assets/
  data/
    levels/
      chapter_01_levels.json
      chapter_02_levels.json
      chapter_03_levels.json

  source/
    tiles/
    ui/
    map/
    chapters/
      ch1/
      ch2/
      ch3/
    decor/
    fx/

  runtime/
    backgrounds/
      ch1/
      ch2/
      ch3/

    atlases/
      tiles_common/
      tiles_ch1/
      tiles_ch2/
      tiles_ch3/
      ui_common/
      ui_game/
      ui_menu/
      ui_result/
      map_common/
      map_ch1/
      map_ch2/
      map_ch3/
      decor_common/
      decor_ch1/
      decor_ch2/
      decor_ch3/
      fx_common/        # позже
      fx_ch1/           # позже при необходимости
      fx_ch2/
      fx_ch3/

  manifests/
    asset_manifest.csv
    atlas_manifest.json
```

---

## 3. ATLAS GROUPS

### atlas: tiles_common
Содержит:
- 24 symbols;
- tile_shadow;
- selected/hint/blocked helper overlays.

**Не содержит:** chapter tile bases.

Причина: символы нужны во всех главах, а chapter base можно менять отдельно.

### atlas: tiles_ch1 / tiles_ch2 / tiles_ch3
По одному очень маленькому chapter-atlas:
- tile_base_chX;
- при необходимости 1–2 chapter-specific edge/decor pieces.

Загружается только текущий chapter pack.

### atlas: ui_common
- currency panels;
- currency icons;
- buttons;
- settings icons;
- toggles;
- universal 9-slice frames.

Постоянно загружен.

### atlas: ui_game
- booster icons;
- booster slot;
- count badge;
- gameplay-only UI decorations.

Загружается с gameplay.

### atlas: ui_menu
- малые декоративные элементы меню.
Логотипы допускается держать separate из-за размеров и локалей.

### atlas: ui_result
- result_lotus_emblem;
- reward visuals;
- no-moves emblems.

### atlas: map_common
- level nodes;
- path segments;
- common navigation icons.

### atlas: map_ch1 / map_ch2 / map_ch3
Только малые/средние прозрачные modular objects конкретной главы.

**Не помещать сюда:**
- полноэкранные фоны;
- огромные 1200+ px элементы, если они резко снижают packing efficiency.

### atlas: decor_common
- petals;
- leaves;
- tiny glints;
- sparkle source sprites.

### atlas: decor_ch1/ch2/ch3
Только chapter-specific small ambient sprites, например koi.

### atlas: fx_*
Создаются после утверждения FX-пака.

---

## 4. BACKGROUNDS

Большие backgrounds хранятся отдельно, чтобы:
- не раздувать atlas;
- независимо сжимать WebP;
- грузить их по chapter;
- не держать предыдущую главу в GPU.

Пример:
```text
runtime/backgrounds/ch1/ch1_bg_far.webp
runtime/backgrounds/ch1/ch1_bg_water.webp
runtime/backgrounds/ch1/ch1_fg_soft.png
```

---

## 5. LOAD POLICY

### Boot
Загружаем только:
- минимальный loader;
- logo;
- обязательные системные данные.

### Main Menu
- ui_common;
- ui_menu;
- menu background/logo.

### Map Chapter N
- ui_common;
- map_common;
- map_chN;
- decor_common;
- decor_chN;
- chapter map/background layers.

### Gameplay Chapter N
- ui_common;
- ui_game;
- tiles_common;
- tiles_chN;
- gameplay background layers текущей главы;
- audio текущей главы/общий audio.

### Result
- ui_result остаётся малым и может быть preload вместе с ui_game.

### Chapter transition
1. preload следующего chapter pack;
2. показать переход;
3. переключить сцену;
4. выгрузить map_chPrev / tiles_chPrev / decor_chPrev / большие backgrounds prev chapter.

---

## 6. ATLAS SIZE POLICY

Цель:
- предпочтительно 1024×1024 или 2048×2048;
- **не делать 4096×4096 по умолчанию**;
- split atlas, если packing выходит >2048;
- chapter atlases могут быть меньше: 512/1024.

Почему:
- меньше пиковая память;
- быстрее декодирование;
- легче lazy-load;
- меньше риск проблем на слабых mobile web устройствах.

---

## 7. FRAME NAMING

Frame name = filename без расширения.

Примеры:
- `tile_symbol_09_lotus`
- `booster_shuffle`
- `map_node_milestone`
- `ch2_bridge_red`

Никаких автоматически сгенерированных `sprite_0004`.

---

## 8. PACKING RULES

- rotation OFF для UI и tiles;
- trim ON только если anchor не ломается;
- если trim используется — проверить Phaser origin;
- padding 4 px;
- extrude 2 px;
- не смешивать nearest/pixel-art и smooth art;
- mipmaps/texture filtering определяется на Этапе 7;
- крупные 9-slice source frames не trim, если это мешает border slicing.

---

## 9. ЧТО НЕ ПОПАДАЕТ В ATLAS

Отдельными файлами:
- большие chapter backgrounds;
- foreground full-screen overlays;
- локализованные логотипы;
- очень широкие/высокие landmark pieces, если packing неэффективен;
- music/SFX;
- level JSON;
- локализации.

---

## 10. ВЕС И ПАМЯТЬ

Важно: texture atlas уменьшает число файлов и draw-call/texture switching, но не «сжимает пиксели в GPU».

Поэтому:
- chapter split обязателен;
- не загружать все три мира одновременно;
- повторно использовать common sprites;
- ambient строить из малых source sprites + код;
- 60 уровней хранятся как данные;
- milestone states — наборы включённых объектов, а не 12 полноэкранных картинок.

---

## 11. FX — ПОЗЖЕ

После статического asset pass создать:
- fx_common atlas;
- chapter FX atlases только если действительно появится chapter-specific графика.

До этого момента glow/pulse/shimmer не должны попадать в production registry как готовые спрайты, кроме source particles (dot/petal/glint).

---

## 12. DEFINITION OF DONE ДЛЯ ATLAS

Atlas считается готовым, если:
- все frame names совпадают с manifest;
- нет случайных дублей;
- runtime JSON валиден;
- нет frame bleeding;
- no missing textures;
- texture <= утверждённого max;
- можно загрузить/выгрузить chapter pack независимо;
- нет большой картинки, которая должна быть separate;
- проверен memory/load на mobile после Этапа 7.


---

## 13. CURRENT PROTOTYPE INTEGRATION

**Статус:** TEST / на проверку.

Для первой визуальной интеграции карты в Phaser в репозиторий добавлен runtime proxy:
- `assets/runtime/atlases/map_common/map_common.webp`;
- `assets/runtime/atlases/map_common/map_common.json`.

WebP здесь используется только как лёгкий **TEST runtime proxy**, чтобы немедленно проверить карту на GitHub Pages. Утверждённый production-стандарт не меняется: финальный `map_common` перед production freeze экспортируется как **PNG + JSON**, с alpha, padding 4 px, extrusion 2 px, rotation OFF.

Для Chapter 1 временно подключён:
- `assets/runtime/backgrounds/ch1/ch1_bg_master.webp` — 1920×1080, TEST.

Это не заменяет утверждённую трёхслойную структуру Batch D:
- `ch1_bg_far.webp`;
- `ch1_bg_water.webp`;
- `ch1_fg_soft.png`.

Цель текущей версии — проверить композицию, прокрутку, размеры нод и адаптацию 16:9 / 9:16 до дальнейшего производства графики.
