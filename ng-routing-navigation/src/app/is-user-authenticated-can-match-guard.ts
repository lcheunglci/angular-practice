import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from './services/auth.service';

export const isUserAuthenticatedCanMatchGuard: CanMatchFn = (
  route,
  segments
) => {
  const authService = inject(AuthService);
  return !!authService.authenticatedUser.value();
};
