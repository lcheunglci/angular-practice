import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isPizzaEnabledCanActivateGuard } from './is-pizza-enabled-can-activate-guard';

describe('isPizzaEnableCanActivateGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      isPizzaEnabledCanActivateGuard(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
