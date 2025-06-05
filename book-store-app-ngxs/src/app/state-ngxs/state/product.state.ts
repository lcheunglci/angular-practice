import {
  LoadProducts,
  LoadProductsFailure,
  LoadProductsSuccess,
} from './../actions/product.actions';
import { LoadProducts } from '../actions/product.actions';
import { ProductService } from './../../services/product.service';
import { Action, State, StateContext } from '@ngxs/store';
import { catchError, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ProductStateModel {
  products: any[];
  error: any;
  loading: boolean;
}

@State<ProductStateModel>({
  name: 'products',
  defaults: {
    products: [],
    loading: false,
    error: null,
  },
})
@Injectable()
export class ProductState {
  constructor(private productService: ProductService) {}

  @Action(LoadProducts)
  LoadProducts(ctx: StateContext<ProductStateModel>) {
    ctx.patchState({ loading: true });

    return this.productService.getProducts().pipe(
      tap((result) => {
        ctx.dispatch(new LoadProductsSuccess(result));
      }),
      catchError((error) => {
        ctx.dispatch(new LoadProductsFailure(error));
        return of(error);
      })
    );
  }

  @Action(LoadProductsSuccess)
  loadProductsSuccess(
    ctx: StateContext<ProductStateModel>,
    action: LoadProductsSuccess
  ) {
    ctx.patchState({
      products: action.payload,
      loading: false,
    });
  }

  @Action(LoadProductsFailure)
  loadProductsFailure(
    ctx: StateContext<ProductStateModel>,
    action: LoadProductsFailure
  ) {
    ctx.patchState({
      error: action.payload,
      loading: false,
    });
  }
}
