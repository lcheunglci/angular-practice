import { Component, ElementRef, } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public getGridRowHeight(): string {
    return (document.documentElement.clientHeight  - 50) + 'px';
  }

}
