import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, delay, map, switchMap, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  title: string;
  price: number;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    // new Place(
    //   'p1',
    //   'Manhattan Mansion',
    //   'In the heart of New York City',
    //   'https://unsplash.com/photos/UWYPTISci4o/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGZhbmN5JTIwbWFuc2lvbnxlbnwwfHx8fDE3MjYxMjQwNzl8MA&force=true&w=640',
    //   149.99,
    //   new Date('2024-01-01'),
    //   new Date('2024-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   'p2',
    //   "L' Amour Toujours",
    //   'A romantic place in Paris!',
    //   'https://unsplash.com/photos/euNoSSVFl8U/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHBhcmlzJTIwaG91c2V8ZW58MHx8fHwxNzI2MTI0MTY1fDA&force=true&w=640',
    //   189.99,
    //   new Date('2024-01-01'),
    //   new Date('2024-12-31'),
    //   'abc'
    // ),
    // new Place(
    //   'p3',
    //   'The Foggy Palace',
    //   'Not your average city trip!',
    //   'https://unsplash.com/photos/nxc9KgICLRU/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGZvZ2d5JTIwcGFsYWNlfGVufDB8fHx8MTcyNjEyNDI1NHww&force=true&w=640',
    //   99.99,
    //   new Date('2024-01-01'),
    //   new Date('2024-12-31'),
    //   'abc'
    // ),
  ]);

  get places() {
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        process.env['DB_URL'] + 'offered-places.json'
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap(places => this._places.next(places))
      );
  }

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://unsplash.com/photos/nxc9KgICLRU/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGZvZ2d5JTIwcGFsYWNlfGVufDB8fHx8MTcyNjEyNDI1NHww&force=true&w=640',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    return this.http
      .post<{ name: string }>(process.env['DB_URL'] + 'offered-places.json', {
        ...newPlace,
        id: null,
      })
      .pipe(
        switchMap((resData) => {
          generatedId = resData.name;
          return this.places;
        }),
        take(1),
        tap((places) => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
