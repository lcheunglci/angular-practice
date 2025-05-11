import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/plaform-browser';
import { AppComponent } from './app.component';
import { applyContentTemplate } from '@angular-devkit/schematics';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  bootstrap: [applyContentTemplate],
})
export class AppModule {}
