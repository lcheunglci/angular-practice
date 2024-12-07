import { CanActivateFn, CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { take } from 'rxjs';

export const authGuardCanActivate: CanActivateFn = (route, state) => {
  const store: Store = inject(Store<fromRoot.State>);
  return store.select(fromRoot.getIsAuth).pipe(take(1));
};

export const authGuardCanMatch: CanMatchFn = (route) => {
  const store: Store = inject(Store<fromRoot.State>);
  return store.select(fromRoot.getIsAuth).pipe(take(1));
};
