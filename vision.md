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

## Tech Stack

```
Frontend / Game UI
  React + TypeScript (TSX)
  Zustand — game state (queues, kita, reputation, suki data)
  Tailwind CSS — HUD, menus, panels

Assets (phased)
  Phase 1 → Text-based UI, emoji ingredients, food images
  Phase 2 → GLB assets from Blender / Quaternius / Kenney
  Phase 3 → Custom low-poly Filipino props
```

---

## Architecture Rule

> The game logic lives in React + Zustand.

```
Zustand store
  ├── customers[]      — queue, patience, order, suki status
  ├── menu[]           — available ulam, stock count, price
  ├── staff[]          — hired workers, fatigue, skills
  ├── kita             — daily earnings, expenses
  ├── reputation       — neighborhood score
  └── day / time       — game clock
```

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

*Last updated: 2026-05-15*
