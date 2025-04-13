import { TestBed } from '@angular/core/testing';

import { DateStringAdapterService } from './date-string-adapter.service';

describe('DateStringAdapterService', () => {
  let service: DateStringAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateStringAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
