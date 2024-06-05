import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// import { AnalyticsService } from './shared/analytics.service';

export const appConfig: ApplicationConfig = {
  // providers: [AnalyticsService, provideRouter(routes)]
  providers: [provideRouter(routes)]
};
