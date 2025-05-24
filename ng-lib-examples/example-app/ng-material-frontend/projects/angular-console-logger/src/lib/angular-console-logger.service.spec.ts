import { TestBed } from '@angular/core/testing';

import { AngularConsoleLoggerService } from './angular-console-logger.service';

describe('AngularConsoleLoggerService', () => {
  let service: AngularConsoleLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularConsoleLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
