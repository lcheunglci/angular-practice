import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Product } from '../../shared/services/product.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.html',
  standalone: false,
  styleUrls: ['./cart-view.scss']
})
export class CartViewComponent implements OnInit {
  items: Product[] = [];
  total: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getItems().subscribe(i => this.items = i);
    this.cartService.getTotal().subscribe(t => this.total = t);
  }

  removeItem(id: number) {
    this.cartService.removeFromCart(id);
  }
}
