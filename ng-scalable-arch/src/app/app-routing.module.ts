import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', loadComponent: () => import('./product/product-list/product-list').then(m => m.ProductListComponent) },
  { path: 'products/:id', loadComponent: () => import('./product/product-detail/product-detail').then(m => m.ProductDetailComponent) },
  { path: 'user', loadChildren: () => import('./user/user-module').then(m => m.UserModule) },
  { path: 'cart', loadChildren: () => import('./cart/cart-module').then(m => m.CartModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
