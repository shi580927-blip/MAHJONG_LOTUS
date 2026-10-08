# PROJECT_STATE.md

> Главный операционный источник состояния проекта **«Маджонг: Путь Лотоса»**.
> Работа ведётся строго циклично по регламенту проекта. Утверждённые решения не меняются задним числом.

## 1. ТЕКУЩИЙ ЭТАП

- Номер: **5**
- Название: **Формирование MVP**
- Статус: **ГОТОВО К ПРОВЕРКЕ**
- Следующий этап после завершения и утверждения текущего: **6. UX и структура продукта — НЕ ЗАПУЩЕН**

## 2. ИСТОЧНИКИ ИНФОРМАЦИИ

- Репозиторий: https://github.com/shi580927-blip/MAHJONG_LOTUS
- Google Drive: https://drive.google.com/drive/folders/1_BCUTl5UASx29BOD_mlI5RbJFLVj57UE
- MASTER Google Doc: https://docs.google.com/document/d/1biMJfx0NtamcUtitU8BHZI62Dhn3O6swO8wZ-8LpV6E
- Регламент: загруженный пользователем документ «цикл промт для создания приложения.docx»

При расхождении:
1. последнее явно утверждённое пользователем решение;
2. затем этот `PROJECT_STATE.md`;
3. затем MASTER;
4. затем обсуждения и рабочие концепты.

## 3. ПРОДУКТОВАЯ КАРТОЧКА

- Название: **Маджонг: Путь Лотоса**
- Тип: браузерная casual-игра
- Жанр: Mahjong Solitaire / relaxing puzzle + метапрогрессия
- Первая платформа: **Яндекс Игры**
- Движок: **Phaser 3**
- Визуальная модель: **2D/2.5D**
- Основная ориентация: landscape 16:9
- Обязательная адаптация: вертикальные мобильные экраны
- Основная эмоция: спокойствие, эстетическое удовольствие, открытие, мягкий прогресс
- Core Loop: **Карта → уровень → пары → победа → награда → продвижение по Пути → следующий уровень**

## 4. РЕШЕНИЯ

### DEC-001 — Название
**Статус:** APPROVED  
Название проекта: **«Маджонг: Путь Лотоса»**.

### DEC-002 — Стартовая платформа
**Статус:** APPROVED  
Первая публикация: **Яндекс Игры**.

### DEC-003 — Движок
**Статус:** APPROVED  
Использовать **Phaser 3**.

### DEC-004 — Карта уровней
**Статус:** APPROVED  
Карта уровней обязательна. Это **прокручиваемый Путь**, а не единый экран со всеми 60 уровнями. На экране виден только ближайший участок.

### DEC-005 — Контент первой версии
**Статус:** APPROVED  
60 уровней, визуально разделённых на 3 главы по 20:
1. Сад Безмятежности — 1–20.
2. Сад Цветущей Сакуры — 21–40.
3. Храм Лотоса — 41–60.

### DEC-006 — Жизни
**Статус:** APPROVED  
В первой версии **нет системы жизней** и ожидания восстановления.

### DEC-007 — Бустеры
**Статус:** APPROVED  
Базовые бустеры:
- Подсказка;
- Перемешать;
- Благословение Лотоса — автоматически убрать доступную пару с тематическим эффектом.

### DEC-008 — Валюты
**Статус:** APPROVED  
Две валюты: **монеты** и **лепестки**.  
Не использовать «лотосы» как название валюты.

### DEC-009 — Рекламные ограничения
**Статус:** APPROVED  
Реклама должна быть ограниченной и не создавать бесконечного фарма.
- Rewarded — добровольно, за заранее понятную награду.
- Нельзя бесконечно удваивать одну награду.
- Нельзя строить цепочки бесконечного фарма монет, лепестков и бустеров.
- Interstitial — только в естественных паузах, не во время игрового хода.
- Конкретные caps/cooldown утверждаются позднее.

### DEC-010 — Визуальная планка
**Статус:** APPROVED  
Премиальный восточный fantasy/zen: лотосы, сакура, золото, нефритово-зелёный UI, храмы, мосты, горы, водопады, кои, вода, фонари, солнечный свет.

### DEC-011 — Лёгкая анимация окружения
**Статус:** APPROVED  
Живой фон строится слоями и кодом: вода, рыбки, лепестки, блики, дымка, лёгкое движение растительности. Не использовать тяжёлое фоновое видео как основную технологию.

