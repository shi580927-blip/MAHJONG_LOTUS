# Assets — production rules

Источник правил:
- `docs/ASSET_PRODUCTION_SPEC.md`
- `docs/ATLAS_STRUCTURE.md`
- `assets/manifests/asset_manifest.csv`
- `assets/manifests/atlas_manifest.json`

## Главное
- 24 tile symbols.
- Одна геометрия плитки, 3 chapter bases.
- 60 уровней = JSON, не изображения.
- Карта собирается слоями.
- Large backgrounds отдельно.
- Small sprites в atlas.
- Chapter-specific atlases загружаются по требованию.
- FX — отдельный pass после статических ассетов.

Не добавлять новые asset names без обновления manifest.


## Background folders

Source/master images and candidates are stored separately from files already used by the game:

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
- `source` = originals, generated candidates, approved masters before optimization;
- `runtime` = only files actually loaded by Phaser;
- landscape target = 1920×1080;
- portrait target = 1080×1920;
- final large opaque backgrounds = WebP;
- no UI/text/nodes are baked into backgrounds;
- do not overwrite an APPROVED file with an experiment; keep experiment in `source` until approved.

Chapter 1 target runtime filenames:
- `backgrounds/ch1/map/ch1_map_bg_16x9.webp`
- `backgrounds/ch1/map/ch1_map_bg_9x16.webp`
- `backgrounds/ch1/gameplay/ch1_level_bg_16x9.webp`
- `backgrounds/ch1/gameplay/ch1_level_bg_9x16.webp`

The current root-level `ch1_bg_master.webp` remains TEST only until replaced by selected production backgrounds.
