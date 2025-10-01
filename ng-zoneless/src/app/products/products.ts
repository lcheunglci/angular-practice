import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map } from 'rxjs';
import {
  ProductLarge,
  PRODUCTS_LARGE,
  PRODUCTS_SMALL,
  ProductSmall,
} from './products.data';
// import { AsyncPipe } from '@angular/common';

type Layout = 'handset' | 'web';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrl: './products.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // imports: [AsyncPipe], // 2.
})
export class ProductsComponent {
  protected productsLarge: ProductLarge[] = PRODUCTS_LARGE;
  protected productsSmall: ProductSmall[] = PRODUCTS_SMALL;

  // 1. --------------------------------------------- Before
  // protected layout: Layout = 'web';

  private readonly breakpointObserver = inject(BreakpointObserver);

  // 1. --------------------------------------------- Before
  // constructor() {
  //     this.breakpointObserver
  //         .observe([Breakpoints.XSmall])
  //         .pipe(
  //             takeUntilDestroyed(),
  //             distinctUntilChanged()
  //         ).subscribe(state => {
  //             if (state.breakpoints[Breakpoints.XSmall]) {
  //               this.layout = 'handset';
  //             }
  //             this.layout = 'web';
  //         });
  // }

  // 2. --------------------------------------------- AsyncPipe
  // protected layout = this.breakpointObserver.observe([Breakpoints.XSmall]).pipe(
  //   map((state) => {
  //     if (state.matches) {
  //       return 'handset';
  //     }
  //     return 'web';
  //   }),
  //   distinctUntilChanged()
  // );

  // 3. --------------------------------------------- Signals
  protected layoutObserver = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(
      map((state) => {
        if (state.matches) {
          return 'handset';
        }
        return 'web';
      }),
      distinctUntilChanged()
    );

  readonly layout = toSignal(this.layoutObserver, { initialValue: 'web' });
}
