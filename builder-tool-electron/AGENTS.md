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
- `deploy.js` — copies a project's built app (the `index.html`-bearing folder under `dist/`,
  preferring a `browser` subfolder) to that project's deploy destination; shares the runner's
  single-run slot, so reserve it **synchronously** before any `await`.
- `tray.js` — system-tray icon reflecting run state (idle/running/success/failed) in the icon,
  tooltip, menu, plus a Windows toast on completion when no window is focused. Fed by the *same*
  `streamTo` callback as the renderer, so it must stay tolerant of a missing window.
- `settings.js` — project list persisted as JSON at `app.getPath('userData')/projects.json`.
  No database and no native modules, so there is **no `postinstall` electron-rebuild**.
  Stored records are `{ path, name?, deployTo? }`; `toProject()` decorates a *record*, so `projects:list`
  maps `loadProjects().map(toProject)` — passing a raw string throws `ERR_INVALID_ARG_TYPE` in the
  renderer (a past bug). The folder is the record's identity, so `updateProject()` validates it
  (absolute, exists, not another record's folder) and re-keys the record on change.
- Angular: `electron-api.ts` (typed shape of `window.builderApi`) → `project.service.ts` (wrapper
  with a `requireApi()` guard). UI is a single `app.ts`/`app.html`/`app.css`.
- **Edit mode** — header toggle swaps each row's name/folder/destination to textboxes with per-row
  Save/Cancel. Inputs use one-way `[value]` + `(input)`, **not** `ngModel`, and Save/Cancel leave the
  row's edit state so the inputs are *destroyed*; that is what makes a reset actually clear typed
  text. Restoring the draft in place silently does nothing — see the gotchas list.

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