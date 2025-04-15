import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutsApiService } from '../services/workouts-api.service';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, map, Observable } from 'rxjs';

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
  public locations: any[] = [];

  constructor(
    private router: ActivatedRoute,
    private nav: Router,
    private api: WorkoutsApiService
  ) {
    const today = new Date();
    this.maxDate = NgbDate.from({
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate() + 1,
    }) as NgbDateStruct;
  }

  ngOnInit(): void {
    this.api.getLocations().subscribe((data) => (this.locations = data));

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

  locationsSearch = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        term.length < 2
          ? []
          : this.locations
              .filter(
                (v) =>
                  v.name.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1
              )
              .slice(0, 10)
      )
    );

  locationsFormatter = (result: any) => result.name;

  save() {
    this.loading = true;
    this.api.saveWorkout(this.workout).subscribe((data) => {
      this.loading = false;
      this.nav.navigate(['/workouts']);
    });
  }
}
