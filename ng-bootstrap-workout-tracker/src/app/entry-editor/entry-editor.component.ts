import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutApiService } from '../services/workout-api.service';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entry-editor',
  templateUrl: './entry-editor.component.html',
  styleUrl: './entry-editor.component.css',
})
export class EntryEditorComponent implements OnInit {
  public workout: any = {};
  public loading = false;
  public startDate: any;
  public maxDate: NgbDateStruct;

  constructor(
    private router: ActivatedRoute,
    private nav: Router,
    private api: WorkoutApiService
  ) {
    const today = new Date();
    this.maxDate = NgbDate.from({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate() + 1,
    }) as NgbDateStruct;
  }

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      const id = params['id'];
      if (id !== 'new') {
        this.loading = true;
        this.api.getWorkout(id).subscribe((data) => {
          this.workout = data;
          let d = new Date(this.workout.date);
          this.startDate = { year: d.getFullYear(), month: d.getMonth() + 1 };
          this.loading = false;
        });
      }
    });
  }

  save() {
    this.loading = true;
    this.api.saveWorkout(this.workout).subscribe((data) => {
      this.loading = false;
      this.nav.navigate(['/workouts']);
    });
  }
}
