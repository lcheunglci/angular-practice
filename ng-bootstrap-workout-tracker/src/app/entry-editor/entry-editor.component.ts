import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutApiService } from '../services/workout-api.service';

@Component({
  selector: 'app-entry-editor',
  templateUrl: './entry-editor.component.html',
  styleUrl: './entry-editor.component.css',
})
export class EntryEditorComponent implements OnInit {
  public workout: any = {};
  public loading = false;

  constructor(
    private router: ActivatedRoute,
    private nav: Router,
    private api: WorkoutApiService
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      const id = params['id'];
      if (id !== 'new') {
        this.loading = true;
        this.api.getWorkout(id).subscribe((data) => {
          this.workout = data;
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
