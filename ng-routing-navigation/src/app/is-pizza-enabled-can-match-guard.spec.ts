import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isPizzaEnabledCanMatchGuard } from './is-pizza-enabled-can-match-guard';

describe('isPizzaEnabledCanMatchGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isPizzaEnabledCanMatchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
