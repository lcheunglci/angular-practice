import { render, screen } from '@testing-library/angular';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { App } from './app';
import { WeatherData, WeatherService } from './services/weather-service/weather-service';

const expectedMelbourne: WeatherData = {
  name: 'Melbourne',
  temp: 22
}

const getWeatherSpy = vi.fn().mockReturnValue(of({
  name: 'Melbourne',
  temp: 22
}));

const getWeatherSpyImp = vi.fn().mockImplementation((city: string) => {
  if (city === 'Melbourne') {
    return of({
      name: 'Melbourne',
      temp: 22
    });
  } else if (city === 'Paris') {
    return of({
      name: 'Paris',
      temp: 22
    });
  } else {
    return of({
      name: 'London',
      temp: 22
    });
  }
})

describe('App', () => {

  it('should render title', async () => {
    await render(App);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should fetch weather data (Simple Test  that relies on the service)', async () => {
    const user = userEvent.setup();

    await render(App, {
      providers: [
        { provide: WeatherService, useValue: { getWeather: getWeatherSpy } }
      ]
    });
    const getMelbourneButton = screen.getByText('Get Weather (Melbourne)');

    await user.click(getMelbourneButton);
    // Some logic here of the component using the service
    const header = await screen.findByRole('heading', { level: 1 });
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(`Current Temperature in ${expectedMelbourne.name}: ${expectedMelbourne.temp}°C`);
  });

  it('should fetch weather data and return it as an observable (Statically)', async () => {
    const user = userEvent.setup();
    await render(App, {
      providers: [
        { provide: WeatherService, useValue: { getWeather: getWeatherSpyImp } }
      ]
    });
    const header = await screen.findByRole('heading', { level: 1 });
    expect(header).toBeInTheDocument();

    const getMelbourneButton = screen.getByText('Get Weather (Melbourne)');
    await user.click(getMelbourneButton);

    expect(header).toHaveTextContent(`Current Temperature in Melbourne: ${expectedMelbourne.temp}°C`);

    const getParisButton = screen.getByText('Get Weather (Paris)');
    await user.click(getParisButton);
    expect(header).toHaveTextContent(`Current Temperature in Paris: ${expectedMelbourne.temp}°C`);
  });

});