### DEC-012 — Плитки
**Статус:** APPROVED  
Плитка собирается из базовой основы + отдельного символа. Подсветка, тени, glow и часть эффектов — кодом.

### DEC-013 — Уровни как данные
**Статус:** APPROVED  
Раскладки не являются изображениями. Хранить геометрию уровней как данные (предпочтительно JSON), отдельно от набора символов.

### DEC-014 — Экраны MVP
**Статус:** APPROVED  
Обязательные экраны:
- Главное меню;
- Карта Пути;
- Игровой экран;
- Победа;
- Настройки.

### DEC-015 — Художественные концепты ≠ автоматический scope
**Статус:** APPROVED  
«Испытания», «Коллекция», «Магазин» и иные элементы, появившиеся в отрисованных концептах, **не считаются автоматически утверждёнными функциями MVP**.


### DEC-016 — Названия локализаций
**Статус:** APPROVED  
Официальные названия:
- RU: **«Маджонг: Путь Лотоса»**
- EN: **Mahjong: Lotus Path**
- TR: **Mahjong: Lotus Yolu**

Перед публикацией уникальность каждого названия повторно проверяется в каталоге Яндекс Игр. Название в игре, черновике и промоматериалах должно совпадать для каждой локали.

### DEC-017 — Яндекс Игры: обязательный compliance gate
**Статус:** APPROVED  
В проект подключён постоянный чеклист `docs/YANDEX_GAMES_CHECKLIST.md`. Он обязателен на Этапах 7, 10, 13 и 15, а также перед каждой последующей загрузкой ZIP/релиза. Требования платформы перепроверяются по актуальной документации перед тестированием и модерацией.

### DEC-018 — Локализационный набор для первой версии
**Статус:** APPROVED  
Проект готовится минимум на трёх языках: **RU + EN + TR**. Автоопределение языка через SDK Яндекс Игр обязательно. Для неподдерживаемых языков: русский fallback для be/kk/uk/uz, английский для остальных.


### DEC-019 — Издатель / игровая студия
**Статус:** PENDING / PARTIALLY APPROVED  
Утверждено: **«Маджонг: Путь Лотоса» будет выпущен другой игровой студией.**  
Точная студия/издатель пока определяется и будет зафиксирована отдельным решением. До утверждения издателя не использовать в релизных материалах брендинг текущих/других студий по умолчанию.

### DEC-020 — Роль монет
**Статус:** APPROVED  
Монеты — основная soft currency для бустеров и контекстных расходов. Решение конкретизирует ASM-002.

### DEC-021 — Роль лепестков
**Статус:** APPROVED  
Лепестки — редкий meta/progression ресурс, связанный с пробуждением Пути и визуальными landmark-моментами. Лепестки не являются обычной валютой подсказок и не должны блокировать основной прогресс. Решение конкретизирует ASM-002.

### DEC-022 — Главная метаигра первой версии
**Статус:** APPROVED  
Путь — единственная крупная метаигра первой версии. City-builder, отдельное строительство и коллекционные системы в первую версию не добавляются.

### DEC-023 — Визуальные участки
**Статус:** APPROVED  
Каждая глава делится на 4 визуальных участка по 5 уровней. После каждого пятого уровня происходит заметный landmark-момент/трансформация мира.

### DEC-024 — No-moves вместо punitive defeat
**Статус:** APPROVED  
При отсутствии ходов игрок получает варианты Перемешать / Начать заново / На карту. Жизнь не теряется, автоматическое списание валюты запрещено.

### DEC-025 — Anti-farm first-clear reward
**Статус:** APPROVED  
Основная награда первого прохождения уровня не начисляется бесконечно при replay.

### DEC-026 — Фирменный payoff
**Статус:** APPROVED  
Ключевая победная награда — Lotus Pulse + визуальное изменение карты/мира на значимых узлах.

### DEC-027 — Набор символов плиток
**Статус:** APPROVED  
В базовом наборе 24 уникальных символа. Часть сохраняет классическое Mahjong-ощущение, часть относится к визуальному миру «Пути Лотоса».

