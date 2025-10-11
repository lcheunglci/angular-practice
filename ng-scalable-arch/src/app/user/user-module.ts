import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { UserProfileComponent } from './user-profile/user-profile';
import { LoginComponent } from './login/login';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [UserProfileComponent, LoginComponent],
  imports: [MatFormFieldModule, MatCardModule, CommonModule, FormsModule, UserRoutingModule],
})
export class UserModule { }
