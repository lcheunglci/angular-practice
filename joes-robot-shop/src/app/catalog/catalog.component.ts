import { Component } from '@angular/core';
import { IProduct } from './product.model';

@Component({
  selector: 'bot-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  product: IProduct;

  constructor() {
    this.product = {
      id: 2,
      description: "A friendly robot head with 2 eyes and a smile -- great for domestic use",
      name: "Friendly Bot",
      imageName: "head-friendly.png",
      category: "Heads",
      price: 945.0,
      discount: 0.2
    }
    
  }
}
