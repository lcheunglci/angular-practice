import { ActionReducer, Action } from '@ngrx/store';

export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action: Action) => {
    const newState = reducer(state, action);

    console.group('Logger Meta-Reducer');
    console.log('Previous state: ', state);
    console.log('Action: ', action);
    console.log('New state: ', newState);
    console.groupEnd();

    return newState;
  };
}
