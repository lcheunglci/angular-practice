import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { HomeComponent } from './home/home';
// Add other components/ modules

@NgModule({
  declarations: [AppComponent, HomeComponent /* others */],
  imports: [
    BrowserModule, AppRoutingModule, BrowserAnimationsModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,
    /* ProductModule, UserModule, CartModule */
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
