import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    const url: string = process.env['URL'];
    this.http.put(url, recipes).subscribe(response =>
      console.log(response)
    );
  }

  fetchRecipes() {
    const url: string = process.env['URL'];
    return this.http.get<Recipe[]>(url)
      .pipe(
        map(recipes => {
          return recipes.map(
            recipe => {
              return {
                ...recipe,
                ingredients: recipe.ingredients ? recipe.ingredients : []
              }
            });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );

  }
}
