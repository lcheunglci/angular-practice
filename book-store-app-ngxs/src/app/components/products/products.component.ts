import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { LoadProducts } from '../../state-ngxs/actions/product.actions';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  // products: any[] = [];
  products$!: Observable<any>;
  product: any;

  constructor(
    private productService: ProductService,
    private store: Store,
    private router: Router
  ) {
    this.products$ = this.store.select((state) => state.products.products);
  }

  ngOnInit(): void {
    // this.productService.getProducts().subscribe((data) => {
    //   this.products = data;
    //   console.log('Products: ', this.products);
    // });
    this.store.dispatch(new LoadProducts());
  }

  orderProductNow(product: any) {
    console.log('Product to be ordered: ', product);
  }

  removeProductNow(id: number) {
    console.log('Product to be removed: ', id);
  }
}
