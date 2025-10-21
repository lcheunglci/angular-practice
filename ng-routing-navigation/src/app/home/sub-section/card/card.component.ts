import { CurrencyPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CartButtonComponent } from '../../../shared-ui/cart-button/cart-button.component';
import { Pie } from '../../../models/pie';
// import { PieService } from '../../../services/pie.service';
import { Router } from '@angular/router';
import { DETAIL_ROUTE, PRODUCTS_ROUTE } from '../../../app.routes';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [CartButtonComponent, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  readonly pie = input.required<Pie>();
  // private readonly pieService = inject(PieService);
  private readonly router = inject(Router);

  selectPie(pieId: string) {
    // this.pieService.setSelectedPie(pieId);
    this.router.navigate([PRODUCTS_ROUTE, 'All Pies', DETAIL_ROUTE], {
      queryParams: { pieId },
      queryParamsHandling: 'merge',
    });
  }
}
