# TEXTURE ATLAS & ASSET STRUCTURE — Маджонг: Путь Лотоса

**Цель:** минимизировать draw calls и число файлов, не загружая в GPU ассеты всех трёх глав одновременно. Screen-dependent backgrounds подчиняются `docs/LAYOUT_WORKFLOW.md` и не становятся production до layout approval.

---

## 1. ПРИНЦИП

Не делаем один гигантский atlas всей игры.

Разделяем:
1. common — нужен часто;
2. chapter-specific — загружается только для текущей главы;
3. large backgrounds — отдельные WebP/PNG;
4. screen-dependent backgrounds/decor — только после wireframe/layout approval;
5. FX — отдельные atlases после статического production pass.

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
- грузить их по chapter и экрану;
- не держать предыдущую главу в GPU.

Design frames фиксированы:
- landscape — 1920×1080;
- portrait — 1080×1920.

Map и Gameplay имеют отдельные background compositions. Portrait — самостоятельная композиция, не crop landscape.

Production background допускается только после layout approval. До этого файл может иметь только статус TEST / REVIEW.

Extra physical viewport за пределами fixed design frame не является gameplay background. Он заполняется внешним matte/decor на уровне контейнера/страницы и не расширяет игровую композицию.

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

**Статус:** TEST / wireframe review.

Уже подключено:
- `assets/runtime/atlases/map_common/map_common.webp` + `map_common.json`;
- fixed logical frames 1920×1080 / 1080×1920;
- Phaser.Scale.FIT;
- wireframe mode по умолчанию;
- отдельные MapScene и GameScene.

Существующие Chapter 1 art backgrounds загружаются только в review-режиме `?art=1` и не считаются production-approved.

`map_common.webp` остаётся лёгким runtime proxy для текущей интеграции; production freeze map_common — PNG + JSON с alpha, padding 4 px, extrusion 2 px, rotation OFF.

Art-first background integration больше не используется как источник layout-геометрии.

## 14. BACKGROUND SOURCE/RUNTIME LAYOUT

Backgrounds не входят в texture atlas.

Структура для каждой главы:
```text
assets/source/chapters/chN/backgrounds/
  map/
    landscape/
    portrait/
  gameplay/
    landscape/
    portrait/

assets/runtime/backgrounds/chN/
  map/
  gameplay/
```

Для Chapter 1 сейчас существуют:
- `map/ch1_map_bg_16x9.webp`;
- `map/ch1_map_bg_9x16.webp`;
- `gameplay/ch1_level_bg_16x9.webp`;
- `gameplay/ch1_level_bg_9x16.webp`.

Текущий статус четырёх файлов: **TEST / REVIEW**.

Правила:
- source может содержать кандидатов и masters;
- runtime содержит только файл, который реально может загрузить Phaser;
- наличие runtime-файла не означает APPROVED;
- production replacement допускается только после wireframe/layout approval;
- landscape и portrait — отдельные композиции;
- автоматический crop/тайлинг/зеркалирование не считается production-решением для background composition;
- full-screen far/mid/foreground layers создаются только после утверждения clean composition и только если реально нужны parallax/ambient-эффектам;
- матовые внешние поля ultra-wide не входят в gameplay background и не попадают в эти папки.
