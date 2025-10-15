import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing-module';
import { CartViewComponent } from './cart-view/cart-view';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [CartViewComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    MatCardModule,
    MatIconModule
  ]
})
export class CartModule { }
