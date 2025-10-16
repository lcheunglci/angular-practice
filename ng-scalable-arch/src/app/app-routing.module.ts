import { NgModule } from '@angular/core';
import { PreloadingStrategy, Route, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { Observable, of } from 'rxjs';

export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      return load(); // Preload if 'preload' data property is true
    }
    return of(null); // Do not preload
  }


}

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', loadComponent: () => import('./product/product-list/product-list').then(m => m.ProductListComponent) },
  { path: 'products/:id', loadComponent: () => import('./product/product-detail/product-detail').then(m => m.ProductDetailComponent) },
  { path: 'user', loadChildren: () => import('@shared/user').then(m => m.UserModule) },
  { path: 'cart', loadChildren: () => import('@scale/cart').then(m => m.CartModule), data: { preload: true } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: CustomPreloadingStrategy})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
