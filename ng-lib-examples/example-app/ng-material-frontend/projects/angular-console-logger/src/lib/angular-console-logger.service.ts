import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AngularConsoleLoggerService {
  warn(message: string) {
    console.warn('custom warn:' + message);
  }
  error(message: string) {
    console.error('custom error:' + message);
  }
  info(message: string) {
    console.log('custom info:' + message);
  }
  constructor() {}
}
