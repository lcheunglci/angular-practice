import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../../models/book.model';
import { Order } from '../../models/order.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-new',
  templateUrl: './product-new.component.html',
  styleUrls: ['./product-new.component.css'],
})
export class ProductNewComponent {
  order: Order = {
    bookTitle: '',
    authorName: '',
    quantity: 0,
    deliveryAddress: '',
  };

  product = {
    title: '',
    price: null,
    description: '',
    image: '',
    category: '',
  };

  categories = [
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing",
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {}

  addProduct(): void {
    console.log(this.product);
    this.productService.addProduct(this.product).subscribe((data) => {
      console.log('Product added [product]: ', this.product);
    });
  }
}
