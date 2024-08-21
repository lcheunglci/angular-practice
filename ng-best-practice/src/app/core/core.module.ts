import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavBarComponent } from "./nav-bar.component";
import { AccountMenuComponent } from "./account-menu.component";

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [NavBarComponent, AccountMenuComponent],
  declarations: [NavBarComponent, AccountMenuComponent],
  providers: []
})
export class CoreModule {

};