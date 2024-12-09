import { createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';

export interface AuthState {
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.setAuthenticated, (state) => ({
    ...state,
    isAuthenticated: true,
  })),
  on(AuthActions.setUnauthenticated, (state) => ({
    ...state,
    isAuthenticated: false,
  }))
);

export const getIsAuth = (state: AuthState) => state.isAuthenticated;
