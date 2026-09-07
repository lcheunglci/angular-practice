# AGENTS.md — ionic-ng-booking ("Papaya BnB")

Angular 18 + Ionic 8 + Capacitor 6 booking app with a Firebase backend. One of ~60
standalone practice apps under the `angular-practice` git root: its `node_modules`,
config, and commands only work from this directory.

## Commands

- `npm start` — dev server (`ng serve`, development config).
- `npm run build` — **production** build; needs env values (see below); outputs to
  `www/` (Capacitor webDir), not `dist`.
- `npm test` — Karma + Jasmine watch mode; requires real Chrome. Single spec:
  `npm test -- --include='**/auth.service.spec.ts'`. CI single run:
  `npm test --configuration ci` (watch off). Coverage → `coverage/app/`.
- `npm run lint` — @angular-eslint over `src/**/*.ts` and `src/**/*.html`.

## Env config (biggest gotcha)

`src/environments/environment*.ts` read `process.env['NG_APP_*']`; values are injected at
**build time** by `dotenv-webpack` (`webpack-dev.config.js` / `webpack-prod.config.js`)
from the committed `.env`. Prod webpack sets `systemvars: true`, so real env vars also
apply (CI). Do **not** hardcode keys into environment files — edit `.env` or export vars.
`.github/copilot-instructions.md` says to put keys in `environment.ts`; that advice is stale.

## Toolchain quirks

- Build uses `@angular-builders/custom-webpack`, not the plain CLI builder.
- `www/` is git-ignored generated output. After a web build, sync native code with
  `npx cap copy` / `npx cap sync` (`android/` is checked in; no iOS project).
- Webpack adds a `timers` → `timers-browserify` fallback because `auth.service.ts`
  imports `clearTimeout`/`setTimeout` from `'timers'`. Don't "fix" or remove that.
- `ng` uses the Ionic toolkit schematics — generate code with `ng g page` /
  `ng g component` to get Ionic-idiomatic output (`.page.ts`/`.component.ts` + scss).

## Architecture

- Lazy-loaded feature modules: `auth/`, `places/` (with `discover/` and `offers/`
  sub-tabs), `bookings/` — each has its own `*module.ts` + `*-routing.module.ts`.
  `shared/` holds reusable UI (`SharedModule`, pickers, `map-modal`) and is not
  lazy-loaded. `AuthGuard` protects `places` and `bookings` routes.
- Services (`places.service.ts`, `booking.service.ts`, `auth.service.ts`) are
  `providedIn: 'root'`, keep state in a `BehaviorSubject` exposed via a getter
  (`.asObservable()`), and chain `take(1)` + `switchMap` for HTTP + auth token.
  Models are plain classes with constructor params, no decorators.
- Backend is Firebase Realtime DB REST (`DB_URL + '/xx.json?auth=' + token`) + Firebase
  Auth REST. Token persists in Capacitor Preferences under key `authData` with an
  auto-logout timer. Image upload hits the Cloud Function in `functions/`
  (`UPLOAD_URL`). Firebase project: `ing-papaya-bnb`.

## TypeScript

`strict: true`, `strictTemplates: true`, `noPropertyAccessFromIndexSignature` (bracket
access required, e.g. `resData[key]`), `useDefineForClassFields: false`.