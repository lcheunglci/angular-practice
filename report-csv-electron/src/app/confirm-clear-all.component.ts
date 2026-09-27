import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-clear-all',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './confirm-clear-all.html'
})
export class ConfirmClearAllComponent {
  @Input({ required: true }) reportCount = 0;
  agreed = false;

  constructor(public activeModal: NgbActiveModal) {}

  confirm(): void {
    this.activeModal.close(true);
  }
}