import { provideBrowserGlobalErrorListeners, provideCheckNoChangesConfig, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

bootstrapApplication(App, {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 })
    ]
})
.catch((err) => console.error(err));
