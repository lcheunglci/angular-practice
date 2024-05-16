import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RecipeService } from "../recipes/recipe.service";

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
}
