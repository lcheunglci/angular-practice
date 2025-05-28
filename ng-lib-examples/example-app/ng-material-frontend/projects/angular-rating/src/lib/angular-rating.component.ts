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
          (keyup)="keyUp($event)"
          (keydown)="keyDown($event)"
          role="button"
          tabindex="{0}"
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
  @Input() rating!: number;
  @Input() count!: number;

  options: number[] = [];

  ngOnInit(): void {
    // create an array with 'count' items
    // increase every item by one
    this.options = Array.from({ length: this.count }, (_, k) => ++k);
  }

  changeRating(rating: number) {
    this.ratingChanged.emit(rating);
  }

  keyUp(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      console.log('keyup - arrow up');
      this.rating++;
    }
    if (event.key === 'ArrowDown') {
      console.log('keyup - arrow down');
      this.rating--;
    }
  }

  keyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      console.log('keydown - arrow up');
    }
    if (event.key === 'ArrowDown') {
      console.log('keydown - arrow down');
    }
  }
}
