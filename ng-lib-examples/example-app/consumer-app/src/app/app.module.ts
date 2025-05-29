import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularRatingComponent } from 'angular-rating';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, AngularRatingComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
