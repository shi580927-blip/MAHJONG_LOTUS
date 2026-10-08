# ASSET PRODUCTION SPEC — Маджонг: Путь Лотоса

**Статус:** WORKING PRODUCTION SPEC / BATCH A–C APPROVED / ENVIRONMENT ART PAUSED  
**Назначение:** единый реестр графических ассетов для художника и разработки.  
**Порядок:** screen-independent approved assets сохраняются; screen-dependent background/decor создаются только после fixed frame → safe zones → wireframe → layout approval. FX остаётся отдельным последующим pass.  
**Важно:** 60 уровней не равны 60 изображениям. Геометрия уровней хранится как данные/JSON.

---

## 1. УТВЕРЖДЁННЫЕ ПРАВИЛА

1. 24 уникальных символа плиток.
2. Часть символов должна сохранять узнаваемое Mahjong-ощущение, часть — поддерживать мир «Пути Лотоса».
3. Геометрическая форма плитки одна на всю игру.
4. Визуальная основа/материал плитки различается по трём главам.
5. Главы:
   - 1–20 — Сад Безмятежности;
   - 21–40 — Сад Цветущей Сакуры;
   - 41–60 — Храм Лотоса.
6. Мир строится как **базовая сцена + включаемые/открываемые слои**, а не как 60 отдельных полноэкранных картинок.
7. Карта строится модульно.
8. UI: premium jade + gold + light ivory, с приоритетом читаемости.
9. Основные прозрачные ассеты — PNG; большие непрозрачные фоны — WebP/PNG по необходимости.
10. Малые спрайты группируются в texture atlas.
11. FX не рисуются вместе с основным asset pass. Для FX будет отдельный реестр после завершения статических ассетов.
12. Для экранов существуют только два design frame: 1920×1080 и 1080×1920.
13. Portrait — самостоятельная композиция; автоматический crop landscape не считается production-решением.
14. Текущие Chapter 1 backgrounds имеют статус TEST / REVIEW и не задают геометрию.
15. Новые backgrounds и screen-dependent decor запрещено переводить в production до layout approval соответствующего экрана.

---

## 2. ТЕХНИЧЕСКИЙ СТАНДАРТ

### Runtime
- прозрачные игровые спрайты: PNG-24;
- непрозрачные большие фоны: WebP, fallback PNG только если качество/alpha требует;
- texture atlas: JSON + PNG;
- максимальный рабочий atlas: **2048×2048**;
- padding между frames: 4 px;
- extrusion: 2 px;
- имена: lowercase snake_case;
- только латиница;
- без пробелов;
- без суффиксов final/final2/new.

### Source masters
Исходники художника хранятся отдельно от runtime-ассетов и могут быть 2–4× крупнее. В runtime попадают только оптимизированные экспортные версии.

### Anchor convention
- UI/icon: центр;
- tile: центр;
- map node: центр;
- вертикальный объект карты: bottom-center;
- декоративные foreground-элементы: bottom-center;
- particles/ambient sprites: центр.

---

# 3. TILE SYSTEM

## 3.1. Общая геометрия плитки

Рабочий runtime-размер: **192×240 px**.

Три основы сохраняют одинаковые:
- силуэт;
- пропорции;
- bevel;
- внутреннюю safe-area символа;
- anchor.

Различается только материал/ободок/малый декоративный акцент главы.

| ID | Файл | Назначение | Runtime | Alpha | Atlas |
|---|---|---|---:|---|---|
| TILE-BASE-01 | tile_base_ch1_serenity.png | Основа плитки главы 1 | 192×240 | yes | tiles_ch1 |
| TILE-BASE-02 | tile_base_ch2_sakura.png | Основа плитки главы 2 | 192×240 | yes | tiles_ch2 |
| TILE-BASE-03 | tile_base_ch3_temple.png | Основа плитки главы 3 | 192×240 | yes | tiles_ch3 |
| TILE-COM-01 | tile_shadow.png | Мягкая тень | 208×256 | yes | tiles_common |
| TILE-COM-02 | tile_overlay_selected.png | Selected overlay | 208×256 | yes | tiles_common |
| TILE-COM-03 | tile_overlay_hint.png | Highlight для подсказки | 208×256 | yes | tiles_common |
| TILE-COM-04 | tile_overlay_blocked.png | Нейтральный blocked overlay при необходимости | 192×240 | yes | tiles_common |

