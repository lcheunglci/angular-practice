import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { adminUserResolver } from './admin-user-resolver';

describe('adminUserResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => adminUserResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
