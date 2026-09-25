import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from './report.service';
import { ReportSummary } from './electron-api';
import { AddReportModalComponent } from './add-report-modal.component';

@Component({
  selector: 'app-reports-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DatePipe
  ],
  templateUrl: './reports-list.html',
  styleUrls: ['./reports-list.css']
})
export class ReportsListComponent implements OnInit {
  reports: ReportSummary[] = [];
  loading = false;
  error = '';

  constructor(
    private reportService: ReportService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  async refresh(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      this.reports = await this.reportService.listReports();
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  async addReport(): Promise<void> {
    const modalRef = this.modalService.open(AddReportModalComponent, {
      size: 'lg'
    });
    const imported = await modalRef.result.catch(() => null);
    if (imported) {
      await this.refresh();
    }
  }

  async remove(report: ReportSummary): Promise<void> {
    const confirmed = window.confirm(
      `Delete "${report.name}" and all of its rows?`
    );
    if (!confirmed) return;
    try {
      await this.reportService.deleteReport(report.id);
      await this.refresh();
    } catch (err) {
      this.error = String(err);
    }
  }
}