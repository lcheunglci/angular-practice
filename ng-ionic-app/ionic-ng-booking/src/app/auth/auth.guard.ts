import {
  CanMatch,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  UrlSegment,
} from '@angular/router';
import { AuthService } from './auth.service';

export class AuthGuard implements CanMatch {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    if (!this.authService.userIsAuthenticated) {
      this.router.navigateByUrl('/auth');
    }

    return this.authService.userIsAuthenticated;
  }
}
