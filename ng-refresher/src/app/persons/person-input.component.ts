import { Component } from '@angular/core';

@Component({
  selector: 'app-person-input',
  templateUrl: './person-input.component.html',
  styleUrl: './person-input.component.css',
})
export class PersonInputComponent {
  onCreatePerson(personName: string) {
    console.log('Created a person :' + personName);
  }
}
