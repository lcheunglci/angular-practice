import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app';
import { NavBarComponent } from './components/nav-bar';
import { RegisterComponent } from "./components/sign-in";
import { SignInComponent } from "./components/sign-in";
import { LoadingComponent } from "./components/loading-spinner";
import { DataRepositoryService } from "./services/data-repository"
import { AccountMenuComponent } from "./components/account-menu";
import { CatalogComponent } from './catalog/catalog.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CatalogComponent,
    RegisterComponent,
    SignInComponent,
    LoadingComponent,
    AccountMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [DataRepositoryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
