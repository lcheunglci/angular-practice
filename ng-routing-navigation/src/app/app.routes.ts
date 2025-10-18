import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AllProductsComponent } from './products/all-products/all-products.component';
import { DetailCardComponent } from './products/product-detail/detail-card/detail-card.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  // home
  {
    path: 'home',
    component: HomeComponent,
  },
  // products
  {
    path: 'products',
    component: AllProductsComponent,
  },
  // detail
  {
    path: 'detail',
    component: DetailCardComponent,
  },
  // login
  {
    path: 'login',
    component: LoginComponent,
  },
  // contact
  {
    path: 'contact',
    component: ContactComponent,
  },
  // cart
  {
    path: 'cart',
    component: CartComponent,
  },
  // about
  {
    path: 'about',
    component: AboutComponent,
  },
];
