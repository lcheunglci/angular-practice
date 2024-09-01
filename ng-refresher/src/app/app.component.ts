import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  persons = ['Alice', 'Bob', 'Carl']


  onPersonCreated(name: string) {
    this.persons.push(name);
  }
}
