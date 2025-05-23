import { TestBed } from '@angular/core/testing';

import { AngularRatingService } from './angular-rating.service';

describe('AngularRatingService', () => {
  let service: AngularRatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularRatingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
