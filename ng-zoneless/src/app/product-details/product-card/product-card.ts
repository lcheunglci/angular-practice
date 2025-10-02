import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Product } from '../product-details-data';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  // product?: Product; // 1. Before
  // product = signal<Product | undefined>(undefined); // 2. Signals
  product = input<Product>(); // 3. Inputs
}
