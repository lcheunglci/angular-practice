import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyDashComponent } from './my-dash/my-dash.component';
import { MyTableComponent } from './my-table/my-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MyDashComponent, MyTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-schematics-test';
}
