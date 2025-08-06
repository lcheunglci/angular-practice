import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app-routing-module';
import { PreloadingService } from './services/preloading.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),

    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadingService)),

    provideClientHydration(withEventReplay()),

    provideZoneChangeDetection({ eventCoalescing: true }),

    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `/avatars/${config.src}-${config.width ?? '175'}.jpeg`;
      }
    }
  ]
};;
