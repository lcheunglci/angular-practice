import { createReducer, on } from '@ngrx/store';
import { UIActions } from './ui.actions';

export interface UIState {
  isLoading: boolean;
}

const initialState: UIState = {
  isLoading: false,
};

export const uiReducer = createReducer(
  initialState,
  on(UIActions.startLoading, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(UIActions.stopLoading, (state) => ({
    ...state,
    isLoading: false,
  }))
);

export const getIsLoading = (state: UIState) => state.isLoading;
