import { Component, model, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from '../../../../libs/shared/services/src/lib/shared/product.service';
import { CartService } from '../../../../libs/shared/services/src/lib/shared/cart.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, MatCardModule, MatButton],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
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