**Примечание:** обычное состояние free/blocked желательно различать прежде всего кодом через brightness/alpha/outline. Отдельные PNG используются только там, где программного эффекта недостаточно.

---

## 3.2. 24 символа плиток

Рабочий runtime-box каждого символа: **144×144 px**, рисунок должен держаться в safe-area примерно 120×120.

### A. Classic-inspired — 8

| № | Файл | Символ | Примечание |
|---:|---|---|---|
| 01 | tile_symbol_01_bamboo.png | Бамбук | Ясный вертикальный силуэт |
| 02 | tile_symbol_02_circle.png | Круг / circle suit motif | Крупная круглая композиция |
| 03 | tile_symbol_03_character.png | Иероглифический знак | Не мельчить штрихи |
| 04 | tile_symbol_04_red_dragon.png | Красный дракон | Упрощённый знак |
| 05 | tile_symbol_05_green_dragon.png | Зелёный дракон | Не путать с 04 по силуэту |
| 06 | tile_symbol_06_east_wind.png | Восточный ветер | Отдельная форма/рамка |
| 07 | tile_symbol_07_south_wind.png | Южный ветер | Отличимый знак |
| 08 | tile_symbol_08_white_dragon.png | Белый дракон | Геометрическая рамка/печать |

### B. Lotus-world — 16

| № | Файл | Символ | Примечание |
|---:|---|---|---|
| 09 | tile_symbol_09_lotus.png | Лотос | Главный фирменный символ |
| 10 | tile_symbol_10_sakura.png | Цветок сакуры | 5-лепестковый силуэт |
| 11 | tile_symbol_11_fan.png | Веер | Широкий силуэт |
| 12 | tile_symbol_12_jade_coin.png | Нефритовая монета | Не путать с circle |
| 13 | tile_symbol_13_scroll.png | Свиток | Горизонтально-диагональная форма |
| 14 | tile_symbol_14_lantern.png | Фонарь | Ясный вертикальный объект |
| 15 | tile_symbol_15_koi.png | Кои | S-образный силуэт |
| 16 | tile_symbol_16_wave.png | Волна | Крупный гребень |
| 17 | tile_symbol_17_cloud.png | Облако | Мягкий контур |
| 18 | tile_symbol_18_bridge.png | Мост | Горизонтальная арка |
| 19 | tile_symbol_19_torii_gate.png | Ворота | Строгий вертикальный силуэт |
| 20 | tile_symbol_20_bell.png | Храмовый колокол | Центральный подвес |
| 21 | tile_symbol_21_mountain.png | Гора | Треугольный силуэт |
| 22 | tile_symbol_22_sun_disc.png | Солнечный диск | Лучи/диск, отличный от circle |
| 23 | tile_symbol_23_crane.png | Журавль | Изогнутый силуэт птицы |
| 24 | tile_symbol_24_crescent_moon.png | Полумесяц | Очень простой контрастный знак |

### Правила символов
- все 24 читаются в уменьшении до ~48 px;
- силуэты должны отличаться даже без цвета;
- не использовать мелкий текст;
- не делать пары символов, различающиеся только цветом;
- цвет — вспомогательный признак, не единственный.

---

# 4. BOOSTERS

Runtime-box иконки: **160×160 px**.

