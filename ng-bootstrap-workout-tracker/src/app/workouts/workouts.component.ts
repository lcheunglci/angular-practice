import { Component, OnInit } from '@angular/core';
import { WorkoutApiService } from '../services/workout-api.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css',
})
export class WorkoutsComponent implements OnInit {
  public workouts = [];
  public loading = false;

  constructor(private api: WorkoutApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getWorkouts().subscribe((data) => {
      this.workouts;
      this.loading = false;
    });
  }

  deleteWorkout(id: number) {
    this.api
      .deleteWorkout(id)
      .subscribe((data) => _.remove(this.workouts, { id: id }));
  }
}
