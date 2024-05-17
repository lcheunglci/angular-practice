import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {

  }

  storeRecipes() {
    const recipe = this.recipeService.getRecipes();
    this.http.put(process.env['URL'], recipes).subscribe(response =>
      console.log(response)
    );
  }

  fetchRecipes() {
    this.http.get<Recipe[]>(process.env['URL'])
      .pipe(map(recipes => {
        return recipes.map(recipe => { return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] } })
      }))
      .subscribe(recipes => {
        //console.log(recipes);
        this.recipeService.setRecipes(recipes);
      })
  }
}
