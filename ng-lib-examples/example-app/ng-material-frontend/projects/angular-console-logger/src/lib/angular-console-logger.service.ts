import { LoggerConfig } from './logger.config';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AngularConsoleLoggerService {
  constructor(private loggerConfig: LoggerConfig) {}

  warn(message: string) {
    if (this.loggerConfig.isProduction) {
      return;
    }
    console.warn(`${this.loggerConfig.appPrefix}: ${message}`);
  }
  error(message: string) {
    console.error(`${this.loggerConfig.appPrefix}: ${message}`);
  }
  info(message: string) {
    console.log(`${this.loggerConfig.appPrefix}: ${message}`);
  }
}
