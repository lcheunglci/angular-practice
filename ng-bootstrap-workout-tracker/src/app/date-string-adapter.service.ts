import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})
export class DateStringAdapterService implements NgbDateAdapter<string> {
  constructor() {}

  fromModel(value: string): NgbDateStruct {
    console.log('fromModel');
    if (!value) {
      return { year: 0, month: 0, day: 0 };
    }

    let segments = value.split('-');
    return {
      year: Number(segments[0]),
      month: Number(segments[1]),
      day: Number(segments[2]),
    };
  }

  toModel(date: NgbDateStruct): string {
    console.log('toModel');
    if (!date) {
      return '';
    }
    return `${date.year}-${date.month}-${date.day}`;
  }
}
