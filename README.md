<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Karinderya Simulator

> *"A cozy-but-stressful Filipino neighborhood restaurant management simulator where players gradually become part of a living community."*

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Set the `GEMINI_API_KEY` in `.env.local` to your Gemini API key
3. Run the app: `npm run dev`

---

## Core Game Identity

### What This Game Is

The game evolved from:

> "Filipino cooking game"

into:

> **"Filipino community + restaurant management simulator."**

**Main inspirations:**
- Football Manager
- Game Dev Tycoon
- The Sims
- Two Point Hospital
- RimWorld

**NOT primarily:** Diner Dash, Papa's Pizzeria

**Final direction:** management-first · community-first · mobile-first · cozy but stressful · systems-driven · distinctly Filipino

---

### Main Game Fantasy

NOT: *"I cook food."*

BUT: **"I built a place that became part of people's lives."**

The karinderya becomes:
- a community landmark
- a memory place
- a witness to generations

---

### Core Gameplay Loop

```
Observe → Forecast → Prep → Serve → React → Analyze → Improve Tomorrow
```

**Daily structure:**
1. Morning briefing
2. Palengke shopping
3. Prep phase
4. Staff assignment
5. Open shop
6. Lunch / dinner rushes
7. Emergency reactions
8. End-day analytics
9. Next-day optimization

---

### Important Design Decisions

**No full cooking minigame.** The player is always the owner, operator, planner, and manager — NOT manually cooking.

**Mobile-first UX architecture:**
- Top status bar
- Center isometric viewer
- Bottom phase panel
- Bottom nav (cards, sticky buttons, bottom sheets)

**Camera:** Fixed isometric. Optional 90° rotate buttons. NOT free orbit.

**Restaurant scale:** Small, personal, barangay-scale. Not a giant corporate empire.

---

### Community / Life Systems

Customers are persistent and tracked by name, age, favorite food, visit count, and life progression.

Examples:
- A kid who becomes an office worker
- An OFW who goes to Saudi
- A customer who marries, has children
- An old regular who eventually passes away

Handled subtly, emotionally, respectfully.

---

### Filipino Cultural Systems (Planned)

SSS · Pag-IBIG · PhilHealth · NBI clearance · barangay permits · regularization · 13th month pay · fiesta demand spikes · rainy season · OFW life · *"utang muna"* · community donations

Tone: warm, humorous, grounded. NOT dark.

---

### Key Systems

**Rice System** *(very important)*

Rice is NOT bundled with meals. It is a separate inventory, operational system, and revenue stream. Running out of rice = disaster.

**Display Case System**

The display case IS the menu. Customers order only from visible available trays. Trays deplete, freshness decays, emergency cooking is possible.

**Palengke Economy**

Dynamic market prices. Player learns ingredient overlap, meal planning, forecasting, and spoilage management.

**Staff System**

Stats: cooking · speed · friendliness · stamina · morale

Hidden traits: hardworking · *Marites* · ex-fast-food worker · stressed easily

FM-inspired analytics: prep time · waste efficiency · rush-hour performance · customer satisfaction

---

### Most Important Gameplay Insight

> The game became interesting when **bad decisions visibly hurt.**

Examples: too much prep → sold out rice → exhausted staff → wrong menu for weather → no seating

Player should feel: *"I lost because of MY decisions."*

---

### Technical Stack

| Layer | Tech |
|-------|------|
| Frontend | React + TypeScript + Vite |
| State | Zustand |
| 3D | Three.js + React Three Fiber + Drei |
| UI | Tailwind CSS + Framer Motion |
| AI (planned) | Google AI Studio / Gemini |

**Three.js purpose:** visualization only — "living dollhouse." NOT physics, advanced animation, or AAA gameplay engine.

---

### 3D / Visual Direction

Style: low poly · cozy · warm · stylized · modular · isometric

Assets: lightweight modular low-poly or procedural primitives first. GLB assets from Meshy/Blender in later phases.

---

### Emotional Pillars

belonging · routine · survival · food · nostalgia · community · operational pressure

---

*Last updated: 2026-05-14*
