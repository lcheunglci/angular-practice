import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { WorkoutsApiService } from '../services/workouts-api.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import { PerformanceTargetModalComponent } from '../performance-target-modal/performance-target-modal.component';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class WorkoutsComponent implements OnInit {
  public workouts: any[] = [];
  // public workoutsOrig: any[] = [];
  public loading = false;
  public isCollapsed = false;
  public perfTargets: { bike: number; run: number; row: number } = {
    bike: 0,
    run: 0,
    row: 0,
  };
  public totals: any = {};
  public pageSize = 5;
  currPage = 1;

  constructor(private api: WorkoutsApiService, private modal: NgbModal) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin([
      this.api.getWorkoutsPaged(this.currPage, this.pageSize),
      this.api.getPerfTargets(),
    ]).subscribe(([workoutResults, perfTargetResults]) => {
      this.workouts = workoutResults;
      // this.refreshGrid();
      this.perfTargets = perfTargetResults as {
        bike: number;
        run: number;
        row: number;
      };
      this.calculatePerformance();
      this.loading = false;
      console.log('app-workouts', 'ngOnInit', this.workouts, this.perfTargets);
    });
  }

  refreshGrid() {
    // client side filtering
    // let offset = (this.currPage - 1) * this.pageSize;
    // this.workouts = this.workouts.slice(offset);
    // server side filtering
    this.api
      .getWorkoutsPaged(this.currPage, this.pageSize)
      .subscribe((data) => (this.workouts = data));
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

  showPerfTargets() {
    let modalRef = this.modal.open(PerformanceTargetModalComponent);
    modalRef.componentInstance.perfTargets = this.perfTargets;
    modalRef.result.then(
      (result) => {
        console.log('Modal Results', result);
        this.loading = true;
        this.api.savePerfTargets(result).subscribe((data) => {
          this.perfTargets = data as { bike: number; run: number; row: number };
          this.loading = false;
        });
      },
      (reason) => {
        console.log(`Dismissed reason: ${reason}`);
      }
    );
  }

  calculatePerformance() {
    let bikeTotal = this.workouts
      .filter((w) => w.type == 'bike')
      .reduce((sum, workout) => sum + +workout.distances, 0);
    let rowTotal = this.workouts
      .filter((w) => w.type == 'row')
      .reduce((sum, workout) => sum + +workout.distances, 0);
    let runTotal = this.workouts
      .filter((w) => w.type == 'run')
      .reduce((sum, workout) => sum + +workout.distances, 0);
    this.totals = { bike: bikeTotal, row: rowTotal, run: runTotal };
    console.log('**totals', this.totals);
  }

  getPBType(total: number, target: number) {
    let pct = (total / target) * 100;

    if (pct <= 25) {
      return 'success';
    } else if (pct > 25 && pct <= 50) {
      return 'info';
    } else if (pct > 50 && pct <= 75) {
      return 'warning';
    } else if (pct > 75) {
      return 'danger';
    }
    return '';
  }
}
