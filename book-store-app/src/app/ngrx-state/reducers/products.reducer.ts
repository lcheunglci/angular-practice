import { createReducer, on } from '@ngrx/store';
import * as ProductActions from '../actions/product.actions';

export const initialState: any[] = [];

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProductsSuccess, (state, { products }) => products),
  on(ProductActions.loadProductsFailure, (state, { error }) => state)
);
