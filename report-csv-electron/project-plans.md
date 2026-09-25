# Project Plans — Reports Insight

A desktop application (**Reports Insight**) built with **Angular 20** + **Electron**, packaging CSV report files into a local **SQLite** database, with table viewing, renaming, deleting, and export to JSON / Excel / LibreOffice.

## Status

Implemented and working. Run `npm run electron:start` to launch the desktop app.

## Recent changes

- Rebranded the app title/window name and installer product name from "ReportCsvElectron" to **Reports Insight**.
- Replaced Electron's default top menu bar with a trimmed custom menu (`menu.js`): **File** (quit), **Edit** (clipboard ops), **View** (reload/devtools/zoom/fullscreen), **Help** (About dialog). Dropped the default **Window** menu and the "Learn More" Electron-docs link.
- Added `sample-data/sample-report.csv` for manual testing.

## Architecture

```
main.js                       Electron main process (window + IPC wiring)
menu.js                       Custom top menu bar (File/Edit/View/Help)
preload.js                    contextBridge -> window.reportApi (secure, nodeIntegration off)
db.js                         SQLite layer + CSV parsing + export logic (main-process only)
src/app/                      Angular renderer
  electron-api.ts             Typed shape of window.reportApi
  report.service.ts           Angular service wrapping the IPC bridge
  reports-list.component.*    "All reports" screen
  report-detail.component.*   Per-report table + rename/delete
  add-report-modal.component.* File-picker + custom-name import dialog
  export.component.*          Export screen (JSON / xlsx / ods)
sample-data/sample-report.csv Ready-made CSV for manual testing
```

Data always stays in the Electron main process (`better-sqlite3`). The renderer never touches the filesystem directly; everything goes through the preload bridge over IPC.

## Electron pieces

- `main.js` loads the Angular build from `dist/report-csv-electron/browser/index.html`, or `http://localhost:4200` when `ELECTRON_START_URL` is set (dev mode; also opens DevTools).
- App menu is built in `menu.js` from a trimmed template (no default Window menu, no Electron "Learn More" link); Help shows an **About Reports Insight** dialog. `menu.js` is required by `main.js` and is included in the Electron package (`files` in `package.json`).
- DB file lives at `app.getPath('userData')/reports.db` (WAL mode).
- Native module `better-sqlite3` is rebuilt for Electron's ABI on `postinstall` (`electron-rebuild -f -w better-sqlite3`).
- `electron-builder` packages to `release/` (Windows: NSIS, macOS: DMG, Linux: AppImage); `better-sqlite3` is excluded from the asar archive via `asarUnpack`.

## SQLite schema

```sql
reports     (id PK, name, source_file, imported_at)
report_rows (id PK, report_id FK -> reports ON DELETE CASCADE,
             date TEXT, order_id INTEGER, description TEXT, cost REAL)
```

## CSV import format

Columns (header row, in any order): `date` (string), `orderId` (number), `description` (string), `cost` (number). Parsed with PapaParse. Example in `sample-data/sample-report.csv`.

## IPC surface exposed on `window.reportApi`

| Method | Purpose |
| --- | --- |
| `openCsvDialog()` | OS open-file dialog (`.csv`) |
| `importReport(filePath, name)` | Parse CSV + insert report + rows; `name` falls back to file name |
| `listReports()` | All reports with row counts |
| `getReport(id)` | Single report + all rows |
| `renameReport(id, name)` | Rename report |
| `deleteReport(id)` | Delete report (cascade rows) |
| `exportReport(id, format)` | Save dialog, then write `json`, `xlsx`, or `ods` |

## App flows

- **All reports** — left-side table of loaded reports (name, source file, row count, imported date), each row links to its detail page; **Add report** opens the modal (file picker + optional custom name); **Delete** per row.
- **Report detail** — sticky-free table of rows with a total-cost footer; inline **Rename**; **Delete report** returns to the list.
- **Export** — pick a report, choose JSON / Excel (.xlsx) / LibreOffice (.ods), pick a save location.

## Commands

| Command | What it does |
| --- | --- |
| `npm run electron:dev` | `ng serve` + Electron on `localhost:4200` (live reload, DevTools) |
| `npm run electron:start` | `ng build` then run Electron against `dist/` |
| `npm run electron:pack` | Build + unpacked app into `release/` |
| `npm run electron:build` | Build + platform installer into `release/` |
| `npm run build` / `npm start` / `npm test` | Standard Angular CLI targets |
| `npm run postinstall` | Rebuilds `better-sqlite3` for Electron (runs automatically on `npm install`) |

## Gotchas (hard-earned)

- **`file://` + Angular routing** — the built `index.html` must use `"baseHref": "./"` (angular.json) and the router uses `withHashLocation()`. Without both, the packaged window stays blank because `pushState` fails and relative script URLs resolve to the filesystem root.
- **ng-bootstrap version** — Angular 20 needs `@ng-bootstrap/ng-bootstrap@19` (v21 requires Angular 22); also requires `@angular/localize`. Don't bump blindly.
- **Node engine** — `electron-builder`/`@electron/rebuild` warn they want Node >= 22; on Node 20 the install still works, and `electron-rebuild` succeeds for this project (no extra native deps). Packaging may need a Node upgrade later.
- **CSV parser** — `parseCsv` ignores empty rows and tolerates missing/blank cells by coercing to strings/`Number()`; export uses SheetJS (`xlsx` package) for `xlsx`/`ods`.
- **Budget** — full Bootstrap CSS pushes the initial bundle past the default 500 kB; the warning threshold in `angular.json` was raised to 700 kB.

## Future ideas (not yet implemented)

- Preload-only drag-and-drop import from OS.
- Per-report deletion/editing of individual rows.
- CSV column mapping when headers differ.
- Multi-format chart summaries on the detail page.