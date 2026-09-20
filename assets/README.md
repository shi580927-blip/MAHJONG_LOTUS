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