| ID | Файл | Назначение | Alpha | Atlas |
|---|---|---|---|---|
| BST-01 | booster_hint.png | Подсказка | yes | ui_game |
| BST-02 | booster_shuffle.png | Перемешать | yes | ui_game |
| BST-03 | booster_lotus_blessing.png | Благословение Лотоса | yes | ui_game |
| BST-04 | booster_slot.png | Универсальный слот | yes | ui_game |
| BST-05 | booster_count_badge.png | Badge количества | yes | ui_game |

Иконка Благословения должна быть визуально сильнее обычного лотоса-плитки: использовать сочетание лотоса + сияющего центра/золотого кольца, но без готового FX.

---

# 5. UI COMMON

## 5.1. HUD

| ID | Файл | Назначение | Runtime | Atlas |
|---|---|---|---:|---|
| UI-001 | ui_currency_coin_panel.png | Панель монет | 320×96 | ui_common |
| UI-002 | ui_currency_petal_panel.png | Панель лепестков | 320×96 | ui_common |
| UI-003 | ui_icon_coin.png | Иконка монеты | 96×96 | ui_common |
| UI-004 | ui_icon_petal.png | Иконка лепестка | 96×96 | ui_common |
| UI-005 | ui_level_panel.png | Номер уровня/главы | 360×96 | ui_common |
| UI-006 | ui_button_pause.png | Пауза | 128×128 | ui_common |
| UI-007 | ui_button_back.png | Назад | 128×128 | ui_common |
| UI-008 | ui_button_close.png | Закрыть | 128×128 | ui_common |
| UI-009 | ui_button_primary.png | Универсальная primary-кнопка | 512×160 | ui_common |
| UI-010 | ui_button_secondary.png | Secondary-кнопка | 512×160 | ui_common |
| UI-011 | ui_button_small.png | Малая кнопка | 320×128 | ui_common |

Текст кнопок — кодом, не вшивать в изображение.

## 5.2. Settings

| ID | Файл | Назначение | Atlas |
|---|---|---|---|
| UI-SET-01 | ui_icon_music_on.png | Музыка on | ui_common |
| UI-SET-02 | ui_icon_music_off.png | Музыка off | ui_common |
| UI-SET-03 | ui_icon_sound_on.png | SFX on | ui_common |
| UI-SET-04 | ui_icon_sound_off.png | SFX off | ui_common |
| UI-SET-05 | ui_icon_language.png | Язык | ui_common |
| UI-SET-06 | ui_toggle_on.png | Toggle on | ui_common |
| UI-SET-07 | ui_toggle_off.png | Toggle off | ui_common |

## 5.3. Popup frames

| ID | Файл | Назначение | Runtime | Хранение |
|---|---|---|---:|---|
| UI-POP-01 | ui_popup_large_9slice.png | Победа / Settings | 720×720 master 9-slice | ui_common |
| UI-POP-02 | ui_popup_medium_9slice.png | No moves / confirm | 640×480 master 9-slice | ui_common |
| UI-POP-03 | ui_reward_slot.png | Ячейка награды | 192×192 | ui_common |

Предпочтительно использовать 9-slice, а не отдельный попап под каждый язык/размер.

---

# 6. MAIN MENU

| ID | Файл | Назначение | Формат | Alpha | Хранение |
|---|---|---|---|---|---|
| MENU-01 | logo_mahjong_lotus_ru.png | RU logo | PNG | yes | separate |
| MENU-02 | logo_mahjong_lotus_en.png | EN logo | PNG | yes | separate |
| MENU-03 | logo_mahjong_lotus_tr.png | TR logo | PNG | yes | separate |
| MENU-04 | menu_decor_lotus.png | Центральный декоративный элемент | PNG | yes | ui_menu |
| MENU-05 | menu_decor_corner_left.png | Левый орнамент | PNG | yes | ui_menu |
| MENU-06 | menu_decor_corner_right.png | Правый орнамент | PNG | yes | ui_menu |

Кнопки меню используют общие 9-slice/button assets из UI common.

---

# 7. PATH MAP — COMMON

## 7.1. Level nodes

