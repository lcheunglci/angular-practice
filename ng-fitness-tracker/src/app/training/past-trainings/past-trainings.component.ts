import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrl: './past-trainings.component.css',
})
export class PastTrainingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  displayColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private exerciseChangedSub!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private trainingService: TrainingService) {}

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.exerciseChangedSub =
      this.trainingService.finishedExercisesChanged.subscribe(
        (exercises: Exercise[]) => {
          this.dataSource.data = exercises;
        }
      );
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngOnDestroy(): void {
    this.exerciseChangedSub.unsubscribe();
  }

  doFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement)?.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
