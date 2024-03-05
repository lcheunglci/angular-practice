import { Component, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css',
})
export class RecipeListComponent {
  @Output() recipeWasSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
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

  constructor() {}

  ngOnInit() {}

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
