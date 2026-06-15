# Copilot Instructions

This is a Papaya BNB (booking) application built with Angular 18, Ionic 8, and Firebase for authentication.

## Build, Test, and Lint

### Available Commands

```bash
npm start          # Run dev server (ng serve on localhost:4200)
npm build          # Production build
npm test           # Run tests in watch mode (Karma + Jasmine)
npm test -- --watch=false --browsers=Chrome --code-coverage  # Single run with coverage
npm lint           # Run ESLint
npm watch          # Build with watch mode
```

### Testing a Single File

```bash
# Run tests for a specific file (e.g., auth.service.spec.ts)
npm test -- --include='**/auth.service.spec.ts'

# Run tests with code coverage
npm test -- --code-coverage --watch=false
```

## Architecture

### Project Structure

The app uses **feature-based lazy-loaded modules** with clear separation of concerns:

- **`src/app/auth/`** - Authentication module
  - `auth.service.ts` - Handles Firebase signup/login/logout and token management
  - `auth.guard.ts` - Route protection
  - `user.model.ts` - User data class
  - Uses Capacitor Preferences for storing auth tokens locally

- **`src/app/places/`** - Places (rental listings) module
  - `places.service.ts` - Manages place data
  - `place.model.ts` - Place data class
  - Sub-modules:
    - `discover/` - Browse available places
    - `offers/` - User's own place listings (with create, edit, list)
  - Uses Google Maps integration for location selection

- **`src/app/bookings/`** - Booking management module
  - `booking.service.ts` - Manages booking data
  - `booking.model.ts` - Booking data class
  - `create-booking/` - Component for creating new bookings

- **`src/app/shared/`** - Shared components (not lazy-loaded)
  - Reusable pickers: `image-picker/`, `location-picker/`
  - `map-modal/` - Google Maps modal component

### Data Flow

1. **Authentication** - AuthService manages login state and Firebase tokens via BehaviorSubjects
2. **Services** - Domain services (PlacesService, BookingService) handle HTTP requests and state
3. **Components/Pages** - Subscribe to service observables and display data
4. **Local Storage** - Capacitor Preferences used for persisting auth tokens between sessions

### Environment Configuration

Place API keys and URLs in `src/environments/environment.ts` (dev) and `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: false,
  FB_API_KEY: 'your-firebase-api-key',
  AUTH_SIGN_UP_URL: 'https://...',
  AUTH_SIGN_IN_URL: 'https://...',
};
```

## Key Conventions

### Naming and Selectors

All components use **`app` prefix** and follow these patterns (enforced by ESLint):

- **Component names** - Suffix with `Page` (pages) or `Component` (reusable)
  - Example: `PlacesPage`, `ImagePickerComponent`
- **Component selectors** - kebab-case with `app-` prefix
  - Example: `<app-image-picker>`, `<app-place-detail>`
- **Directive selectors** - camelCase with `app` prefix
  - Example: `appHighlight`

### Service Patterns

Services use RxJS observables with BehaviorSubjects for state management:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  private _data = new BehaviorSubject<DataType | null>(null);
  
  get data() {
    return this._data.asObservable().pipe(map(/* transform */));
  }
  
  constructor(private http: HttpClient) {}
}
```

Key patterns:
- Services are **providedIn: 'root'** (singleton, tree-shakeable)
- Use `map()` to expose public observables that transform internal state
- Use `tap()` for side effects (e.g., storing data after HTTP requests)
- Implement `OnDestroy` to unsubscribe from active timers (see AuthService for logout timer cleanup)

### Model Classes

Data models are simple classes with constructor parameters (no decorators):

```typescript
export class Booking {
  constructor(
    public id: string,
    public placeId: string,
    public userId: string,
    // ... other properties
  ) {}
}
```

### TypeScript Configuration

Strict rules enforced:
- `strict: true` - All strict checks enabled
- `noImplicitReturns: true` - Functions must have explicit returns
- `noPropertyAccessFromIndexSignature: true` - Type-safe property access
- Target: `ES2022` with `DOM` library

## Styling

Uses **SCSS** with global styles in `src/global.scss` and theme variables in `src/theme/variables.scss`.

Ionic components automatically styled. Custom component styles in `.scss` files next to components.

## Firebase / Backend Integration

- Authentication uses Firebase REST API (sign-up, sign-in endpoints)
- Token-based auth with automatic refresh via expiration timer
- Auth tokens stored in Capacitor Preferences for persistence
- Services communicate via `HttpClient` (ensure environment URLs are configured)

## Mobile Capabilities

Uses Capacitor for native features:
- `@capacitor/camera` - Image capture
- `@capacitor/geolocation` - GPS location
- `@capacitor/preferences` - Local device storage
- Google Maps for location picking

## Module Organization

Each feature module should:
1. Have its own routing module (e.g., `places-routing.module.ts`)
2. Be declared in a feature module (e.g., `places.module.ts`)
3. Be lazy-loaded in app routing
4. Import `SharedModule` if using shared components

Route protection via `canActivate: [AuthGuard]`.

## Testing

- **Framework** - Jasmine with Karma runner
- **File pattern** - `*.spec.ts` alongside the file being tested
- **Coverage** - HTML reports generated to `coverage/app/` directory
- Standard patterns: Mock services, test observables, use `fakeAsync`/`tick` for async operations
