import { Component, OnDestroy, OnInit } from '@angular/core';
import { PersonsService } from './persons.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css',
})
export class PersonsComponent implements OnInit, OnDestroy {
  personList: string[] = [];
  private personListSub = new Subscription();

  constructor(private prsService: PersonsService) {}

  ngOnInit(): void {
    // this.personList = this.prsService.persons;
    this.prsService.fetchPersons();
    
    this.personListSub = this.prsService.personsChanged.subscribe((persons) => {
      this.personList = persons;
    });
  }

  ngOnDestroy(): void {
    this.personListSub.unsubscribe();
  }

  onRemovePerson(personName: string) {
    this.prsService.removePerson(personName);
  }
}
