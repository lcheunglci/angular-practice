import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canLoadHeavyGuard } from './can-load-heavy.guard';

describe('canLoadHeavyGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => canLoadHeavyGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
