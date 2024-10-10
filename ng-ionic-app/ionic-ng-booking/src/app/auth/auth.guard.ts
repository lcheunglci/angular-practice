import {
  CanMatch,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  UrlSegment,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch {
  constructor(private authService: AuthService, private router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/auth');
        }
      })
    );
  }
}
