import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipes.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage implements OnInit {
  recipes: Recipe[] = [
    {
      id: 'r1', title: 'Cutlet', imageUrl: 'https://upload.wikimedia.org/wikipedia/thumb/7/72/Schnitzel', ingredients: ['Friend Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2', title: 'Spaghetti', imageUrl: 'https://upload.wikimedia.org/wikipedia/thumb/2/02/Spaghetti', ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ];

  constructor() { }

  ngOnInit() {
  }

}
