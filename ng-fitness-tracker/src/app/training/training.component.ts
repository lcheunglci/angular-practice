import { Exercise } from './exercise.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrl: './training.component.css',
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  exerciseSubscription = new Subscription();

  constructor(private trainingService: TrainingService) {}
  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(
      (exercise) => {
        if (exercise) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }
}
