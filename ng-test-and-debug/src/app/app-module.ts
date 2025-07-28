import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { UserListComponent } from './user-list/user-list.component';

import { ErrorMetadataService } from './services/error-metadata.service';
import { HighlightTextPipe } from './pipes/highlight-text.pipe';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UserListInterceptorService } from './mocks/user-list-interceptor.service';

@NgModule({
    declarations: [
        App,
        UserListComponent,
        HighlightTextPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
    ],
    providers: [
    // { provide: ErrorHandler, useClass: ErrorMetadataService },
        { provide: HTTP_INTERCEPTORS, useClass: UserListInterceptorService, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ],
    bootstrap: [App]
})
export class AppModule { }
