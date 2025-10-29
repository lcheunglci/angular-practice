import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { leavePizzaCanDeactivateGuard } from './leave-pizza-can-deactivate-guard';

describe('leavePizzaCanDeactivateGuard', () => {
  const executeGuard: CanDeactivateFn<unknown> = (...guardParameters) => 
      TestBed.runInInjectionContext(() => leavePizzaCanDeactivateGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
