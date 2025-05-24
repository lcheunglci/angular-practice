import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BooksRoutes } from './books.routing';
import { allContainerComponents } from './container';
import { allPresentationalComponents } from './presentational';
import { AngularRatingComponent } from '../../../projects/angular-rating/src/public-api';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(BooksRoutes),
    AngularRatingComponent,
  ],
  declarations: [...allContainerComponents, ...allPresentationalComponents],
})
export class BooksModule {}
