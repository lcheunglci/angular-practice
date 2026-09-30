# Builder Tool

Desktop build runner built with **Angular 20** + **Electron**. Manage a saved list of local
Angular (or any npm) projects and run `npm install` / `npm run build` in them with
live-streamed output.

## Run it

```bash
npm install
npm run electron:start   # build + launch the desktop app
```

For development with hot reload:

```bash
npm run electron:dev     # ng serve + Electron with main-process auto-restart
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run electron:dev` | Dev mode: renderer HMR + main-process restart via `nodemon` |
| `npm run electron:start` | `ng build` then run Electron against `dist/` |
| `npm run electron:pack` | Build + unpacked app into `release/` |
| `npm run electron:build` | Build + platform installer into `release/` |
| `npm run build` / `npm start` / `npm test` | Standard Angular CLI targets |

Run the unit tests headlessly with:
`npm test -- --watch=false --browsers=ChromeHeadless`

Saved projects are stored as JSON at `app.getPath('userData')/projects.json`. No database and no
native modules, so there is no `electron-rebuild` step.

See `project-plans.md` for architecture, the IPC surface, and hard-earned gotchas.