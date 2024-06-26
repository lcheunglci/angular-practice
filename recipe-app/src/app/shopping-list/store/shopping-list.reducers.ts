//import { createReducer } from "@ngrx/store";

import { Ingredient } from "../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions";

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

export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) {
  switch (action.type) {
    case ShoppingListActions.ADD_INCREDIENT:
      return {
        ...state,
        ingredients:
          [...state.ingredients, action.payload]
      };
    default:
      return state;
  }
}
