import { Component, Input } from '@angular/core';
import { Person } from '../person';

@Component({
  selector: 'person-component',
  templateUrl: './person-component.html',
  styleUrls: ['./person-component.scss']
})
export class PersonComponent {
  @Input()
  set cubicleId(val) {
    if (!this.currentPerson_ || this.currentPerson_.cubicleId !== val) {
      this.hydrateDisplayPerson(val)
        .then((p) => {
          this.currentPerson_ = p;
        });
    }
  }
  get cubicleId(): string {
    return this.currentPerson_
      ? this.currentPerson_.cubicleId
      : '';
  }
  currentPerson_: Person;
  set currentPerson(p: Person) {
    if (p) {
      this.currentPerson_ = p;
    }
  }
  get currentPerson(): Person {
    return this.currentPerson_;
  }

  private hydrateDisplayPerson(cubicleId: string): Promise<Person> {
    return new Promise<Person>((resolve, reject) => {
      const rv: Person = new Person();
      if (cubicleId === 'AA-23') {
        rv.name = 'Louise Smith';
      } else {
        rv.name = 'Larry Smith';
      }
      rv.cubicleId = cubicleId;
      resolve(rv);
    });
  }

}
