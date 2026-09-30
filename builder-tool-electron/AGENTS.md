# AGENTS.md — builder-tool-electron

Angular 20 + Electron desktop **build runner**: save local npm project folders, run
`npm install` / `npm run build`, stream output live. Standalone project — run every `npm`/`ng`
command from this directory, never from the repo root.

## Commands

- `npm run electron:dev` — dev mode: `ng serve` renderer HMR + Electron via `nodemon`, which
  watches **only** `main.js`/`preload.js`/`runner.js`/`settings.js`/`menu.js` (main-process
  auto-restart).
- `npm run electron:start` — `ng build` then Electron against `dist/`. Requires the build step.
- `npm run electron:build` / `electron:pack` — package an installer / unpacked app into `release/`.
- `npm test -- --watch=false --browsers=ChromeHeadless` — headless unit tests (Karma + Jasmine).
  Plain `npm test` wants a headed Chrome at `localhost:9876`.

## Architecture — the main process owns everything OS-side

- `main.js` — window + IPC; `preload.js` exposes `window.builderApi` via `contextBridge`
  (contextIsolation on, nodeIntegration off). The renderer never spawns processes or touches the
  filesystem; all subprocess work happens through the preload bridge over IPC.
- `runner.js` — spawns `npm.cmd` with `shell: true` on Windows (bare `npm` is a `.cmd` shim),
  streams stdout/stderr line-by-line over IPC, one command at a time; cancel is a **tree-kill**
  (`taskkill /T /F` — killing the shell alone leaves npm's node children alive).
- `settings.js` — project list persisted as JSON at `app.getPath('userData')/projects.json`.
  No database and no native modules, so there is **no `postinstall` electron-rebuild**.
  Stored records are `{ path }`; `toProject()` decorates a *record*, so `projects:list` maps
  `loadProjects().map(toProject)` — passing a raw string throws `ERR_INVALID_ARG_TYPE` in the
  renderer (a past bug).
- Angular: `electron-api.ts` (typed shape of `window.builderApi`) → `project.service.ts` (wrapper
  with a `requireApi()` guard). UI is a single `app.ts`/`app.html`/`app.css`.

## Gotchas

- **Blank packaged window** ⇒ check the required pair: `"baseHref": "./"` in `angular.json` AND
  `withHashLocation()` in `src/app/app.config.ts`. Both are mandatory for `file://` routing.
- **IPC event ordering** — the `started` run event can reach the renderer before the `run:start`
  invoke reply; `app.ts` buffers events (`runStarting`/`pendingEvents`) until it knows the runId.
  Don't "simplify" that away.
- **Streamed events must run inside Angular's zone** — IPC `run:event` delivery fires outside
  Zone.js, so `app.ts` wraps the subscription callback in `ngZone.run(...)`. Without it, npm runs
  and all events arrive, but the console never repaints past the `started` header (the "brief
  output then frozen" bug that shipped at one point).
- **A killed npm run can leave a silent cache lock** — after `taskkill`/Cancel mid-install, npm may
  wait forever-with-no-output on its cache lock until it clears on its own; not an app bug.
- Spawn env forces `FORCE_COLOR=0`/`NO_COLOR=1` so streamed npm output is plain text.
- **Tests must not call `window.confirm`** — it hangs Chrome Headless. Project removal uses a
  two-step inline confirm in the template.
- Bootstrap CSS pushes the initial bundle over the default 500 kB budget; `angular.json` warns at
  700 kB. Don't drop the threshold or add heavy CSS without checking the build.
- Node 20 triggers `EBADENGINE` warnings from `electron-builder`/`@electron/rebuild` — harmless
  here (no native modules), but packaging may need Node ≥ 22 later.

## Reference

`report-csv-electron/` (repo-root sibling) is the same Angular + Electron stack minus the runner
and project list. Diff against it when wiring Electron pieces or when this app misbehaves;
`project-plans.md` in both projects documents architecture and hard-earned fixes.