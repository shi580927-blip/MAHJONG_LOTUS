# Interactive screen review · 2026-10-05

Status: **TEST / на проверку**. This is a concrete review build under DEC-039,
not approval of layouts, production backgrounds, economy, or Stage 5.

## Review routes

- `?screen=menu` — menu, then map → playable board → victory → map.
- `?screen=map` — scrollable Path, 60 node positions / 3 chapter labels.
- `?screen=game` — playable 24-tile layout, 12 temporary text symbols.
- `&frame=portrait` / `&frame=landscape` — force the logical review frame.
  Without this flag orientation follows viewport. FIT / contain is preserved.
- `&debug=1` — approved-workflow safe-zone overlay (coordinates remain TEST).
- `&art=1` — existing Chapter 1 art as reference only, fixed screen background.
- `?legacy=1` — previous MapScene/GameScene implementation for comparison.

## Working interactions

- Menu, scrollable map, board, victory and modal settings.
- Portrait Path progresses bottom → top; landscape left → right.
- Node activation on release with drag threshold; HUD stays fixed; path is masked.
- Matching only uncovered tiles with a free left or right side.
- Hint marks a pair; shuffle preserves tile count and creates a complete solution;
  Blessing removes exactly one available pair per explicit click.
- No-moves dialog: shuffle / restart / map. No automatic currency deductions.
- Review-only progress and preferences in `lotus.screen-review.v1` localStorage.
- Sound toggle controls synthesized click sounds; animation toggle controls Lotus Pulse.
- Rotation preserves board and progress. Map position is clamped to review bounds.

## Deliberate limits

- All 60 nodes reuse ONE test layout; this is NOT 60 authored production levels.
- Currency HUD is a layout placeholder at zero. No economy or rewards invented.
- Boosters are free within this isolated review; no ads/SDK/purchases attached.
- No production music, RU/EN/TR localization or cloud progress yet.
- Only map_common has a real exported atlas in this repository. Tile/Core UI exports
  from approved Batch A/B are absent. Programmatic UI and 12 temporary text symbols
  test readability, and do not replace the approved 24-symbol artwork.
- Chapter 1 backgrounds remain TEST / REVIEW. No new production art generated.
- Milestone label/pulse tests placement; final world transformation not implemented.
- Landscape tile targets should be reviewed on small landscape phones before approval.

## Verification

`node tests/reviewBoard.test.mjs` (modern Node):
200 complete solvable deals, 200 partial-board shuffles, stacked geometry trap recovery,
and covered-tile rejection. JS syntax checks pass.

Visual browser verification is PENDING. Local Chromium installation failed (incomplete download); agent-browser CLI is unavailable. The build is saved on a review branch because automatic approval review rejected the direct main push. No Pages deployment is claimed.

## Publication follow-up
2026-10-05: user authorized main merge; PR #1 merged. Pages run 37336155399 succeeded. Cloud browser confirmed matching, hint, shuffle, one-pair Blessing, settings, return to map, and forced portrait/landscape layouts. Fixed the Canvas background fill and footer contrast found in that pass. Physical mobile/resize and full release gates remain pending.

## Visual Path editor

2026-10-05: added a TEST visual editor for manual Path-node placement. Routes: `?screen=map&edit=1&art=1&frame=landscape` and `&frame=portrait`. Node coordinates are stored separately per design frame in localStorage and can be downloaded as `lotus-path-layout.json`. The tool does not auto-promote edited coordinates to production data.


## 2026-10-08 — Sakura Alley, revision 20261008-14
- 30 authored TEST layouts; levels 31–60 retain temporary geometry. Section 3 uses separate sakura art in both orientations.
- Play level 21: `?previewLevel=21&v=20261008-14`; portrait: add `&frame=portrait`.
- View map without unlocks: `?screen=map&section=3&v=20261008-14`; portrait: add `&frame=portrait`.
- Preview now extends through level 30 and never records completion. Preview 20→21 enters Sakura Alley; preview 30 returns to normal map/progress.
- All 10 Node test files pass: 1,000 Sakura legal solutions retaining geometry, both-frame bounds, raised-tile support, transitions, on-demand backgrounds and previous input/pair regressions. Art and difficulty still require player review.
