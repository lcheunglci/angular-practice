import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoadingSpinnerComponent } from "./loading-spinner.component";

@NgModule({
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent],
  declarations: [LoadingSpinnerComponent],
  providers: []
})
export class SharedModule {}