import { NgModule } from "@angular/core";
import { ShoppingEditComponent } from "./shopping-edit/shopping-edit.component";
import { ShoppingListComponent } from "./shopping-list.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: 'shopping-list', component: ShoppingListComponent },
    ])
  ]
})
export class ShoppingListModule {

}
