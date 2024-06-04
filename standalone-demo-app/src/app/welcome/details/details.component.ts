import { Component } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AnalyticsService } from '../../shared/analytics.service';

@Component({
  standalone: true,
  imports: [SharedModule],
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  constructor(private analyticsService: AnalyticsService) { }

  onClick() {
    this.analyticsService.registerClick();
  }
}