### DEC-028 — Геометрия и chapter skins плитки
**Статус:** APPROVED  
Геометрическая форма плитки едина для всей игры. Основа/материал плитки имеет три chapter-варианта: Сад Безмятежности, Сад Цветущей Сакуры, Храм Лотоса.

### DEC-029 — Модульная карта и окружение
**Статус:** APPROVED  
Карта и окружение строятся как базовая сцена + включаемые модульные слои/объекты. Не создавать отдельные полноэкранные изображения для каждого из 60 уровней.

### DEC-030 — Asset/FX production order
**Статус:** APPROVED  
Сначала отрисовывается и утверждается полный статический/модульный asset pack. Затем отдельным производственным проходом создаётся FX-пакет.

### DEC-031 — Форматы и atlases
**Статус:** APPROVED  
Прозрачные игровые ассеты экспортируются в PNG; большие непрозрачные фоны — преимущественно WebP; малые спрайты группируются в texture atlas. Chapter-specific atlases должны грузиться по требованию, а не все одновременно.

### DEC-032 — UI visual system
**Статус:** APPROVED  
UI: premium jade + gold + light ivory, без декоративного перегруза; читаемость и размеры touch-target важнее орнамента.

### DEC-033 — Финальная геометрия master tile
**Статус:** APPROVED  
Базовая плитка утверждена как универсальный центральный master-ассет: вертикальный прямоугольник приблизительно 1:1,3, светлая ivory-лицевая часть по центру, нефритовый корпус виден равномерно по периметру, между лицом и корпусом тонкая золотистая разделительная линия. Форма не имеет жёсткого направления объёма и допускает программные flip/rotation без визуального конфликта.

### DEC-034 — Chapter bases плитки
**Статус:** APPROVED  
Утверждены три chapter-варианта той же геометрии: Сад Безмятежности, Сад Цветущей Сакуры, Храм Лотоса. Отличаются материалом/цветом корпуса, но не силуэтом и не safe-area.

### DEC-035 — 24 символа плиток
**Статус:** APPROVED  
Утвержден визуальный набор из 24 символов: 8 classic-inspired + 16 тематических. Символы должны использовать утверждённую master-геометрию плитки и сохранять высокую читаемость при уменьшении.

### DEC-036 — Core UI Batch B
**Статус:** APPROVED  
Утверждён визуальный набор Core UI: HUD монет, HUD лепестков, панель уровня только с крупным числом без слова «Уровень», служебные кнопки, настройки, универсальные popup frames и три бустера — Подсказка, Перемешать, Благословение Лотоса.


### DEC-037 — HUD уровня: подпись + число
**Статус:** APPROVED  
Панель уровня должна показывать слово **«Уровень»** и крупный номер уровня. Это решение заменяет прежнюю часть DEC-036, где был зафиксирован только номер без подписи. Причина: в утверждённых концептах вариант «Уровень 28» считывается заметно понятнее, особенно на мобильном экране.

### DEC-038 — Batch C: карта Пути / map_common
**Статус:** APPROVED  
Утверждено визуальное направление Batch C:
- completed node — светлый лотос на нефритовом основании + зелёная галка + отдельная нижняя плашка под номер;
- current node — раскрытый розовый лотос, нефрит + золото, более выразительный размер; активное свечение относится к FX;
- available node — светлый лотос без галки;
- locked node — приглушённый серо-каменный лотос + золотой замок;
- milestone node — более крупный и богатый лотос для уровней 5/10/15/20;
- chapter-end node — усиленный milestone-узел, при этом крупный landmark/ворота остаются частью карты, а не самой ноды;
- номер уровня выводится кодом и не вшивается в PNG;
- дорожка собирается из отдельных золотых модульных сегментов: dot, straight, curve L, curve R;
- Y-разветвление не требуется для линейного Пути;
- один набор map_common используется и в 16:9, и в 9:16;
- FX не входят в Batch C и выполняются отдельным последующим проходом.

### DEC-039 — Fixed design frame + wireframe-first workflow
**Статус:** APPROVED / REAFFIRMED 2026-10-01  
Art-first подход прекращён. Игровая композиция существует только внутри двух фиксированных design frame:
- landscape — **1920×1080**;
- portrait — **1080×1920**.

На реальном viewport используется **FIT / contain** с центрированием. Ultra-wide и нестандартные экраны не расширяют gameplay-композицию: дополнительное пространство — только внешнее matte/decor.

