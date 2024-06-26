import { Component } from '@angular/core';

@Component({
  selector: 'lib-my-button',
  standalone: true,
  imports: [],
  template: `
    <button>
<ng-content></ng-content>
    </button>
  `,
  styles: ``
})
export class MyButtonComponent {

}
