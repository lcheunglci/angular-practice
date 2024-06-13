import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shoping-list.service';
import { Observable, Subscription } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ ingredients: Ingredient[] }>;
  // private igChangeSub: Subscription;

  constructor(
    private slService: ShoppingListService,
    private logginService: LoggingService,
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) { }

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.igChangeSub = this.slService.ingredientsChanged.subscribe(
    //  (ingredients: Ingredient[]) => {
    //    this.ingredients = ingredients;
    //  });
    this.logginService.printLog("Hello from ShoppingListComponent ngOnInit");
  }
  onEditItem(index: number) {
    this.slService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    // this.igChangeSub.unsubscribe();
  }

}
