# AGENTS.md

Root of a single git repo that holds ~60 **independent** Angular practice projects
(`my-first-app/`, `recipe-app/`, `ng-ionic-app/ionic-ng-booking/`, ...).

## Hard rules

- No shared tooling: there is **no root `package.json`**, lockfile, build, lint, or
  test setup. Every subdirectory is its own standalone project with its own
  `package.json`, `node_modules`, toolchain config, and Angular version.
- Never run `npm`/`ng`/`npx`/`git` commands from this root expecting a project build —
  always run them inside the specific project directory.
- Framework flavors differ per app (NgRx, Signals, standalone/bootstrapped, Ionic +
  Capacitor, plain CLI). Never assume an API or version from one project exists in another.
- There is no root README; project-level config, `AGENTS.md`s, and codes are the source
  of truth.

## Electron desktop projects

- `builder-tool-electron/` — the active project. Angular 20 + Electron **build runner**.
  Launch via `npm run electron:dev` (renderer HMR) or `npm run electron:start` (built dist).
  See its `AGENTS.md` for the IPC surface and the `file://`/routing gotchas.
- `report-csv-electron/` — same Electron + Angular 20 stack, the original template (SQLite +
  CSV reports; `project-plans.md` documents it). When an Electron project misbehaves, diff
  against this one before guessing.

Project-level `AGENTS.md`s exist for `builder-tool-electron/`,
`ng-ionic-app/ionic-ng-booking/`, and the root.