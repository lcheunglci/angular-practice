import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlacesPage } from './places.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: PlacesPage,
    children: [
      {
        path: 'discover',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./discover/discover.module').then(
                (m) => m.DiscoverPageModule
              ),
            // loadChildren: './discover/discover.module#DiscoverPageModule'
          },
          {
            path: ':placeId',
            loadChildren: () =>
              import('./discover/place-detail/place-detail.module').then(
                (m) => m.PlaceDetailPageModule
              ),
            // loadChildren: './discover/place-detail/place-detail.module#PlaceDetailPageModule'
          },
        ],
      },
      {
        path: 'offers',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./offers/offers.module').then((m) => m.OffersPageModule),
            // loadChildren: './offers/offers.module#OffersPageModule
          },
          {
            path: 'new',
            loadChildren: () =>
              import('./offers/new-offer/new-offer.module').then(
                (m) => m.NewOfferPageModule
              ),
            // loadChildren: './offers/new-offer/new-offer.module#NewOfferPageModule
          },
          {
            path: 'edit/:placeId',
            loadChildren: () =>
              import('./offers/edit-offer/edit-offer.module').then(
                (m) => m.EditOfferPageModule
              ),
            // loadChildren: './offers/edit-offer/edit-offer.module#EditOfferPageModule
          },
          {
            path: ':placeId',
            loadChildren: () =>
              import('./offers/offer-bookings/offer-bookings.module').then(
                (m) => m.OfferBookingsPageModule
              ),
            // loadChildren: './offers/offer-bookings/offer-bookings.module#OfferBookingsPageModule
          },
        ],
      },
      {
        path: '',
        redirectTo: '/places/tabs/discover',
        pathMatch: 'full'
      },

    ],
  },
  {
    path: '',
    redirectTo: '/places/tabs/discover',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlacesPageRoutingModule {}
