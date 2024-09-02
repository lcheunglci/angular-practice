import { Component, OnInit } from '@angular/core';
import { PersonsService } from './persons.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrl: './persons.component.css',
})
export class PersonsComponent implements OnInit {
  personList: string[] = [];

  constructor(private prsService: PersonsService) {}
  
  ngOnInit(): void {
    this.personList = this.prsService.persons;
  }
}
