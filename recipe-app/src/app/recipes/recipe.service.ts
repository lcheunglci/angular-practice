import { EventEmitter } from "@angular/core";
import { Recipe } from "./recipe.model";

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://unsplash.com/photos/uQs1802D0CQ/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzA4NzU5NDUzfA&force=true&w=640'
    ),
    new Recipe(
      'Another Test Recipe',
      'This is simply another test',
      'https://unsplash.com/photos/uQs1802D0CQ/download?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzA4NzU5NDUzfA&force=true&w=640'
    ),
  ];

  getRecipes() {
    return this.recipes.slice();
  }


}
