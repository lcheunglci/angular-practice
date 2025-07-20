import { Component, inject } from '@angular/core';
import { ReviewService } from '../review.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-search',
  imports: [FormsModule],
  templateUrl: './review-search.html',
  styleUrl: './review-search.css'
})
export class ReviewSearch {
  pageTitle = "Review Search";
  private reviewService = inject(ReviewService);

  // Search feature
  enteredSearch = this.reviewService.enteredSearch;

  // Review data
  reviews = this.reviewService.reviewSearchResource.value;
}
