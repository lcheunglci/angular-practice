import { Component, OnInit } from '@angular/core';
import { WorkoutApiService } from '../services/workout-api.service';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css',
})
export class WorkoutsComponent implements OnInit {
  public workouts: any[] = [];
  public loading = false;

  constructor(private api: WorkoutApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getWorkouts().subscribe((data) => {
      console.log('app-workouts', 'ngOnInit', 'getWorkouts', data);
      this.workouts = data;
      this.loading = false;
    });
  }

  deleteWorkout(id: number) {
    this.api.deleteWorkout(id).subscribe((data) => {
      this.workouts = this.workouts.filter((workout) => workout.id !== id);
    });
  }
}