Runtime: ориентир 144–176 px.

| ID | Файл | Назначение | Atlas |
|---|---|---|---|
| MAP-COM-01 | map_node_locked.png | Закрытая нода | map_common |
| MAP-COM-02 | map_node_available.png | Текущий доступный уровень | map_common |
| MAP-COM-03 | map_node_completed.png | Пройденный | map_common |
| MAP-COM-04 | map_node_milestone.png | 5/10/15/20 | map_common |
| MAP-COM-05 | map_node_chapter_end.png | Финальный узел главы | map_common |
| MAP-COM-06 | map_path_dot.png | Малый элемент золотой дорожки | map_common |
| MAP-COM-07 | map_path_segment_straight.png | Прямой золотой сегмент | map_common |
| MAP-COM-08 | map_path_segment_curve_l.png | Плавный изгиб L | map_common |
| MAP-COM-09 | map_path_segment_curve_r.png | Плавный изгиб R | map_common |

Номер уровня — кодом. На игровом HUD используется подпись «Уровень» + крупный номер; в map-node PNG цифры не вшиваются.

Утверждённое визуальное направление: ivory/розовые лотосы, нефритовые основания, золото; locked — серо-каменный; current/milestone визуально сильнее обычных нод. Дорожка — тонкая золотая модульная линия/точки, а не широкая каменная дорога. Один common-набор используется в 16:9 и 9:16. Y-разветвление для линейного Пути не требуется.

---

# 8. CHAPTER 1 — САД БЕЗМЯТЕЖНОСТИ

## 8.1. Background / screen compositions

Production background не проектируется до утверждения wireframe соответствующего экрана.

Целевые design frames:
- Map landscape — 1920×1080;
- Map portrait — 1080×1920;
- Gameplay landscape — 1920×1080;
- Gameplay portrait — 1080×1920.

Canonical runtime names после утверждения композиции:
| ID | Файл | Экран | Runtime | Статус |
|---|---|---|---:|---|
| CH1-MAP-BG-L | ch1_map_bg_16x9.webp | Map landscape | 1920×1080 | TEST / REVIEW |
| CH1-MAP-BG-P | ch1_map_bg_9x16.webp | Map portrait | 1080×1920 | TEST / REVIEW |
| CH1-LVL-BG-L | ch1_level_bg_16x9.webp | Gameplay landscape | 1920×1080 | TEST / REVIEW |
| CH1-LVL-BG-P | ch1_level_bg_9x16.webp | Gameplay portrait | 1080×1920 | TEST / REVIEW |

Текущие четыре файла сохраняются как reference/test и не считаются финальным Batch D.

После layout approval фон проходит три шага:
1. composition draft;
2. clean background;
3. integration preview с overlay.

Если для живого окружения нужен parallax, approved composition можно разложить на far/mid/foreground и отдельные ambient sprites. Слои не должны менять утверждённую композицию и safe zones.

Portrait создаётся как отдельная композиция в 1080×1920, а не как crop landscape.

## 8.2. Modular objects

| ID | Файл | Назначение | Alpha | Atlas |
|---|---|---|---|---|
| CH1-OBJ-01 | ch1_lotus_cluster_a.png | Лотосы A | yes | map_ch1 |
| CH1-OBJ-02 | ch1_lotus_cluster_b.png | Лотосы B | yes | map_ch1 |
| CH1-OBJ-03 | ch1_reeds_a.png | Камыш | yes | map_ch1 |
| CH1-OBJ-04 | ch1_stones_a.png | Камни | yes | map_ch1 |
| CH1-OBJ-05 | ch1_lantern_small.png | Фонарь | yes | map_ch1 |
| CH1-OBJ-06 | ch1_bridge_small.png | Малый мост | yes | map_ch1 |
| CH1-OBJ-07 | ch1_pavilion.png | Павильон | yes | map_ch1 |
| CH1-OBJ-08 | ch1_gate.png | Ворота финального участка | yes | map_ch1 |
| CH1-OBJ-09 | ch1_koi_a.png | Кои A | yes | decor_ch1 |
| CH1-OBJ-10 | ch1_koi_b.png | Кои B | yes | decor_ch1 |

