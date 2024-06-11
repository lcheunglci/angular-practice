import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DECREMENT, DecrementAction, INCREMENT, IncrementAction, SET, SetAction } from "./counter.actions";
import { of, switchMap, tap, withLatestFrom } from "rxjs";
import { Injectable } from "@angular/core";
import { INIT, Store } from "@ngrx/store";
import { selectCount } from "./counter.selectors";

@Injectable()
export class CounterEffects {
  loadCount = createEffect(() => this.actions$.pipe(
    ofType(INIT),
    switchMap(() => {
      const storedCounter = localStorage.getItem('count');
      if (storedCounter) {
        return of(new SetAction({ value: +storedCounter }));
      }

      return of(new SetAction({ value: 0 }))
    })
  ))


  saveCount = createEffect(() => this.actions$.pipe(
    // ofType(IncrementAction, DecrementAction),
    ofType(INCREMENT, DECREMENT, SET),
    withLatestFrom(this.store.select(selectCount)),
    tap(([action, counter]) => {
      console.log(action);

      localStorage.setItem('count', counter.toString());
    })
  ), { dispatch: false });

  constructor(private actions$: Actions, private store: Store<{ counter: number }>) { }
}
