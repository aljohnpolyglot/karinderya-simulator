# Karinderya Simulator — Vision Document

## Concept

A cozy Filipino neighborhood restaurant management game.
You run a small karinderya from a single kaldero to a thriving suki-filled community staple.

> "Simpleng ulam, malaking kita."

---

## Vibe / Reference Games

| Game | What we borrow |
|------|---------------|
| The Sims (2000) | Fixed isometric dollhouse view, furniture placement feel |
| Stardew Valley | Community rhythm, NPC memory, slow-paced progression |
| Overcooked | Service rush mechanics, queue pressure |
| Kairosoft (Game Dev Story) | Compact mobile management loop |

---

## Core Gameplay Loop

```
Morning Prep
  → Buy ingredients (palengke)
  → Plan menu (ulam ng araw)
  → Cook / set up

Service Hour (Tanghaling Tapat)
  → Customers queue
  → Serve correct orders
  → Manage speed vs. quality
  → Handle rush events

Evening Close
  → Count kita
  → Pay staff
  → Check suki happiness
  → Plan tomorrow

Progression
  → Upgrade furniture / kitchen
  → Hire staff (taga-linis, kusinero)
  → Unlock new recipes
  → Expand to second table row
```

---

## Camera / View

- **Default:** Fixed isometric (45° angle, no free rotation)
- **Player control:** 90° rotate buttons only (`⟲ Left` / `Right ⟳`)
- **Zoom:** In / Out buttons (no pinch-to-zoom in Phase 1)
- **Why:** Keeps readability, art direction clean, mobile-friendly

```
Phase 1 → fixed isometric only
Phase 2 → add 90° rotate buttons
Phase 3 → add zoom in/out
Never   → free orbit camera as main gameplay
```

---

## Tech Stack

```
Frontend / Game UI
  React 18 + TypeScript (TSX)
  Zustand — game state (queues, kita, reputation, suki data)
  Tailwind CSS or CSS Modules — HUD, menus, panels

3D Visualization Layer
  Three.js
  @react-three/fiber (R3F)
  @react-three/drei (helpers: OrbitControls locked, useGLTF, etc.)

Assets (phased)
  Phase 1 → Three.js primitives (BoxGeometry, CylinderGeometry)
  Phase 2 → GLB assets from Meshy / Blender / Quaternius / Kenney
  Phase 3 → Custom low-poly Filipino props

AI Integration (later)
  Google AI Studio — layout generation, customer dialogue, event scripting
```

---

## Architecture Rule

> The 3D scene is a **visualization layer only.**
> Game logic lives in React + Zustand.

```
Zustand store
  ├── customers[]      — queue, patience, order, suki status
  ├── menu[]           — available ulam, stock count, price
  ├── staff[]          — hired workers, fatigue, skills
  ├── kita             — daily earnings, expenses
  ├── reputation       — neighborhood score
  └── day / time       — game clock

Three.js scene
  ├── reads state from Zustand
  ├── renders visual feedback only
  └── no gameplay logic inside 3D objects
```

---

## Scene Objects (Primitive Phase)

| Object | Shape | Notes |
|--------|-------|-------|
| Floor grid | PlaneGeometry | 1 unit = 1 gameplay tile |
| Walls (2) | BoxGeometry | Green / cream painted |
| Service counter | BoxGeometry wide | Player-facing |
| Display case | BoxGeometry + glass material | Shows available ulam |
| Tables (3) | BoxGeometry | Seats 4 each |
| Chairs (12) | Small box + backrest box | Per table |
| Rice cooker | CylinderGeometry | On counter |
| Stove / kalan | BoxGeometry | Back kitchen area |
| Menu board | PlaneGeometry + texture | Wall-mounted |
| Signage | Text / PlaneGeometry | "Karinderya ni Aling ___" |

Each object is a **separate mesh** → swappable with GLB later without touching logic.

---

## 3D Asset Pipeline (When Ready)

```
Reference image (isometric)
  ↓
Meshy AI — Image to 3D
  Settings: Low Poly, Clean Topology, Embedded Textures, GLB export
  ↓
Blender — Cleanup
  Separate meshes, fix normals, align to grid (1 unit = 1 tile)
  ↓
Export GLB (apply transforms, compress textures)
  ↓
React Three Fiber — useGLTF("/models/karinderya.glb")
```

---

## AI Studio Integration (Phase 3+)

```
POST /generate-layout
{
  "reputation": 45,
  "seats": 12,
  "style": "traditional",
  "budget": 5000
}

→ Returns: furniture placement JSON, upgrade suggestions, seasonal decor
```

Also planned:
- Customer dialogue generation (contextual, Filipino flavor)
- Dynamic event scripting ("Mahal na ang mantika ngayon...")
- Suki memory narratives

---

## Suki System

Regular customers remember:
- Their favorite ulam
- How fast you served them
- If you ran out of their order
- If you greeted them by name

High suki = loyalty bonus, word-of-mouth customers, neighborhood rep increase.

---

## Progression Milestones

| Day | Milestone |
|-----|-----------|
| 1–5 | Learn basics, 1 kaldero, 3 tables |
| 6–15 | First suki, hire 1 staff, add drinks |
| 16–30 | Expand seating, palengke unlocks |
| 31–60 | Open dinner service, cook special recipes |
| 60+ | Second branch, catering events, fiesta mode |

---

## What This Game Is NOT

- Not a AAA realistic sim
- Not a first-person cooking game
- Not an action game
- Not a photorealistic renderer

It is: **a living management dollhouse with Filipino soul.**

---

## File Structure (Planned)

```
karinderya-simulator/
  src/
    components/
      HUD/          — kita, time, reputation bar
      Menu/         — ulam ng araw panel
      Queue/        — customer queue display
      Sidebar/      — nav (Tindahan, Ulam, Staff, etc.)
    scene/
      KarinderyaScene.tsx   — R3F canvas
      objects/              — Floor, Counter, Table, Chair, etc.
    store/
      gameStore.ts          — Zustand state
    data/
      dishes.ts             — ulam list, prices, cook time
      customers.ts          — customer types, patience curves
  public/
    models/                 — GLB assets (Phase 2+)
  vision.md
```

---

*Last updated: 2026-05-14*
