import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SuperLibComponent } from 'super-lib';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SuperLibComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ng-packagr-demo';
}
