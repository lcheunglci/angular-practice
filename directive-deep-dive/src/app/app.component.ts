import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  numbers = [1, 2, 3, 4, 5];
  onlyOdd = false;
}
