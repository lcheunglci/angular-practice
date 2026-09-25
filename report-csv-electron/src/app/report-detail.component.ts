import { CommonModule, Location, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportService } from './report.service';
import { ReportDetail } from './electron-api';

@Component({
  selector: 'app-report-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './report-detail.html',
  styleUrls: ['./report-detail.css']
})
export class ReportDetailComponent implements OnInit {
  report: ReportDetail | null = null;
  loading = false;
  error = '';
  editingName = false;
  nameDraft = '';
  savingName = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  async load(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.error = '';
    try {
      this.report = await this.reportService.getReport(id);
      if (!this.report) {
        throw new Error(`Report ${id} not found`);
      }
    } catch (err) {
      this.error = String(err);
    } finally {
      this.loading = false;
    }
  }

  startEditingName(): void {
    this.nameDraft = this.report?.name ?? '';
    this.editingName = true;
  }

  async saveName(): Promise<void> {
    if (!this.report || !this.nameDraft.trim()) return;
    this.savingName = true;
    try {
      this.report = await this.reportService.renameReport(
        this.report.id,
        this.nameDraft
      );
      this.editingName = false;
    } catch (err) {
      this.error = String(err);
    } finally {
      this.savingName = false;
    }
  }

  async delete(): Promise<void> {
    if (!this.report) return;
    const confirmed = window.confirm(
      `Delete "${this.report.name}" and all of its rows?`
    );
    if (!confirmed) return;
    this.deleting = true;
    try {
      await this.reportService.deleteReport(this.report.id);
      await this.router.navigate(['/reports']);
    } catch (err) {
      this.error = String(err);
    } finally {
      this.deleting = false;
    }
  }

  get totalCost(): number {
    return (
      this.report?.rows.reduce((sum, row) => sum + (row.cost || 0), 0) ?? 0
    );
  }

  goBack(): void {
    this.location.back();
  }
}