import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AppRoutingModule } from './app-routing.module';
// import { AnalyticsService } from './shared/analytics.service';

export const appConfig: ApplicationConfig = {
  // providers: [AnalyticsService, provideRouter(routes)]
  providers: [provideRouter(routes), importProvidersFrom(AppRoutingModule)]
};
