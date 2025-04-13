import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// third party imports
import { NgxLoadingModule } from 'ngx-loading';
import { NgbDateAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { EntryEditorComponent } from './entry-editor/entry-editor.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { WorkoutApiService } from './services/workout-api.service';
import { FormsModule } from '@angular/forms';
import { DateStringAdapterService } from './date-string-adapter.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WorkoutsComponent,
    EntryEditorComponent,
    NavMenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxLoadingModule.forRoot({}),
    NgbModule,
  ],
  providers: [
    WorkoutApiService,
    { provide: NgbDateAdapter, useClass: DateStringAdapterService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
