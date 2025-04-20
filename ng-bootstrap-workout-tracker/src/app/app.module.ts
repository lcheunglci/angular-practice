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
import { WorkoutsApiService } from './services/workouts-api.service';
import { FormsModule } from '@angular/forms';
import { DateStringAdapterService } from './date-string-adapter.service';
import { PerformanceTargetModalComponent } from './performance-target-modal/performance-target-modal.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WorkoutsComponent,
    EntryEditorComponent,
    NavMenuComponent,
    PerformanceTargetModalComponent,
    AdminComponent,
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
    WorkoutsApiService,
    { provide: NgbDateAdapter, useClass: DateStringAdapterService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
