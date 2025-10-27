import { TestBed } from '@angular/core/testing';
import { CanActivateChildFn } from '@angular/router';

import { isPizzaEnabledCanActivateChildGuard } from './is-pizza-enabled-can-activate-child-guard';

describe('isPizzaEnabledCanActivateChildGuard', () => {
  const executeGuard: CanActivateChildFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isPizzaEnabledCanActivateChildGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
