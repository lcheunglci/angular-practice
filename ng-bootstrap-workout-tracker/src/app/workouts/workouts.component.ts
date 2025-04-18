import { Component, OnInit } from '@angular/core';
import { WorkoutsApiService } from '../services/workouts-api.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { PerformanceTargetModalComponent } from '../performance-target-modal/performance-target-modal.component';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css',
})
export class WorkoutsComponent implements OnInit {
  public workouts: any[] = [];
  public loading = false;
  public isCollapsed = false;
  public perfTargets = {};

  constructor(private api: WorkoutsApiService, private modal: NgbModal) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin([this.api.getWorkouts(), this.api.getPerfTargets()]).subscribe(
      ([workoutResults, perfTargetResults]) => {
        this.workouts = workoutResults;
        this.perfTargets = perfTargetResults;
        this.loading = false;
        console.log(
          'app-workouts',
          'ngOnInit',
          this.workouts,
          this.perfTargets
        );
      }
    );
  }

  deleteWorkout(id: number, deleteModal: any) {
    let options: NgbModalOptions = { size: 'sm' };
    this.modal.open(deleteModal, options).result.then(
      (result) => {
        this.api.deleteWorkout(id).subscribe((data) => {
          this.workouts = this.workouts.filter((workout) => workout.id !== id);
        });
      },
      (reason) => console.log(`Dismissed: ${reason}`)
    );
  }

  showPerfargets() {
    let modalRef = this.modal.open(PerformanceTargetModalComponent);
    modalRef.result.then(
      (result) => {
        console.log(result);
        // TODO: save here
      },
      (reason) => {
        console.log(`Dismissed reason: ${reason}`);
      }
    );
  }
}
