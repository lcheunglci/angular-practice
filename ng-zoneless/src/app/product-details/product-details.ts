import { signal } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ProductCardComponent } from './product-card/product-card';
import { Product, PRODUCTS } from './product-details-data';
import { StockBadgeComponent } from './stock-badge/stock-badge';

type WidgetType = 'card' | 'badge';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsComponent implements OnInit {
  private container = viewChild.required('viewContainer', {
    read: ViewContainerRef,
  });
  protected widget: WidgetType = 'card';
  private readonly products: Product[] = PRODUCTS;
  private selectedIndex = 0;
  private componentRef!: ComponentRef<
    ProductCardComponent | StockBadgeComponent
  >;

  ngOnInit() {
    this.createView();
  }

  protected switchView(type: string) {
    this.widget = type as WidgetType;
    this.createView();
  }

  protected prev() {
    const count = this.products.length;
    this.selectedIndex = (this.selectedIndex + count - 1) % count;
    this.setProductData();
  }

  protected next() {
    this.selectedIndex = (this.selectedIndex + 1) % this.products.length;
    this.setProductData();
  }

  private createView() {
    this.container().clear();
    this.widget === 'card'
      ? (this.componentRef =
          this.container().createComponent(ProductCardComponent))
      : (this.componentRef =
          this.container().createComponent(StockBadgeComponent));
    this.setProductData();
  }

  private setProductData() {
    const product = this.products[this.selectedIndex];

    // 1. --------------------------------------------- Before
    // this.componentRef.instance.product = product;

    // 2. --------------------------------------------- Signals
    // this.componentRef.instance.product.apply(product);

    // 3. --------------------------------------------- Inputs
    this.componentRef.setInput('product', product);

    console.log('Product:', this.componentRef.instance.product);
  }
}
