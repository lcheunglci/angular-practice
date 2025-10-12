import { NgModule } from "@angular/core";
import { ProductDetailComponent } from "./product-detail/product-detail";
import { ProductListComponent } from "./product-list/product-list";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { ProductRoutingModule } from "./product-routing.module";

@NgModule({
  declarations: [ProductDetailComponent, ProductListComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ProductRoutingModule
  ]
})
export class ProductModule {}
