import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { CartService, Product } from '@shared/services';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-heavy-cart-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './heavy-cart-analytics.html',
  styleUrls: ['./heavy-cart-analytics.css']
})
export class HeavyCartAnalyticsComponent {
  private cartService = inject(CartService);
  items = toSignal(this.cartService.getItems(), { initialValue: [] as Product[] });

  // Simulate heavy processing with a computed signal
  analyticsData = computed(() => {
    const items = this.items();
    let totalWeight = 0;
    for (let i = 0; i < 1000000; i++) { // Simulate heavy loop
      totalWeight += items.reduce((sum, item) => sum + item.price, 0) / items.length || 0;
    }
    return { averagePrice: totalWeight / 1000000, itemCount: items.length };
  });

  constructor() {
    console.log('Heavy processing initialized'); // Log for demo
  }
}
