import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Product } from '../product-details-data';

@Component({
  selector: 'app-stock-badge',
  templateUrl: './stock-badge.html',
  styleUrls: ['./stock-badge.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockBadgeComponent {
  // product?: Product; // 1. Before
  product = signal<Product | undefined>(undefined); // 2. Signals
  // product = input<Product>(); // 3. Inputs
}
