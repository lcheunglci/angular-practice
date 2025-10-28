import { Component } from '@angular/core';
import { SubSectionComponent } from '../sub-section/sub-section.component';
import { LogoBannerComponent } from 'src/app/shared-ui/logo-banner/logo-banner.component';
import { PIZZA_ROUTE } from 'src/app/app.routes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-home',
  imports: [SubSectionComponent, LogoBannerComponent, RouterLink],
  templateUrl: './new-home.component.html',
  styleUrl: './new-home.component.scss'
})
export class NewHomeComponent {
  protected readonly PIZZA_ROUTE = PIZZA_ROUTE;
}
