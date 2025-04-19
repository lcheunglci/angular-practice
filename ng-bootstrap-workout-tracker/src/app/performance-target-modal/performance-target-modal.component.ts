import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-performance-target-modal',
  templateUrl: './performance-target-modal.component.html',
  styleUrl: './performance-target-modal.component.css',
})
export class PerformanceTargetModalComponent {
  perfTargets: any = {};

  constructor(public activeModal: NgbActiveModal) {}

  save() {
    this.activeModal.close(this.perfTargets);
  }
}
