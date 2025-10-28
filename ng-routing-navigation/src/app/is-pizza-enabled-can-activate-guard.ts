import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FeatureFlagService } from './services/feature-flag.service';
import { map } from 'rxjs';
import { HOME_ROUTE } from './app.routes';

export const isPizzaEnabledCanActivateGuard: CanActivateFn = (route, state) => {
  // return true; // Change to false to see the pizza-not-found component
  const router = inject(Router);
  const flagService = inject(FeatureFlagService);

  return flagService.isPizzaFeatureEnabled$.pipe(
    map((isEnabled) => {
      return isEnabled ? true : router.createUrlTree([HOME_ROUTE]);
    })
  );
};
