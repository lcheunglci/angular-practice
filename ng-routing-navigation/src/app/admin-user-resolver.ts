import { ResolveFn, UrlTree } from '@angular/router';
import { User } from './models/user';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const adminUserResolver: ResolveFn<User | UrlTree> = (route, state) => {
  const authService = inject(AuthService);

  return true;
};
