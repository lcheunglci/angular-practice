import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavBarComponent } from "./nav-bar.component";
import { AccountMenuComponent } from "./account-menu.component";
import { UserRepositoryService } from '../services/user-repository.service';

@NgModule({
  imports: [CommonModule, RouterModule],
  exports: [NavBarComponent, AccountMenuComponent],
  declarations: [NavBarComponent, AccountMenuComponent],
  providers: [UserRepositoryService]
})
export class CoreModule {

};