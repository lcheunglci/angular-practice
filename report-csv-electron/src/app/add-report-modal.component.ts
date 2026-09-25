import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from './report.service';

@Component({
  selector: 'app-add-report-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-report-modal.html'
})
export class AddReportModalComponent {
  name = '';
  selectedFile = '';
  picking = false;
  importing = false;
  error = '';

  constructor(
    public activeModal: NgbActiveModal,
    private reportService: ReportService
  ) {}

  async pickFile(): Promise<void> {
    this.picking = true;
    this.error = '';
    try {
      const result = await this.reportService.openCsvDialog();
      if (!result.canceled) {
        this.selectedFile = result.filePath;
      }
    } catch (err) {
      this.error = String(err);
    } finally {
      this.picking = false;
    }
  }

  async import(): Promise<void> {
    if (!this.selectedFile) return;
    this.importing = true;
    this.error = '';
    try {
      const report = await this.reportService.importReport(
        this.selectedFile,
        this.name
      );
      this.activeModal.close(report);
    } catch (err) {
      this.error = String(err);
    } finally {
      this.importing = false;
    }
  }
}