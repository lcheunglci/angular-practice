import { Component } from '@angular/core';
import { ProductSelection } from './products/product-selection/product-selection';
import { ReviewSearch } from './reviews/review-search/review-search';

@Component({
  selector: 'app-root',
  imports: [ProductSelection, ReviewSearch],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Acme Product Management';
}
