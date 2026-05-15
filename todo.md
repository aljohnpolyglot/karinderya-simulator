# Karinderya Simulator — TODO

## Phase 1: UI Refactor (Text-Based Redesign)
- [x] Home Menu screen (Start Game, Load Game, Settings)
- [x] Settings screen with language preference (Filipino / English)
- [x] Redesign all phase screens
  - [x] Morning Briefing — weather, events, market prices, Nanay Rose tips
  - [x] Palengke Run — ingredient shopping with budget, cookbook, dish-use tags
  - [x] Menu & Prep (merged) — dishes sorted by availability, servings, rice cooker
  - [x] Staff Assignment — assign staff with DiceBear avatars, view stats
  - [x] Operations LIVE — display case, event log, speed slider + pause + sim-to-end
  - [x] End of Day Summary — financials, stats grid, reputation change
  - [x] Store Closed — night screen, next day
- [x] Top bar: day, time, cash, reputation, weather
- [x] Bottom nav: phase tabs
- [x] DiceBear Adventurer avatars for staff
- [x] Food images from Unilever recipe URLs
- [x] Ingredient icons as emojis
- [x] Desktop-first layout
- [x] Cookbook component — view all dish ingredients + costs + stock status
- [x] Fix prepDishes() — validate ingredients before cooking (no phantom cooking)
- [x] Rice fully manual — must buy bigas, cook it, no freebies
- [x] Speed slider + pause + sim-to-end in Operations

## Phase 2: Recipe System
- [ ] Curate 30-50 best karinderya recipes from recipes.json (1,121 total)
- [ ] Categorize recipes (Pork, Beef, Chicken, Seafood, Veggie, etc.)
- [ ] Recipe unlock tiers based on reputation + cost
- [ ] Recipe book UI — browse, view details, unlock
- [ ] Map recipe ingredients to game ingredient system

## Phase 3: Staff & Cooks
- [ ] Staff hiring system — browse candidates with random stats, pay hiring fee
- [ ] Tiredness system — stamina decreases with workload, affects speed/quality
- [ ] Mood system — morale affected by events, tips, rest quality
- [ ] Staff mood indicators in assignment screen
- [ ] Cook specialties/niches (e.g., Nanay Rose = adobo expert, Mang Kiko = grilled dishes)
- [ ] Specialty bonuses — faster prep, better quality for matching dishes
- [ ] More staff roles: Head Cook, Line Cook, Prep Cook
- [ ] Staff hiring from a pool (random candidates with different stats)
- [ ] Staff leveling — improve skills over time based on what they cook
- [ ] Morale system — affects quality and speed

## Phase 4: Gameplay Depth
- [ ] Volatile market prices (weather, day-of-week, events affect ingredient costs)
- [ ] Customer suki (loyalty) system — regulars with preferences
- [ ] Customer demographics affecting demand (students, workers, families)
- [ ] Special events (Barangay Fiesta, Payday Friday, School Day Off)
- [ ] Food freshness decay during operations
- [ ] Upgrades: bigger rice cooker, more seating, better stove

## Phase 5: Save/Load & Polish
- [ ] Save game to localStorage
- [ ] Load game from localStorage
- [ ] Multiple save slots
- [ ] Tutorial / first-day guided walkthrough
- [ ] Sound effects (optional)
- [ ] Achievement system

## Backlog / Ideas
- [ ] Jeepney delivery side-hustle
- [ ] Catering events
- [ ] Supplier relationships
- [ ] Karinderya decoration/customization
- [ ] Competitor karinderyans in the area
- [ ] Complex chef hiring with specialized menus per cook