Обязательный производственный порядок:
1. technical frame;
2. safe zones;
3. wireframe;
4. layout approval;
5. background…32719 tokens truncated…ар, Благословение (11 → 10), настройки и возврат на карту.
- Просмотрены landscape и forced portrait gameplay/map. Это не заменяет физический mobile/cross-device gate.
- Исправлены обнаруженные проблемы: фон схемы теперь использует совместимую плоскую ivory-заливку вместо Canvas-несовместимого gradient; подпись под бустерами получила светлую подложку.
- Cache version 20261005-2. Статус оформления по-прежнему TEST, финальные Batch A/B и production backgrounds не утверждались.


## OPERATIONAL UPDATE 2026-10-05 — VISUAL PATH EDITOR

**Статус:** TEST / на проверку.  
Добавлен внутренний визуальный редактор ручной расстановки 60 нод Пути поверх review-карты, отдельно для landscape 1920×1080 и portrait 1080×1920. Расстановка хранится локально в браузере и экспортируется в JSON; сама по себе не считается APPROVED и не заменяет production map data. Инструкция: `docs/PATH_VISUAL_EDITOR.md`. Production-решения DEC-038 и DEC-039 не меняются.


## OPERATIONAL UPDATE 2026-10-07 — SECTION MAP / MOBILE INPUT
- По явному решению пользователя непрерывная прокрутка игрового Пути заменена шестью участками по 10 уровней. 60 уровней и три главы сохранены.
- Каждый участок целиком помещается в отдельный portrait/landscape frame. Переключение стрелками; будущие участки доступны для просмотра, игры остаются закрыты до прохождения.
- Шесть разных программных окружений: пруд, бамбук, сакура, мост, храмовый двор, святилище. Названия и окружения TEST, не утверждённый production арт.
- Старый редактор 60 нод сохранён отдельно через edit=1 как legacy TEST инструмент; его экспорт не управляет новой секционной картой.
- Отключены native selection, tap highlight, callout, context menu и drag canvas для игрового поля. Проверка физического мобильного устройства остаётся отдельным gate.
- Cache version 20261007-1.


## OPERATIONAL UPDATE 2026-10-08 — FIRST LOCATION ART INTEGRATION
- Пользователь выбрал визуальное направление новых макетов; исправления нумерации выполняются кодом.
- Первый участок: отдельные map-фоны 1920×1080 и 1080×1920, без встроенных цифр/UI. Ноды сопоставлены с площадками, последовательность 1–10 задаётся кодом.
- Подключены новые REVIEW атласы: 12 нарисованных плиток и 6 UI-иконок с alpha. Это новый набор для проверки сборки, не восстановленные исходные Batch A/B и не полный комплект 24 символов.
- Подсказка, выбор, blocked tint, перемешивание, Благословение используют прежнюю рабочую логику.
- Другие пять участков сохраняют отличимые TEST окружения; финальный художественный набор для них ещё не готов.
- По умолчанию первый участок и gameplay показывают арт. debug=1 или art=0 оставляют схему.
- Подготовка атласов: scripts/prepare_first_location_art.py; cache 20261008-1.

- Pages: новая сборка опубликована успешно; в браузере проверены карта обоих форматов и подсветка пары. После визуального QA уменьшена ширина desktop-плитки 124→116, чтобы отделить верхнюю инструкцию и нижний счётчик от поля; cache 20261008-2.


### 2026-10-08 — Ghost input fix
- Воспроизведён перезапуск раскладки при клике по бывшей ноде карты внутри игрового поля.
- Причина: DisplayList.removeAll(true) убирал объекты из отображения, оставляя их интерактивными. draw теперь уничтожает старые объекты и их вложенные зоны нажатия.
- Регрессия: удаление старого интерактивного узла, сохранение removed/symbol при redraw и отсутствие накопления зон.
- Cache 20261008-3.

## 2026-10-08 — First location playable layouts
- Levels 1–10 now have ten distinct review layouts: 12–40 tiles, one to three layers, named forms from First Steps to Opening Lotus. Levels 11–60 retain the existing test layout; this is not the approved final 60-level content pack.
- Board size and centering derive from the complete starting geometry in both orientations. Removing pairs never shifts the remaining tiles. Existing destruction of old interactive objects remains intact.
- Optional `previewLevel=1..10` opens a playable preview without unlocking levels or recording completion. Leaving preview restores normal progress; preview level 10 returns to the map.
- Cache version: 20261008-4. Validation: ten distinct shapes, 1,000 complete legal removal sequences without initial shape repacking, bounds in portrait/landscape, stable placement after removal, existing full/partial shuffle and stale-input regression checks.

