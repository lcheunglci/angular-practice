import { Component } from '@angular/core';
import { AngularRatingComponent } from 'angular-rating';
import { AngularConsoleLoggerService } from 'angular-console-logger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'consumer-app';

  selectRating = 5;
  ratingChanged(rating: number) {
    this.selectRating = rating;
    this.logger.info(`${rating} was selected`);
  }

  constructor(private logger: AngularConsoleLoggerService) {}
}
