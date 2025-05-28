import { TestBed } from '@angular/core/testing';

import { AngularConsoleLoggerService } from './angular-console-logger.service';
import { LoggerConfig } from './logger.config';

describe('AngularConsoleLoggerService', () => {
  const loggerConfig: LoggerConfig = {
    appPrefix: 'anything',
    isProduction: false,
  };
  let service: AngularConsoleLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LoggerConfig, useValue: loggerConfig }],
    });
    service = TestBed.inject(AngularConsoleLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
