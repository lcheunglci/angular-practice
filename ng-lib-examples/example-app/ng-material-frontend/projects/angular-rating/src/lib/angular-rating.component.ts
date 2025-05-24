import { NgClass, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'lib-angular-rating',
  standalone: true,
  imports: [NgClass, NgFor],
  template: `
    <span class="rating-wrapper">
      <span *ngFor="let option of options">
        <span
          (click)="changeRating(option)"
          [ngClass]="{ rated: option <= rating }"
          >&#9733;</span
        >
      </span>
    </span>
  `,
  styles: `  
  .rated {
    color: orange;
  }

  .rating-wrapper {
    cursor: pointer;
  }
`,
})
export class AngularRatingComponent implements OnInit {
  @Output() ratingChanged = new EventEmitter();
  @Input() rating = 0;
  @Input() count = 0;

  options: number[] = [];

  ngOnInit(): void {
    // create an array with 'count' items
    // increase every item by one
    this.options = Array.from({ length: this.count }, (v, k) => ++k);
  }

  changeRating(rating: number) {
    this.ratingChanged.emit(rating);
  }
}
