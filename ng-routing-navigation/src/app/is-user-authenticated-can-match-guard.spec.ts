import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { isUserAuthenticatedCanMatchGuard } from './is-user-authenticated-can-match-guard';

describe('isUserAuthenticatedCanMatchGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isUserAuthenticatedCanMatchGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
