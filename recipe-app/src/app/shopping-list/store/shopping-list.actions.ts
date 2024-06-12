import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";

export const ADD_INCREDIENT = 'ADD_INCREDIENT';

export class AddIngredient implements Action {
  readonly type = ADD_INCREDIENT;
  payload: Ingredient;
}
