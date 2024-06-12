//import { createReducer } from "@ngrx/store";

import { Action } from "@ngrx/store";
import { Ingredient } from "../shared/ingredient.model";
import { ADD_INCREDIENT } from "./shopping-list.actions";

//export const shoppingListReducer = createReducer(

//)
//
//

const initialState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ]
}

export function shoppingListReducer(state = initialState, action: Action) {
  switch (action.type) {
    case ADD_INCREDIENT:
      return { ...state, ingredients: [...state.ingredients, action] };
  }
  return state;
}
