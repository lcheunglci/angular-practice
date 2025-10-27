import { Router, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { inject } from '@angular/core';
import { FeatureFlagService } from './services/feature-flag.service';
import { map } from 'rxjs';

export const HOME_ROUTE = 'home';
export const PRODUCTS_ROUTE = 'products';
export const DETAIL_ROUTE = 'detail';
export const LOGIN_ROUTE = 'login';
export const PIZZA_ROUTE = 'pizza';
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
    loadComponent: () =>
      import('./products/wrapper.component').then((m) => m.WrapperComponent),
    loadChildren: () =>
      import('./products/products.routes').then((m) => m.PRODUCT_ROUTES),
  },

  // login
  {
    path: LOGIN_ROUTE,
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: PIZZA_ROUTE,
    canActivate: [
      () => {
        // return true; // Change to false to see the pizza-not-found component
        const router = inject(Router);
        const flagService = inject(FeatureFlagService);

        return flagService.isPizzaFeatureEnabled$.pipe(
          map((isEnabled) => {
            return isEnabled ? true : router.createUrlTree([HOME_ROUTE]);
          })
        );
      },
    ],

    loadComponent: () =>
      import('./pizza/pizza.component').then((m) => m.PizzaComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pizza/pizza-form/pizza-form.component').then(
            (m) => m.PizzaFormComponent
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('./pizza/pizza-not-found/pizza-not-found.component').then(
            (m) => m.PizzaNotFoundComponent
          ),
      },
    ],
  },
  // contact
  {
    path: CONTACT_ROUTE,
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  // cart
  {
    path: CART_ROUTE,
    loadComponent: () =>
      import('./cart/cart-modal/cart-modal.component').then(
        (m) => m.CartModalComponent
      ),
    outlet: 'cartModal',
  },
  // about
  {
    path: ABOUT_ROUTE,
    loadComponent: () =>
      import('./about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