## 8.3. Milestone reveal sets
- CH1 M5: дополнительные лотосы + первый фонарь;
- CH1 M10: малый мост + koi;
- CH1 M15: павильон + усиление сада;
- CH1 M20: ворота/выход к следующей главе.

Это состояния конфигурации, не отдельные screenshots.

---

# 9. CHAPTER 2 — САД ЦВЕТУЩЕЙ САКУРЫ

**Environment art gate:** PENDING. Не производить финальные backgrounds/decor до layout approval соответствующих Map/Gameplay экранов.

## Background
- ch2_bg_far.webp
- ch2_bg_garden.webp
- ch2_fg_sakura.png

## Modular
- ch2_sakura_branch_a.png
- ch2_sakura_branch_b.png
- ch2_sakura_tree_a.png
- ch2_petals_cluster_static.png
- ch2_bridge_red.png
- ch2_waterfall.png
- ch2_stone_lantern.png
- ch2_gate_inner.png
- ch2_garden_pavilion.png
- ch2_rock_cluster.png

Atlas: **map_ch2**, ambient small sprites: **decor_ch2**.

Milestones:
- M25: первые цветущие ветви;
- M30: мост/водопад;
- M35: павильон/фонари;
- M40: внутренние ворота к храмовой зоне.

---

# 10. CHAPTER 3 — ХРАМ ЛОТОСА

**Environment art gate:** PENDING. Не производить финальные backgrounds/decor до layout approval соответствующих Map/Gameplay экранов.

## Background
- ch3_bg_mountains.webp
- ch3_bg_temple.webp
- ch3_fg_architecture.png

## Modular
- ch3_stairs.png
- ch3_lantern_a.png
- ch3_lantern_b.png
- ch3_bell.png
- ch3_temple_gate.png
- ch3_lotus_altar.png
- ch3_gold_lotus_large.png
- ch3_incense_bowl.png
- ch3_column_decor.png
- ch3_final_temple_reveal.png

Atlas: **map_ch3**, ambient small sprites: **decor_ch3**.

Milestones:
- M45: лестница/фонари;
- M50: храмовые ворота;
- M55: алтарь/золотой лотос;
- M60: финальное раскрытие Храма Лотоса.

---

# 11. AMBIENT STATIC SPRITES — НЕ FX

Это исходные графические частицы/объекты, которые позже двигаются кодом.

| Файл | Runtime | Atlas |
|---|---:|---|
| ambient_petal_a.png | 48×48 | decor_common |
| ambient_petal_b.png | 48×48 | decor_common |
| ambient_petal_c.png | 48×48 | decor_common |
| ambient_leaf_a.png | 64×64 | decor_common |
| ambient_leaf_b.png | 64×64 | decor_common |
| ambient_glint_a.png | 64×64 | decor_common |
| ambient_glint_b.png | 64×64 | decor_common |
| ambient_mist_soft_a.png | 512×256 | separate or decor_common |
| ambient_mist_soft_b.png | 512×256 | separate or decor_common |
| ambient_sparkle_dot.png | 32×32 | decor_common |

Не рисовать анимационные sprite-sheet на этом этапе.

---

# 12. VICTORY / NO-MOVES ART

| ID | Файл | Назначение | Хранение |
|---|---|---|---|
| RESULT-01 | result_lotus_emblem.png | Эмблема победы | ui_result |
| RESULT-02 | result_reward_coin.png | Визуал награды монет | ui_result |
| RESULT-03 | result_reward_petal.png | Визуал награды лепестков | ui_result |
| RESULT-04 | nomoves_shuffle_emblem.png | Иллюстрация Shuffle | ui_result |
| RESULT-05 | nomoves_restart_emblem.png | Иллюстрация Restart | ui_result |

