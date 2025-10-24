import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllProductsComponent } from './products/all-products/all-products.component';
import { DetailCardComponent } from './products/product-detail/detail-card/detail-card.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { WrapperComponent } from './products/wrapper.component';

export const HOME_ROUTE = 'home';
export const PRODUCTS_ROUTE = 'products';
export const DETAIL_ROUTE = 'detail';
export const LOGIN_ROUTE = 'login';
export const CONTACT_ROUTE = 'contact';
export const CART_ROUTE = 'cart';
export const ABOUT_ROUTE = 'about';

export const routes: Routes = [
  {
    path: '',
    redirectTo: HOME_ROUTE,
    pathMatch: 'full',
  },
  // home
  {
    path: HOME_ROUTE,
    component: HomeComponent,
  },
  // products
  {
    path: `${PRODUCTS_ROUTE}/:categoryId`,
    component: WrapperComponent,
    children: [
      {
        path: '',
        component: AllProductsComponent,
      },
      // detail
      {
        path: DETAIL_ROUTE,
        component: DetailCardComponent,
      },
    ],
  },

  // login
  {
    path: LOGIN_ROUTE,
    component: LoginComponent,
  },
  // contact
  {
    path: CONTACT_ROUTE,
    component: ContactComponent,
  },
  // cart
  {
    path: CART_ROUTE,
    component: CartComponent,
  },
  // about
  {
    path: ABOUT_ROUTE,
    component: AboutComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
