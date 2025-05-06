import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyDashComponent } from './my-dash/my-dash.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyDashComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-schematics-test';
}
