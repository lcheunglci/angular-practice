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

  it('warn should be called when production is false', () => {
    const myService = new AngularConsoleLoggerService({
      appPrefix: 'anything',
      isProduction: false,
    });

    const spy = spyOn(console, 'warn');

    myService.warn('this is a test');

    expect(spy).toHaveBeenCalled();
  });

  it('warn should not be called when production is true', () => {
    const myService = new AngularConsoleLoggerService({
      appPrefix: 'anything',
      isProduction: true,
    });

    const spy = spyOn(console, 'warn');

    myService.warn('this is a test');

    expect(spy).not.toHaveBeenCalled();
  });

  it('logged message should have defined prefix', () => {
    const myService = new AngularConsoleLoggerService({
      appPrefix: 'anything',
      isProduction: false,
    });

    const spy = spyOn(console, 'log');

    myService.warn('this is a test');

    expect(spy).toHaveBeenCalledWith('anything: this is a test');
  });
});
