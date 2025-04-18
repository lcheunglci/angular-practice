import { Component, OnInit } from '@angular/core';
import { WorkoutsApiService } from '../services/workouts-api.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-workouts',
  templateUrl: './workouts.component.html',
  styleUrl: './workouts.component.css',
})
export class WorkoutsComponent implements OnInit {
  public workouts: any[] = [];
  public loading = false;
  public isCollapsed = false;

  constructor(private api: WorkoutsApiService, private modal: NgbModal) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getWorkouts().subscribe((data) => {
      console.log('app-workouts', 'ngOnInit', 'getWorkouts', data);
      this.workouts = data;
      this.loading = false;
    });
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
}
