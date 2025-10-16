import { CanLoadHeavyGuard } from './guards/can-load-heavy.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartViewComponent } from './cart-view/cart-view';

const routes: Routes = [
  { path: '', component: CartViewComponent },
  { path: 'analytics',
    canMatch: [ CanLoadHeavyGuard ],
    loadComponent: () => import('./heavy-cart-analytics/heavy-cart-analytics').then(m => m.HeavyCartAnalyticsComponent)  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
