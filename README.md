# Karinderya Simulator

> *"A cozy-but-stressful Filipino neighborhood restaurant management simulator where players gradually become part of a living community."*

---

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies: `npm install`
2. Run the app: `npm run dev`

---

## Core Game Identity

### What This Game Is

> **Filipino community + restaurant management simulator.**

**Main inspirations:**
- Football Manager
- Game Dev Tycoon
- The Sims
- Two Point Hospital
- RimWorld

**NOT primarily:** Diner Dash, Papa's Pizzeria

**Direction:** management-first · community-first · cozy but stressful · systems-driven · distinctly Filipino

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
3. Menu planning & prep
4. Staff assignment
5. Open shop
6. Lunch / dinner rushes
7. Emergency reactions
8. End-day analytics
9. Next-day optimization

---

### Important Design Decisions

**No full cooking minigame.** The player is always the owner, operator, planner, and manager — NOT manually cooking.

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
| UI | Tailwind CSS |

---

### Emotional Pillars

belonging · routine · survival · food · nostalgia · community · operational pressure
