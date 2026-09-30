# Project Plans — Builder Tool

A desktop **build runner** (**Builder Tool**) built with **Angular 20** + **Electron** that runs
`npm install` and `npm run build` in locally added project folders and streams the output live.

## Status

Implemented and working. Run `npm run electron:start` to launch the desktop app.

## Architecture

```
main.js                       Electron main process (window + IPC wiring)
preload.js                    contextBridge -> window.builderApi (secure, nodeIntegration off)
runner.js                     spawns npm, streams stdout/stderr, cancel support (main-process only)
settings.js                   Project list persisted as JSON in app userData + list-shape helpers
menu.js                       Custom top menu bar (File/Edit/View/Help)
src/app/                      Angular renderer
  electron-api.ts             Typed shape of window.builderApi
  project.service.ts          Angular service wrapping the IPC bridge
  app.ts / app.html / app.css "Builder Tool" screen (project list + live console)
```

All subprocess management happens in the Electron main process (`child_process.spawn`). The
renderer never touches the filesystem or spawns processes directly; everything goes through the
preload bridge over IPC.

## Electron pieces

- `main.js` loads `dist/builder-tool-electron/browser/index.html`, or `http://localhost:4200`
  when `ELECTRON_START_URL` is set (dev mode; also opens DevTools).
- The saved project list lives at `app.getPath('userData')/projects.json` (plain JSON, no database
  and no native modules — so there is **no `postinstall` electron-rebuild**).
- `runner.js` runs a single command at a time (`npm install` or `npm run <script>`), streams
  stdout/stderr line-by-line over IPC, emits `started`/`exit` events, and cancels by killing the
  process *tree* (`taskkill /T /F` on Windows — killing the shell alone leaves npm's children alive).
- `electron-builder` packages to `release/` (Windows: NSIS, macOS: DMG, Linux: AppImage). No
  `asarUnpack` needed (no native modules).

## IPC surface exposed on `window.builderApi`

| Method | Purpose |
| --- | --- |
| `listProjects()` | All saved projects (name, path, hasPackageJson) |
| `addProject()` | OS folder-picker; refuses duplicates; ignores folders already listed |
| `removeProject(projectPath)` | Remove from the saved list |
| `runScript(projectPath, script)` | Start `npm install` or `npm run build`; returns the runId |
| `cancelRun(runId)` | Kill the running command and its process tree |
| `runningRunId()` | Currently running runId, or null |
| `onRunEvent(cb)` | Subscribe to `run:event`; returns an unsubscribe function |

Run events: `started`, `stdout`, `stderr`, `exit`, `error`.

## App flow

- **Project list** — saved folders with name, path, and Install/Build buttons. Folders without a
  `package.json` are flagged and have their actions disabled. Remove is a two-step inline confirm.
- **Console** — live-streamed output (stderr in red), a running status line, **Cancel**
  (tree-kill), and **Clear**. Only one command runs at a time.

## Commands

| Command | What it does |
| --- | --- |
| `npm run electron:dev` | `ng serve` (renderer HMR) + Electron via `nodemon` watching `main.js`/`preload.js`/`runner.js`/`settings.js`/`menu.js` (main-process auto-restart) on `localhost:4200` |
| `npm run electron:start` | `ng build` then run Electron against `dist/` |
| `npm run electron:pack` | Build + unpacked app into `release/` |
| `npm run electron:build` | Build + platform installer into `release/` |
| `npm run build` / `npm start` / `npm test` | Standard Angular CLI targets (tests: `npm test -- --watch=false --browsers=ChromeHeadless`) |

## Gotchas (hard-earned)

- **Hot reload split** — `electron:dev` gives renderer HMR via `ng serve` plus main-process
  auto-restart via `nodemon`, but `nodemon` watches only the `.js` files; renderer changes must
  not be watched by nodemon. `electron:dev` (no built `dist/`) stays invalid for `electron:start`
  until you build.
- **`file://` + Angular routing** — the built `index.html` must use `"baseHref": "./"` (angular.json)
  and the router uses `withHashLocation()`. Without both, the packaged window stays blank.
- **Batch line streaming** — `child.stdout` chunks are split on `/\r?\n/` before forwarding; a
  trailing partial line is only dropped if the process ends mid-line (acceptable for npm output).
- **ANSI color** — the spawn env forces `FORCE_COLOR=0`/`NO_COLOR=1` so streamed text is clean.
- **Windows npm spawn** — `npm` alone is a `.cmd` shim that fails without a shell; the runner uses
  `npm.cmd` + `shell: true` and kills the tree with `taskkill`.
- **Events must run inside Angular's zone** — IPC `run:event` callbacks arrive *outside* Zone.js,
  so mutating `logLines`/`activeRun` in the subscription never triggers change detection: npm
  actually runs and the app emits all events, but the console freezes after the `started` header
  (the user-visible "brief output then nothing" bug). `app.ts` wraps the subscription callback in
  `ngZone.run(...)`; don't flatten that away.
- **Killed npm can hold a silent cache lock** — cancelling or `taskkill`-ing an app mid-`npm
  install` can leave the npm cache locked; the next run then waits *silently* with zero output
  while the status stays "running". It's not an app bug — a plain `npm install` in that folder
  shows the same hang until the lock clears on its own.
- **IPC event ordering** — the `started` event can arrive before the `invoke` reply updates the
  renderer; the renderer buffers events until it knows the runId (see `runStarting`/`pendingEvents`
  in `app.ts`).
- **`projects:list` shape** — `settings.js` stores records as `{ path }`; `toProject` decorates a
  *record*, so `list` must map `loadProjects().map(toProject)` — passing a plain string (as an
  early bug did) throws `ERR_INVALID_ARG_TYPE` in the renderer.
- **Node engine** — `electron-builder`/`@electron/rebuild` warn they want Node >= 22; on Node 20 the
  install and packaging still work for this project (no native modules to rebuild).
- **Budget** — Bootstrap CSS pushes the initial bundle past the default 500 kB; the warning
  threshold in `angular.json` was raised to 700 kB.
- **Tests in headless CI** — the suite must not trigger `window.confirm` (it blocks Chrome
  Headless); removal is a two-step inline confirm instead.

## Future ideas (not yet implemented)

- Free-form command entry behind an allowlist.
- Per-project environment variables or extra `npm run <script>` buttons.
- Build history (timestamps, exit codes) per project.