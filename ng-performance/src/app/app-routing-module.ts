import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent),
  },
  {
    path: 'players',
    loadComponent: () => import('./pages/players/players.component').then(c => c.PlayersComponent),
    data: { preload: true }
  },
  {
    path: 'leaderboards',
    loadComponent: () => import('./pages/leaderboards/leaderboards.component').then(c => c.LeaderboardsComponent),
  },
  {
    path: 'messages',
    loadComponent: () => import('./pages/messages/messages.component').then(c => c.MessagesComponent),
  },
  {
    path: '',
    redirectTo: `/players`,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/players'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
