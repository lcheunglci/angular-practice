import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ProductLoggingService } from '@mystore/store' causes a circular dependency and eslist should block

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
