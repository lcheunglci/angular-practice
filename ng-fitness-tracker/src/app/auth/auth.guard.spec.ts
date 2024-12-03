import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authGuardCanActivate } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      authGuardCanActivate(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
