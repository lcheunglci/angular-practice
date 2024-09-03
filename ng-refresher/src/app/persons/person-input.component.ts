import { Component, EventEmitter, Output } from '@angular/core';
import { PersonsService } from './persons.service';

@Component({
  selector: 'app-person-input',
  templateUrl: './person-input.component.html',
  styleUrl: './person-input.component.css',
})
export class PersonInputComponent {

  constructor(private prsService: PersonsService) {}
  enteredPersonName = '';

  onCreatePerson() {
    console.log('Created a person :' + this.enteredPersonName);
    this.enteredPersonName = '';
    this.prsService.addPerson(this.enteredPersonName);
  }
}
