import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  if (auth.authenticated()) {
    console.log('logged in');
    return true;
  }

  console.log('go to login');
  return router.createUrlTree(['login']);
};
