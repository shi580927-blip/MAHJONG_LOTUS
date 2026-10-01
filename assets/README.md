# Assets — production rules

Главные источники:
- `docs/LAYOUT_WORKFLOW.md`
- `docs/ASSET_PRODUCTION_SPEC.md`
- `docs/ATLAS_STRUCTURE.md`
- `assets/manifests/asset_manifest.csv`
- `assets/manifests/atlas_manifest.json`

## Главное

Уже утверждено и не откатывается:
- 24 tile symbols;
- одна геометрия плитки + 3 chapter bases;
- Core UI;
- map_common;
- 60 уровней хранятся как данные/JSON;
- small sprites — texture atlas;
- chapter-specific atlases — lazy load;
- FX — отдельный pass.

Новый обязательный принцип для screen-dependent art:
- design frame только 1920×1080 и 1080×1920;
- сначала safe zones и wireframe;
- затем layout approval;
- только потом background composition;
- portrait — отдельная композиция, не crop;
- ultra-wide не расширяет gameplay frame.

Не добавлять новые asset names без обновления manifest.

## Background folders

```text
assets/source/chapters/
  ch1/
    backgrounds/
      map/
        landscape/
        portrait/
      gameplay/
        landscape/
        portrait/
  ch2/
    backgrounds/
      map/
        landscape/
        portrait/
      gameplay/
        landscape/
        portrait/
  ch3/
    backgrounds/
      map/
        landscape/
        portrait/
      gameplay/
        landscape/
        portrait/

assets/runtime/backgrounds/
  ch1/
    map/
    gameplay/
  ch2/
    map/
    gameplay/
  ch3/
    map/
    gameplay/
```

Rules:
- `source` = originals, generated candidates, masters before optimization;
- `runtime` = files actually available to Phaser;
- наличие файла в runtime не означает APPROVED;
- landscape target = 1920×1080;
- portrait target = 1080×1920;
- final large opaque backgrounds = WebP;
- no UI/text/nodes are baked into backgrounds;
- do not overwrite an APPROVED file with an experiment;
- existing Chapter 1 backgrounds are **TEST / REVIEW reference only** until their screen layout is approved;
- old root `ch1_bg_master.webp` is REPLACED/removed and must not be restored.

## Chapter 1 current reference files

Source masters:
- `source/chapters/ch1/backgrounds/map/landscape/ch1_map_master_16x9.webp`
- `source/chapters/ch1/backgrounds/map/portrait/ch1_map_master_9x16.webp`
- `source/chapters/ch1/backgrounds/gameplay/landscape/ch1_level_master_16x9.webp`
- `source/chapters/ch1/backgrounds/gameplay/portrait/ch1_level_master_9x16.webp`

Runtime:
- `runtime/backgrounds/ch1/map/ch1_map_bg_16x9.webp`
- `runtime/backgrounds/ch1/map/ch1_map_bg_9x16.webp`
- `runtime/backgrounds/ch1/gameplay/ch1_level_bg_16x9.webp`
- `runtime/backgrounds/ch1/gameplay/ch1_level_bg_9x16.webp`

Все четыре файла имеют правильные target dimensions, но статус остаётся TEST / REVIEW.

Следующая производственная работа по графике начинается только после утверждения четырёх wireframe-экранов. Первый новый background-pass — Gameplay 16:9.
