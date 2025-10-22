import { DETAIL_ROUTE } from './../../app.routes';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { PieService } from '../../services/pie.service';
import { BreadcrumbsComponent } from '../../shared-ui/breadcrumbs/breadcrumbs.component';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/pie';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.scss',
  imports: [BreadcrumbsComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllProductsComponent {
  readonly pieService = inject(PieService);
  pies = this.pieService.filteredPies;
  categoryId = input<Category>('All Pies');

  protected readonly DETAIL_ROUTE = DETAIL_ROUTE;

  // selectPie(id: string) {
  //   this.pieService.setSelectedPie(id);
  // }

  categoryEffect = effect(() => {
    this.pieService.setSelectedCategory(this.categoryId());
  });
}
