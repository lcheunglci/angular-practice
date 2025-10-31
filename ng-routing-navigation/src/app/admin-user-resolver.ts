import { RedirectCommand, ResolveFn, Router, UrlTree } from '@angular/router';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { LOGIN_ROUTE, NOT_ADMIN_ROUTE } from './app.routes';
import { delay, map, of } from 'rxjs';

export const adminUserResolver: ResolveFn<User | UrlTree> = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authenticatedUser.hasValue()) {
    return new RedirectCommand(router.createUrlTree(['/', LOGIN_ROUTE]));
  }

  if (
    !authService.authenticatedUser
      .value()
      ?.permissions.find((grant) => grant === 'admin')
  ) {
    return new RedirectCommand(router.createUrlTree(['/', NOT_ADMIN_ROUTE]));
  }

  const authUser = authService.authenticatedUser.value() as User;

  return of(2000).pipe(
    delay(2000),
    map(() => authUser)
  );
};
