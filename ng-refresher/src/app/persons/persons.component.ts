import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css',
})
export class PersonsComponent {
  @Input() personList: string[] = [];

  
}
