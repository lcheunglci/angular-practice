import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { FormsModule } from "@angular/forms";
import { CoreModule } from "../core.module";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [
    AuthComponent,
  ],
  imports: [
    CoreModule,
    FormsModule,
    RouterModule.forChild([
      { path: 'auth', component: AuthComponent }
    ]),
    SharedModule
  ]
})
export class AuthModule {

}
