import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartFormComponent } from '../cart-form/cart-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-modal',
  imports: [CartFormComponent],
  templateUrl: './cart-modal.component.html',
  styleUrl: './cart-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartModalComponent {
  router = inject(Router);

  close(): void {
    // navigate using the router to clear the cart outlet
    this.router.navigate([{ outlets: { cartModal: null } }], {
      queryParamsHandling: 'merge',
    });
  }
}
