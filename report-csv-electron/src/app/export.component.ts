import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExportFormat, ReportSummary } from './electron-api';
import { ReportService } from './report.service';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './export.html'
})
export class ExportComponent implements OnInit {
  reports: ReportSummary[] = [];
  selectedReportId = 0;
  format: ExportFormat = 'xlsx';
  exporting = false;
  loading = false;
  message = '';
  isError = false;

  formats: { value: ExportFormat; label: string }[] = [
    { value: 'json', label: 'JSON' },
    { value: 'xlsx', label: 'Excel (.xlsx)' },
    { value: 'ods', label: 'LibreOffice (.ods)' }
  ];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  async loadReports(): Promise<void> {
    this.loading = true;
    try {
      this.reports = await this.reportService.listReports();
      if (this.reports.length > 0) {
        this.selectedReportId = this.reports[0].id;
      }
    } catch (err) {
      this.showError(String(err));
    } finally {
      this.loading = false;
    }
  }

  async export(): Promise<void> {
    if (!this.selectedReportId) return;
    this.exporting = true;
    this.message = '';
    try {
      const result = await this.reportService.exportReport(
        this.selectedReportId,
        this.format
      );
      if (result.canceled) {
        this.showInfo('Export cancelled.');
      } else if (result.ok && result.filePath) {
        this.showInfo(`Saved to ${result.filePath}`);
      } else {
        this.showError(result.message ?? 'Export failed');
      }
    } catch (err) {
      this.showError(String(err));
    } finally {
      this.exporting = false;
    }
  }

  private showError(message: string): void {
    this.isError = true;
    this.message = message;
  }

  private showInfo(message: string): void {
    this.isError = false;
    this.message = message;
  }
}