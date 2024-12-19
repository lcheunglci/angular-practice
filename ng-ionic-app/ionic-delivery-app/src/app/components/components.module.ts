import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RestaurantComponent } from './restaurant/restaurant.component';

@NgModule({
  declarations: [RestaurantComponent],
  imports: [IonicModule, CommonModule],
  exports: [RestaurantComponent],
})
export class ComponentsModule {}
