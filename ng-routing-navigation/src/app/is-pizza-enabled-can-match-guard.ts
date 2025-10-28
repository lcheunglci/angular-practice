import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { FeatureFlagService } from './services/feature-flag.service';

export const isPizzaEnabledCanMatchGuard: CanMatchFn = (route, segments) => {
  const flagService = inject(FeatureFlagService);
  return flagService.isPizzaFeatureEnabled$;
};
