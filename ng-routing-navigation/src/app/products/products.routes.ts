import { ActivatedRouteSnapshot } from '@angular/router';
import { DETAIL_ROUTE } from '../app.routes';
import { AllProductsComponent } from './all-products/all-products.component';
import { DetailCardComponent } from './product-detail/detail-card/detail-card.component';

export const PRODUCT_ROUTES = [
  {
    path: ':categoryId',
    component: AllProductsComponent,
    title: (routes: ActivatedRouteSnapshot) => {
      return `Bethany's - ${routes.params['categoryId']}`;
    },
  },
  // detail
  {
    path: `:category/${DETAIL_ROUTE}`,
    component: DetailCardComponent,
  },
];
