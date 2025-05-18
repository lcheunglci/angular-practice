import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatGridListModule, MatMenuModule } from '@angular/material';
import { WidgetFxModule } from '../widget-fx/widget-fx.module';
import { LicenseConfigService } from './license-config.service';




@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatGridListModule,
    MatMenuModule,
    MatGridListModule,

    WidgetFxModule
  ],
  providers: [LicenseConfigService],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
  showGrid = false;
}
