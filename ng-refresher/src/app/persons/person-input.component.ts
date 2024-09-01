import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-person-input',
  templateUrl: './person-input.component.html',
  styleUrl: './person-input.component.css',
})
export class PersonInputComponent {

  @Output() personCreate = new EventEmitter<string>();
  enteredPersonName = '';

  onCreatePerson() {
    console.log('Created a person :' + this.enteredPersonName);
    this.enteredPersonName = '';
    this.personCreate.emit(this.enteredPersonName);
  }
}
