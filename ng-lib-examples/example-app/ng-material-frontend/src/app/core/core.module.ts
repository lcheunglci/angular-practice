import { NgModule } from '@angular/core';
import { AngularConsoleLoggerService } from 'angular-console-logger';
import { CustomLoggerService } from './services/custom-logger.service';

@NgModule({
  providers: [
    { provide: AngularConsoleLoggerService, useClass: CustomLoggerService },
  ],
})
export class CoreModule {}
[];
