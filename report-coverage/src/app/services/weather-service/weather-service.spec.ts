// src/app/weather.service.spec.ts
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WeatherService, WeatherData, WeatherDataRes } from './weather-service';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);

    
  });

  afterEach(() => {
    // Verify that no unmatched requests are outstanding
    httpMock.verify();
  });

  it('should fetch weather data and return it as an observable', async () => {

    const expected: WeatherData = {
      name: 'Melbourne',
      temp: 22
    }

    const mockedRes: WeatherDataRes = {
      location: {
        name: 'Melbourne'
      },
      current: {
        temp_c: 22
      }
    }

    const weatherPromise = firstValueFrom(service.getWeather('Melbourne'));

    const req = httpMock.expectOne((request) =>
      request.urlWithParams.includes('api.weatherapi.com') &&
      request.urlWithParams.includes('q=Melbourne')
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockedRes); //Set how your response looks prior to data transforms

    const result = await weatherPromise;
    expect(result.name).toBe(expected.name);
    expect(result.temp).toBe(expected.temp);
  });
});