Тексты — кодом.

---

# 13. LEVEL DATA — НЕ ГРАФИКА

`assets/data/levels/`

Рекомендуемая структура:
- chapter_01_levels.json — уровни 001–020;
- chapter_02_levels.json — уровни 021–040;
- chapter_03_levels.json — уровни 041–060.

Каждый уровень хранит:
- id;
- chapter;
- geometry/layers;
- tile slot positions;
- difficulty metadata;
- first-clear reward id;
- milestone flag;
- optional tutorial flag.

Конкретная схема JSON фиксируется на Этапе 7.

---

# 14. ИМЕНА И СТАТУСЫ

Для production manifest используются статусы:
- PLANNED
- DRAWING
- TEST
- REVIEW
- APPROVED
- PAUSED
- REPLACED
- EXPORTED
- IN_ATLAS
- IN_GAME

Версионирование ассетов — Git history. Не использовать `_v7_final_final.png`.

---

# 15. ПОРЯДОК ПРОИЗВОДСТВА

## Уже утверждено
### Batch A — Tile kit
- APPROVED.

### Batch B — Core UI
- APPROVED.

### Batch C — Map common
- APPROVED.

## Новый обязательный gate перед environment art
### Layout Pass
1. Map 16:9 wireframe.
2. Map 9:16 wireframe.
3. Gameplay 16:9 wireframe.
4. Gameplay 9:16 wireframe.
5. Layout approval.

До закрытия этого gate **Batch D/E/F не производятся как финальный арт**.

## После layout approval
### First art vertical slice
- Gameplay 16:9: composition draft → clean background → integration preview → approval.

### Затем screen-by-screen
- остальные approved Map/Gameplay layouts;
- Chapter 1 modular environment;
- Chapter 2 environment;
- Chapter 3 environment;
- ambient source sprites.

### FX
Только отдельным последующим pass:
- selection;
- match;
- hint;
- shuffle;
- Lotus Blessing;
- Lotus Pulse;
- milestone activation;
- petals;
- shimmer;
- mist movement;
- ambient sparkle.

# 16. КРИТЕРИЙ ГОТОВНОСТИ АССЕТА

Ассет считается APPROVED, если:
1. выполняет указанную роль;
2. читается в runtime-размере;
3. соответствует главе/дизайн-системе;
4. не содержит текст, который должен локализоваться;
5. имеет корректный alpha;
6. экспортирован без лишних прозрачных полей;
7. filename совпадает со спецификацией;
8. назначена atlas-группа или статус separate;
9. не дублирует эффект, который должен делаться кодом;
10. проверен на светлом и тёмном фоне, если это UI/icon.



# 17. BATCH A — СТАТУС

**APPROVED по визуальному направлению.**

Утверждены:
- master tile geometry 1:1,3, центральная конструкция;
- 3 chapter bases;
- 24 symbols: 8 classic-inspired + 16 тематических.

Следующий production batch: **Batch B — Core UI**.


# 18. BATCH B — СТАТУС

**APPROVED по визуальному направлению.**

Утверждены:
- HUD монет;
- HUD лепестков;
- панель уровня: слово «Уровень» + крупный номер;
- pause/back/close/settings controls;
- music/sound/language/toggles;
- универсальные popup frames;
- boosters: Hint / Shuffle / Lotus Blessing.

Следующий production batch: **Batch C — Карта Пути**.


# 19. BATCH C — СТАТУС

**APPROVED по визуальному направлению.**

Утверждены:
- map_node_completed.png;
- map_node_current.png;
- map_node_available.png;
- map_node_locked.png;
- map_node_milestone.png;
- map_node_chapter_end.png;
- map_path_dot.png;
- map_path_segment_straight.png;
- map_path_segment_curve_l.png;
- map_path_segment_curve_r.png.

