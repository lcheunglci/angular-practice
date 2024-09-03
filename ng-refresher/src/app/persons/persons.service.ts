import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  persons: string[] = ['Alice', 'Bob', 'Carl']

  addPerson(name: string) {
    this.persons.push(name);
    console.log(this.persons);
  }
}