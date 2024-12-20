import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
  ui: fromUi.UIState;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<State, any> = {
  ui: fromUi.uiReducer,
  auth: fromAuth.authReducer,
};

export const getUiState = createFeatureSelector<fromUi.UIState>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth);
