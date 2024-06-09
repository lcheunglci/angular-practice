// import { createReducer, on } from "@ngrx/store";
import { Action } from "@ngrx/store";
import { CounterActions, DECREMENT, DecrementAction, INCREMENT, IncrementAction } from "./counter.actions";
// import { decrement, increment } from "./counter.actions";

const initialState = 0;

// export const counterReducer = createReducer(
//   initialState,
//   on(increment, (state) => state + 1),
//   on(decrement, (state) => state - 1)
// );

export function counterReducer(state = initialState, action: CounterActions | Action) {
  if (action.type === INCREMENT) {
    return state + (action as IncrementAction).value;
  }
  if (action.type === DECREMENT) {
    return state - (action as DecrementAction).value;
  }
  return state;
}

