import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.scss'],
})
export class RestaurantDetailComponent {
  @Input() data: any;
  @Input() isLoading = false;

  constructor() {}

  getCuisine(cuisines: any[]) {
    return cuisines.join(',');
  }
}
