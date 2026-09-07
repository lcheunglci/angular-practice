// src/app/weather.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface WeatherDataRes {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
  }
}

export interface WeatherData {
  name: string;
  temp: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = 'xxxx'; // Insert your API key here
  private baseUrl = 'https://api.weatherapi.com/v1/current.json';

  getWeather(city: string): Observable<WeatherData> {
    return this.http.get<WeatherDataRes>(`${this.baseUrl}?key=${this.apiKey}&q=${city}`).pipe(
      map(res => ({
        name: res.location.name,
        temp: res.current.temp_c
      }))
    )
      ;
  }
}