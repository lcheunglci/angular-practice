import { DETAIL_ROUTE } from '../app.routes';
import { AllProductsComponent } from './all-products/all-products.component';
import { DetailCardComponent } from './product-detail/detail-card/detail-card.component';

export const PRODUCT_ROUTES = [
  {
    path: '',
    component: AllProductsComponent,
  },
  // detail
  {
    path: DETAIL_ROUTE,
    component: DetailCardComponent,
  },
];
