import { Component } from "@angular/core";


// from https://loading.io/css
@Component({
  selector: 'app-loading-spinner',
  template: '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loading-spinner.component.css']
})
export class LoadingSpinnerComponent {


}
