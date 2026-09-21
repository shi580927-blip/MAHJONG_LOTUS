# ASSET PRODUCTION SPEC — Маджонг: Путь Лотоса

**Статус:** WORKING PRODUCTION SPEC / BATCH A APPROVED  
**Назначение:** единый реестр графических ассетов для художника и разработки.  
**Порядок:** сначала статические/модульные ассеты → затем отдельный FX-пакет.  
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
| MAP-COM-06 | map_path_dot.png | Малый элемент дорожки | map_common |
| MAP-COM-07 | map_path_segment_straight.png | Прямой сегмент | map_common |
| MAP-COM-08 | map_path_segment_curve_l.png | Изгиб L | map_common |
| MAP-COM-09 | map_path_segment_curve_r.png | Изгиб R | map_common |

Номер уровня — кодом.

---

# 8. CHAPTER 1 — САД БЕЗМЯТЕЖНОСТИ

## 8.1. Background

| ID | Файл | Тип | Runtime | Хранение |
|---|---|---|---|---|
| CH1-BG-01 | ch1_bg_far.webp | Дальний фон | 1920×1080 target | separate |
| CH1-BG-02 | ch1_bg_water.webp | Вода/средний план | 1920×1080 target | separate |
| CH1-BG-03 | ch1_fg_soft.png | Передний план | 1920×1080 target | separate |

Portrait не рисуется как полностью отдельный мир. На Этапе 6 определяется кадрирование; если композиция не выдерживает portrait, допускается отдельный crop/export из того же master.

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
- REVIEW
- APPROVED
- EXPORTED
- IN_ATLAS
- IN_GAME

Версионирование ассетов — Git history. Не использовать `_v7_final_final.png`.

---

# 15. ПОРЯДОК ОТРИСОВКИ

## Batch A — Tile kit
1. 3 tile bases.
2. 24 symbols.
3. shadow / selection / hint / blocked helpers.

## Batch B — Core UI
4. currency/HUD.
5. buttons.
6. settings icons.
7. popup frames.
8. 3 boosters.

## Batch C — Map common
9. level nodes.
10. path segments.
11. common map controls.

## Batch D — Chapter 1
12. background layers.
13. modular objects.
14. milestone reveal set.

## Batch E — Chapter 2
15. background layers.
16. modular objects.
17. milestone reveal set.

## Batch F — Chapter 3
18. background layers.
19. modular objects.
20. milestone reveal set.

## Batch G — Ambient source sprites
21. petals/leaves/glints/mist source images.

## Batch H — FX
Только после утверждения всех предыдущих batch:
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

---

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
