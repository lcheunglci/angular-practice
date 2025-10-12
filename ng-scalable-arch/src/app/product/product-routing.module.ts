import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductListComponent } from "./product-list/product-list";
import { ProductDetailComponent } from "./product-detail/product-detail";

const routes: Routes = [

  {
    path: '', component: ProductListComponent,
  },
  {
    path: ':id', component: ProductDetailComponent
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule {}