Правила:
- номера уровней — кодом;
- current glow / pulse и прочие сияния — отдельный FX-проход;
- landmark главы не встраивается в chapter-end node;
- один map_common набор используется для landscape 16:9 и portrait 9:16;
- длинная сторона целевого экрана — не более 1920 px.

Следующий шаг: **Layout Pass — 4 wireframe-экрана**. Batch D environment art заморожен до layout approval.


# 20. ENVIRONMENT / BACKGROUND GATE

**Статус:** PAUSED / TEST. Art-first Batch D заменён wireframe-first workflow.

Текущие Chapter 1 backgrounds уже лежат в репозитории, но все четыре являются только reference/test:

**Source masters / REVIEW**
- `assets/source/chapters/ch1/backgrounds/map/landscape/ch1_map_master_16x9.webp`;
- `assets/source/chapters/ch1/backgrounds/map/portrait/ch1_map_master_9x16.webp`;
- `assets/source/chapters/ch1/backgrounds/gameplay/landscape/ch1_level_master_16x9.webp`;
- `assets/source/chapters/ch1/backgrounds/gameplay/portrait/ch1_level_master_9x16.webp`.

**Runtime / REVIEW**
- `assets/runtime/backgrounds/ch1/map/ch1_map_bg_16x9.webp`;
- `assets/runtime/backgrounds/ch1/map/ch1_map_bg_9x16.webp`;
- `assets/runtime/backgrounds/ch1/gameplay/ch1_level_bg_16x9.webp`;
- `assets/runtime/backgrounds/ch1/gameplay/ch1_level_bg_9x16.webp`.

Правила:
- эти файлы не APPROVED и не определяют safe zones;
- старый единый `ch1_bg_master.webp` удалён как REPLACED;
- не создавать новый финальный фон «на глаз»;
- не растягивать/тайлить фон, чтобы расширять gameplay за design frame;
- portrait не получать автоматическим crop из landscape;
- для каждого экрана сначала wireframe/layout approval, затем composition draft;
- background не содержит UI, текста, нод и программной золотой дорожки;
- modular objects и ambient layers добавляются только так, чтобы не ломать approved overlay;
- если approved композиция требует parallax, она раскладывается на слои после утверждения, а не используется как причина менять layout.

Operational layout rules: `docs/LAYOUT_WORKFLOW.md`.


## 2026-10-08 — Section 03 / Sakura Alley review integration
Status: **TEST / на проверку**, not an automatic production approval.
- Two independent landscape/portrait compositions generated with the built-in image tool. Runtime: `assets/runtime/backgrounds/sections/03/map_landscape.webp` (1920×1080) and `map_portrait.webp` (1080×1920). RGB WebP quality 87; approximately 0.6 MB each.
- Shared art for section map and level 21–30 surroundings; HUD, board, nodes, numbers and labels stay separate. No new tile/button assets or animation frames. On-demand load retains duplicate/error guards.
- Landscape prompt: luminous premium oriental fantasy zen sakura garden, two broad ivory stone terraces spanning the image at roughly 40%/64%, right-side stairs, pink blossom trees at sides, gold lanterns, jade koi/lotus pond, distant pagodas/mountains/waterfalls. Quiet top and bottom for separate UI; no text, numbers, UI, nodes, tiles or people.
- Portrait prompt: same style, five distinct broad empty stone terraces for two coded nodes per terrace, zigzag alternating-side stairs, pink blossom frame, distant pagoda, quiet HUD top and koi pond bottom; no text, numbers, UI or nodes. Generated artwork inspected before integration.
- Code coordinates follow visible terrace centers: landscape y=.372/.60; portrait y=.193/.293/.41/.547/.71. Portrait is independently composed, not cropped from landscape. On the upper portrait terrace the current tag sits below the node to avoid the section header.
- Output normalization only resizes to the design frame and converts to WebP; it does not replace approved previous locations. Final art/physical mobile approval remains pending.
