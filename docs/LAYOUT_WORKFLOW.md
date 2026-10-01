# LAYOUT WORKFLOW — Маджонг: Путь Лотоса

**Статус:** APPROVED  
**Утверждено:** 2026-09-30  
**Повторно подтверждено:** 2026-10-01  
**Заменяет:** art-first / responsive-world подход.

## 1. Главный принцип

Мы больше не строим экран от красивого полноэкранного арта.

Обязательная последовательность:

**technical frame → safe zones → wireframe → layout approval → composition draft → clean background → integration preview → cross-device check → следующий экран**

Фон подчиняется компоновке. Компоновка не подгоняется под готовый фон.

## 2. Два фиксированных design frame

В проекте существуют только два логических игровых кадра:

- **Landscape:** 1920×1080
- **Portrait:** 1080×1920

Runtime:
- Phaser использует **FIT / contain**;
- кадр центрируется;
- gameplay-композиция не растягивается за логические границы;
- ultra-wide и нестандартные экраны получают внешнее matte/decor-пространство;
- extra space не становится дополнительной игровой зоной.

Portrait — отдельный layout, а не автоматический crop landscape.

## 3. Четыре обязательных wireframe

До нового production art должны быть готовы и визуально проверены все четыре схемы.

### Map 16:9 — TEST
- frame: 1920×1080;
- top HUD zone: y 0–150;
- bottom menu zone: y 930–1080;
- central path corridor: x 120–1800, y 180–900;
- decor tolerance: вне центрального path corridor;
- направление пути: слева направо.

### Map 9:16 — TEST
- frame: 1080×1920;
- top HUD zone: y 0–220;
- bottom menu zone: y 1680–1920;
- vertical path corridor: x 90–990, y 250–1640;
- направление пути: снизу вверх.

### Gameplay 16:9 — TEST
- frame: 1920×1080;
- top HUD zone: y 0–160;
- board safe zone: x 300–1620, y 170–850;
- boosters/bottom UI: y 880–1080.

### Gameplay 9:16 — TEST
- frame: 1080×1920;
- top HUD zone: y 0–220;
- board safe zone: x 80–1000, y 260–1500;
- boosters/bottom UI: y 1580–1920.

Координаты выше — **TEST / review**, а не APPROVED. Их задача — сначала проверить плотность, читаемость и поля.

## 4. Что утверждается на layout approval

Для каждого из четырёх экранов отдельно:
- safe frame;
- HUD bounds;
- board/path corridor;
- bottom UI / boosters / navigation bounds;
- минимальные edge margins;
- размер и touch-area интерактивных элементов;
- количество нод, видимых в одном кадре карты;
- допустимый масштаб плиток;
- поведение при desktop, mobile и ultra-wide viewport.

Пока layout не утверждён, финальный фон для этого экрана не производится.

## 5. Background pipeline

### A. Composition draft
Упрощённая композиция:
- вода;
- мосты;
- лестницы;
- архитектура;
- крупные массы растительности;
- спокойные/насыщенные зоны.

Без детального декора.

### B. Clean background
Чистый фон:
- без UI;
- без текста;
- без нод;
- без программной золотой дорожки;
- без объектов, выглядящих как интерактивные кнопки;
- с сохранённой чистой зоной под board/path.

### C. Integration preview
Тот же фон проверяется вместе с:
- layout overlay;
- HUD bounds;
- board/path safe zone;
- реальными нодами или плитками;
- bottom UI / boosters;
- desktop/wide/portrait viewport.

Только прошедший overlay-check фон может перейти в APPROVED production.

## 6. Производственный порядок с 2026-10-01

### Сначала
1. Map 16:9 wireframe.
2. Map 9:16 wireframe.
3. Gameplay 16:9 wireframe.
4. Gameplay 9:16 wireframe.
5. Визуальное утверждение четырёх схем.

### Потом
Первый новый art vertical slice — **Gameplay 16:9**:
1. composition draft;
2. clean background;
3. integration preview;
4. читаемость Mahjong board;
5. cross-device check в fixed landscape frame.

После его утверждения остальные экраны проходят тот же цикл. Нельзя запускать пачку из четырёх финальных фонов одновременно.

## 7. Статус старых фонов

Существующие Chapter 1 backgrounds:
- сохраняются в репозитории;
- имеют статус **TEST / REVIEW**;
- могут использоваться только как визуальный reference/comparison;
- не определяют safe zones и геометрию;
- не считаются APPROVED production backgrounds;
- не являются основанием для crop/растяжения layout.

Art-first Batch D как производственный процесс — **REPLACED** новым workflow.

## 8. Что сохраняется из уже утверждённого

Новый workflow не отменяет:
- Batch A — tile kit;
- Batch B — Core UI;
- Batch C — map_common;
- 24 символа;
- 3 chapter tile bases;
- jade/gold/ivory visual system;
- approved node states;
- программные номера уровней;
- modular path;
- modular world / milestone transforms.

Меняется только порядок интеграции и производство screen-dependent art.

## 9. Текущее состояние Phaser

Уже реализовано:
- logical design size 1920×1080 / 1080×1920;
- Phaser.Scale.FIT;
- центрирование;
- переключение design size при смене ориентации;
- wireframe mode по умолчанию;
- отдельные MapScene и GameScene;
- старый art-review включается отдельно через query-параметр.

Review routes:
- Map wireframe: `?screen=map` или обычный URL;
- Gameplay wireframe: `?screen=game`;
- art reference: добавить `&art=1`.

Ориентация сейчас определяется реальным viewport.

## 10. Definition of Done для экрана

Экран можно считать готовым к следующему этапу только если:
- layout утверждён;
- ничего не выходит за safe bounds;
- readable hierarchy сохраняется на целевом frame;
- ultra-wide не расширяет gameplay;
- portrait не является кропом landscape;
- background прошёл overlay-check;
- реальные UI/tiles/nodes читаются поверх фона;
- нет зависимости от случайного viewport-размера;
- экран проверен в обоих типах устройства, для которых он предназначен.
