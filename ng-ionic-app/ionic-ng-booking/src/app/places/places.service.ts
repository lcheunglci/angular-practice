import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://unsplash.com/photos/UWYPTISci4o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGZhbmN5JTIwbWFuc2lvbnxlbnwwfHx8fDE3MjYxMjQwNzl8MA&force=true&w=640',
      149.99,
      new Date('2024-01-01'),
      new Date('2024-12-31')
    ),
    new Place(
      'p2',
      "L' Amour Toujours",
      'A romantic place in Paris!',
      'https://unsplash.com/photos/euNoSSVFl8U/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHBhcmlzJTIwaG91c2V8ZW58MHx8fHwxNzI2MTI0MTY1fDA&force=true&w=640',
      189.99,
      new Date('2024-01-01'),
      new Date('2024-12-31')
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://unsplash.com/photos/nxc9KgICLRU/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGZvZ2d5JTIwcGFsYWNlfGVufDB8fHx8MTcyNjEyNDI1NHww&force=true&w=640',
      99.99,
      new Date('2024-01-01'),
      new Date('2024-12-31')
    ),
  ];

  get places() {
    return [...this._places];
  }

  constructor() {}

  getPlace(id: string): Place {
    return { ...this._places.find((p) => p.id === id) } as Place;
  }
}
