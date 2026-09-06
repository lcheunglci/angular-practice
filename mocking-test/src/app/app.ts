import { Component, inject, signal } from '@angular/core';
import { WeatherService } from './services/weather-service/weather-service';
import { take } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-app');

  weatherValue = signal(0);
  weatherCity = signal('');


  weatherService = inject(WeatherService);

  getWeather(city: string) {

    return this.weatherService.getWeather(city).pipe(take(1)).subscribe(x => {
      this.weatherValue.update(() => x.temp);
      this.weatherCity.update(() => x.name);
    });
  }
}
