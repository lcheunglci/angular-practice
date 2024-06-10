import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DECREMENT, DecrementAction, INCREMENT, IncrementAction } from "./counter.actions";
import { tap } from "rxjs";

export class CounterEffects {
  saveCount = createEffect(() => this.actions$.pipe(
    // ofType(IncrementAction, DecrementAction),
    ofType(INCREMENT, DECREMENT),
    tap((action) => {
      console.log(action);
      localStorage.setItem('count', action.value.toString());
    })
  ), { dispatch: false });

  constructor(private actions$: Actions) { }
}
