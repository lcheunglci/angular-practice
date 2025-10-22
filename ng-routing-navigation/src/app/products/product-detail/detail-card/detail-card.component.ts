import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PieService } from '../../../services/pie.service';
import { CartService } from '../../../services/cart.service';
import { CartButtonComponent } from '../../../shared-ui/cart-button/cart-button.component';

@Component({
  selector: 'app-detail-card',
  templateUrl: './detail-card.component.html',
  styleUrls: ['./detail-card.component.scss'],
  imports: [CartButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailCardComponent {
  protected readonly pieService = inject(PieService);
  protected readonly cartService = inject(CartService);
}
