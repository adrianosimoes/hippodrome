# The Hippodrome — Frontend (Angular)

## What this project is

This is the Angular frontend for "The Hippodrome", a small horse-racing management game. The UI and game logic let a player manage horses and trainers, enter races (simulated or real-time), participate in auctions, progress weeks and seasons, gain XP/levels and manage leagues.

## Quick start (development)

Prerequisites:
- Node.js (14+ recommended)
- npm (or yarn)
- Angular CLI (optional, can use npm scripts)

Common commands (PowerShell):

```powershell
npm install
npm start          # usually runs `ng serve` defined in package.json
# or
npx ng serve --open
```

# Building for itch.io:
ng build --base-href hippodrome

If TypeScript/Angular errors appear, run the compiler or lint as configured in the repo.

## Project structure (important files)

Top-level files
- `angular.json`, `package.json`, `tsconfig.json` — Angular project config and dependencies
- `src/` — application source and assets

src/ (high level)
- `index.html`, `main.ts`, `polyfills.ts` — Angular bootstrap files
- `styles.css` — global styles
- `assets/` — images, fonts and static files (backgrounds, icons, fonts)
- `environments/` — `environment.ts`, `environment.prod.ts` for environment-specific settings

src/app/
- `app.module.ts` — Angular module wiring
- `app.component.ts` / `app.component.html` — application shell
- `app-routing.module.ts` — route definitions

src/app/model/
- `gameinstance.ts` — core game state and save/load
- `horse.ts`, `player.ts`, `trainer.ts`, `race.ts` — domain models
- `raceinstance.ts` — race simulation / real-time race logic
- `utils.ts`, `pipehelpers.ts` — helpers and pipes

src/app/model/services/
- `common.service.ts` — central game logic and state manager (buy/sell, auctions, weeks, league checks, saving)
- `init.service.ts` — initial fixtures (horses, trainers, races)
- `gameconstants.ts` — numeric constants and settings

src/app/screens/
- `main/`, `shop/`, `training/`, `auction/`, `race/`, `stables/`, `league/`, `levelup/`, `login/`, `about/` — feature UI components for game screens

src/app/widget/
- Small reusable UI components (e.g. horse widget used across screens)

Tests
- Spec files (`*.spec.ts`) are colocated with components and services (Karma/Jasmine configuration in `karma.conf.js`)

## Where to look for common tasks

- Save/load and core state: `src/app/model/gameinstance.ts` and `src/app/model/services/common.service.ts`
- Race simulation and visual race flow: `src/app/model/raceinstance.ts` and the `race` screen under `src/app/screens/race`
- Shop/auction flow: `src/app/screens/shop` and `src/app/screens/auction` plus `common.service.ts` auction helpers
- Initialization fixtures: `src/app/model/services/init.service.ts`

## Notes & next steps

- The app uses localStorage for saving a game. Check `GameConstants.saveGameName` in `gameconstants.ts` to find the key.
- If you want, I can expand this README with run/debug steps (VS Code launch.json), CI/test instructions, or a short architecture diagram.

## License

Include project license here if applicable.
