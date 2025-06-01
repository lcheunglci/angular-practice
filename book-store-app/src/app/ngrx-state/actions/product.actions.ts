import { createAction, props } from '@ngrx/store';

export const loadProducts = createAction('[Product] Load products');
export const loadProductsSuccess = createAction(
  '[Product] Load products success',
  props<{ products: any[] }>()
);
export const loadProductsFailure = createAction(
  '[Product] Load products failed',
  props<{ error: any }>()
);
