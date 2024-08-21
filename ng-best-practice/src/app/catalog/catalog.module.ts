import { NgModule } from '@angular/core';
import { CatalogComponent } from './catalog.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule, SharedModule],
  declarations: [CatalogComponent],
  exports: [],
  providers: [],
})
export class CatalogModule {}
