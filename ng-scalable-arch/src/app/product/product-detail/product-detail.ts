import { Component, model, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../shared/services/product.service';
import { CartService } from '../../shared/services/cart.service';
import {  MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product = model<Product | undefined>();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productService.getProduct(id).subscribe(p => this.product.update(() => p));
    }
  }

  addToCart() {
    const product = this.product();
    if (product) {
      this.cartService.addToCart(product);
    }
  }

  viewDetail(id: number | undefined) {
    if (typeof id === 'number')
    this.router.navigate(['/products', id]);
  }
}
