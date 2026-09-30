# LAYOUT WORKFLOW — Mahjong: Lotus Path

**Status:** APPROVED  
**Date:** 2026-09-30

## 1. Why the workflow changed

The first art-first prototype showed two structural failures:
- responsive viewport dimensions were used as the game world, so ultra-wide screens expanded the composition;
- dense backgrounds competed with map nodes and HUD, making hierarchy unreadable.

Therefore layout is no longer derived from a finished illustration.

## 2. Fixed design frames

Only two logical frames are allowed:

- landscape: **1920×1080**
- portrait: **1080×1920**

Runtime uses **FIT / contain**. The logical composition never expands beyond these frames. Extra physical screen space is matte/decorative space outside the game frame.

Portrait is its own layout, not a crop of landscape.

## 3. Mandatory production order

1. Technical frame.
2. Wireframe.
3. Layout approval.
4. Background composition draft.
5. Clean background.
6. Integration preview with overlay.
7. Cross-device verification.
8. Next screen only after approval.

No new final background or decorative asset batch is produced before the wireframe for that screen is approved.

## 4. Wireframes currently under review

### Map 16:9 — TEST
- HUD: y 0–150
- bottom nav: y 930–1080
- path corridor: x 120–1800, y 180–900
- direction: left → right

### Map 9:16 — TEST
- HUD: y 0–220
- bottom nav: y 1680–1920
- path corridor: x 90–990, y 250–1640
- direction: bottom → top

### Gameplay 16:9 — TEST
- HUD: y 0–160
- board safe: x 300–1620, y 170–850
- boosters: y 880–1080

### Gameplay 9:16 — TEST
- HUD: y 0–220
- board safe: x 80–1000, y 260–1500
- boosters: y 1580–1920

These coordinates are **TEST / review**, not APPROVED until visually checked.

## 5. Background rule

Current Chapter 1 backgrounds remain **REVIEW / TEST**. They are references only.

A production background is created only after the corresponding wireframe is approved. It must respect the overlay:
- map: readable route corridor and low competition behind nodes;
- gameplay: calm central board area and stronger detail near edges;
- no UI, node art, text or interactive-looking graphics baked into the background.

## 6. Review routes

- default / map wireframe: `?screen=map`
- gameplay wireframe: `?screen=game`
- force landscape: `&frame=landscape`
- force portrait: `&frame=portrait`
- old art prototype only for comparison: `?legacy=map` or `?legacy=game`
