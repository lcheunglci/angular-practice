import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { isPizzaEnabledCanActivateGuard } from './is-pizza-enabled-can-activate-guard';
import { isPizzaEnabledCanActivateChildGuard } from './is-pizza-enabled-can-activate-child-guard';
import { isPizzaEnabledCanMatchGuard } from './is-pizza-enabled-can-match-guard';
import { NewHomeComponent } from './home/new-home/new-home.component';
import { isUserAuthenticatedCanMatchGuard } from './is-user-authenticated-can-match-guard';
import { leavePizzaCanDeactivateGuard } from './leave-pizza-can-deactivate-guard';
import { AboutComponent } from './about/about.component';

export const HOME_ROUTE = 'home';
export const NEW_HOME_ROUTE = 'new-home';
export const PRODUCTS_ROUTE = 'products';
export const DETAIL_ROUTE = 'detail';
export const LOGIN_ROUTE = 'login';
export const PIZZA_ROUTE = 'pizza';
export const CONTACT_ROUTE = 'contact';
export const CART_ROUTE = 'cart';
export const ABOUT_ROUTE = 'about';
export const ADMIN_ROUTE = 'admin';
export const NOT_ADMIN_ROUTE = 'not-admin';

export const routes: Routes = [
  {
    path: '',
    redirectTo: HOME_ROUTE,
    pathMatch: 'full',
  },
  // home
  {
    path: HOME_ROUTE,
    canMatch: [isPizzaEnabledCanMatchGuard],
    component: NewHomeComponent,
    title: "Bethany's - Home",
  },
  {
    path: HOME_ROUTE,
    component: HomeComponent,
    title: "Bethany's - Home",
  },
  // products
  {
    path: PRODUCTS_ROUTE,
    loadComponent: () =>
      import('./products/wrapper.component').then((m) => m.WrapperComponent),
    loadChildren: () =>
      import('./products/products.routes').then((m) => m.PRODUCT_ROUTES),
    title: "Bethany's - Shop",
  },

  // login
  {
    path: LOGIN_ROUTE,
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    title: "Bethany's - Login",
  },
  {
    path: PIZZA_ROUTE,
    canActivate: [isPizzaEnabledCanActivateGuard],
    // canMatch: [isUserAuthenticatedCanMatchGuard, isPizzaEnabledCanMatchGuard],
    // canActivateChild: [isPizzaEnabledCanActivateChildGuard],

    loadComponent: () =>
      import('./pizza/pizza.component').then((m) => m.PizzaComponent),
    children: [
      {
        // path: 'form',
        path: '',
        // canMatch: [isUserAuthenticatedCanMatchGuard],
        canDeactivate: [leavePizzaCanDeactivateGuard],
        loadComponent: () =>
          import('./pizza/pizza-form/pizza-form.component').then(
            (m) => m.PizzaFormComponent
          ),
      },
      {
        // path: 'not-found',
        path: '',
        loadComponent: () =>
          import('./pizza/pizza-not-found/pizza-not-found.component').then(
            (m) => m.PizzaNotFoundComponent
          ),
      },
    ],
    title: "Bethany's - Pizza",
  },
  // contact
  {
    path: CONTACT_ROUTE,
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
    title: "Bethany's - Contact",
  },
  // cart
  {
    path: CART_ROUTE,
    loadComponent: () =>
      import('./cart/cart-modal/cart-modal.component').then(
        (m) => m.CartModalComponent
      ),
    outlet: 'cartModal',
    title: "Bethany's - Cart",
  },
  // about
  {
    path: ABOUT_ROUTE,
    title: "Bethany's - About",
    // loadComponent: () =>
    //   import('./about/about.component').then((m) => m.AboutComponent),
    loadComponent: () =>
      import('./shared-ui/image-wrapper/image-wrapper.component').then(
        (m) => m.ImageWrapperComponent
      ),
    data: {
      imageUrl: '../../assets/images/about.png',
      routePath: ABOUT_ROUTE,
      component: AboutComponent,
    },
  },
  {
    path: ADMIN_ROUTE,
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
    title: "Bethany's - Admin",
  },
  {
    path: NOT_ADMIN_ROUTE,
    loadComponent: () =>
      import('./admin/not-admin/not-admin.component').then(
        (m) => m.NotAdminComponent
      ),
    title: "Bethany's - Admin",
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
    title: "Bethany's - Not Found",
  },
];
