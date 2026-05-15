# Karinderya Simulator

## Working Style
- **Always brainstorm before implementing.** For any feature, UI change, or design decision, present 3 realistic options to the user and wait for their pick before writing code.
- Keep options grounded — no fantasy scope, only what can realistically be built.

## Game Direction
- Text-based UI — no canvas, no heavy animations. Clean, readable, desktop-first.
- Tagalog-first labels, warm rustic aesthetic.
- Filipino karinderya management sim: buy ingredients, cook dishes, serve customers, grow the business.

## UI Refactor (Active)
- Nuke & rebuild approach — fresh components, keep Zustand store + types + data.
- DiceBear Adventurer style for staff/customer avatars.
- Food images from Unilever recipe URLs (already in data). Ingredients as emojis.
- Home Menu: Start Game, Load Game, Settings (language preference).
- Phase flow: Morning Briefing → Palengke → Menu Planning → Prep → Staff Assignment → Operations → Summary → Sleep.
- Mockup reference images in public/img/ui/gameflow1-9.png.

## Recipe Strategy
- Curate 30-50 best karinderya recipes from recipes.json (1,121 total).
- Future: complex chef hiring with specialized menus per cook.
