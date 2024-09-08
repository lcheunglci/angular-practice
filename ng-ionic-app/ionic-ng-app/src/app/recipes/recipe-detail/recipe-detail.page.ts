import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../recipes.model';
import { RecipesService } from '../recipes.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.page.html',
  styleUrls: ['./recipe-detail.page.scss'],
})
export class RecipeDetailPage implements OnInit {
  loadedRecipe: Recipe;

  constructor(private activedRoute:ActivatedRoute, private recipesService:RecipesService) { }

  ngOnInit() {
    this.activedRoute.paramMap.subscribe(
      paramMap => {
        if (!paramMap.has('recipeId')) {
          // redirect
          return;
        }
        const recipeId = paramMap.get('recipeId');
        this.loadedRecipe = this.recipesService.getRecipe(recipeId);
      }
    )
  }

}