## 2026-10-08 — Bamboo Grove, levels 11–20
- The second location now has ten distinct authored review layouts (30–60 tiles, up to four layers), including Bamboo Stems, Forest Trail, Jade Gate, Terraces and Gates of Serenity. These remain review content; levels 21–60 still use the test layout.
- New Bamboo Grove artwork in landscape and portrait, generated with the built-in image tool. Map paths and coded level nodes remain separate. Second-location gameplay uses the bamboo environment too.
- Preview now covers authored levels 1–20 and never saves completion/unlocks. Optional screen=map&section=2 views the second location while respecting progression locks. Normal victory 10→11 enters the bamboo board/environment.
- Cache version: 20261008-5. Tests cover 2,000 complete legal deals across 20 distinct shapes without initial repacking, stable board fit in both orientations, ghost-input regression, and preview/normal progression.
- Art prompts: landscape — luminous premium oriental fantasy zen bamboo grove, ivory two-tier paths, gold lanterns, turquoise stream, no UI/text; portrait — same style, five zigzag terraces with blank space for separate icons, quiet top/bottom. Portrait refinement explicitly adds the fifth terrace. Runtime outputs: assets/runtime/backgrounds/sections/02/map_landscape.webp (1920×1080), map_portrait.webp (1080×1920).

## 2026-10-08 — Remove mirror-pattern deals and add staggered boards
- User questioned primitive/equal layouts. Root cause: the first legal removal sequence paired the first two top-sorted free tiles, creating opposite-edge and adjacent matching patterns before faces were assigned.
- Deal now randomizes legal pair selection across rows/layers, with a final top-first recovery attempt. Face counts stay even but can differ, all 12 faces appear on larger boards, and repetitions are capped. Up to 12 face-assignment candidates reduce excessive opening matches while retaining the same complete legal solution. This opening heuristic is not a validated difficulty curve.
- Bamboo levels 13, 17, 18, 19, 20 now have asymmetric footprints and half-cell layer offsets. Level 20 uses 44 tiles across four staggered layers instead of a regular 60-tile rectangle. No extra artwork was generated.
- Current bamboo tile counts: 32, 36, 28, 38, 38, 36, 34, 38, 44, 44. Existing layouts/first location/environment assets and progress remain intact.
- Validation: 2,000 complete legal deals retain starting geometry, both-orientation bounds, regression coverage for old input regions, 200 non-mirror randomized pairings, bounded even/unequal face counts, upper-layer support and half-cell covering, and partial-board reshuffles retaining removed tiles. Seeded sample level 20: average 4.025 initial matching pairs across 200 deals; this is not a human playtest.
- Cache version 20261008-6.

## 2026-10-08 — Illustrated button skins
- User requested further work and drawing the buttons. New three-frame alpha atlas: primary emerald jade, secondary ivory, inactive grey-green; gold rims and lotus end ornaments, no baked-in text/icons.
- Runtime paths: assets/runtime/atlases/review_buttons/review_buttons.webp and review_buttons.json. Preparation: scripts/prepare_button_art.py SOURCE_PNG, packs three top-to-bottom alpha components into 560×100 frames with padding.
- Generation: built-in image tool, transparent-background request. Prompt: exactly three stacked isolated blank horizontal rounded rectangle skins; premium oriental fantasy zen; jade/gold primary, ivory/gold secondary, matte grey-green inactive; delicate lotus/leaf endcaps, large empty center, straight frontal view, no text/numbers/icons/background.
- Buttons use nine-slice on WebGL, preserving corners while fitting menu, map, boosters and modal action sizes. Canvas and schematic view retain the programmatic fallback. Existing round navigation/settings/booster icons remain separate assets; labels remain native text and shrink only if too wide.
- Added hover tint, press tint and a small label shift that restores on release/out; original modal input guard retained. Locked-location CTA now uses inactive skin and has no interactive hit zone.
- Cache 20261008-7. Tests cover label restoration, modal shielding and disabled action rejection; all existing board/progress/input regressions still pass.
