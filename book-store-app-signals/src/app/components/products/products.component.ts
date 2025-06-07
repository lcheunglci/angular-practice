import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  product: any;

  constructor(public productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts();
  }

  orderProductNow(product: any) {
    console.log('Product to be ordered: ', product);
  }

  removeProductNow(id: number) {
    console.log('Product to be removed: ', id);
  }
}
