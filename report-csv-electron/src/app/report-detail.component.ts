import { CommonModule, Location, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportService } from './report.service';
import { ReportDetail, ReportRow } from './electron-api';

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
  sortColumn: keyof ReportRow = 'date';
  sortDirection: 'asc' | 'desc' = 'asc';
  copiedId: number | null = null;

  readonly sortableColumns: { key: keyof ReportRow; label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'orderId', label: 'Order ID' },
    { key: 'description', label: 'Description' },
    { key: 'cost', label: 'Cost' }
  ];

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

  onSort(column: keyof ReportRow): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  getDisplayedRows(): ReportRow[] {
    const source = this.report?.rows ?? [];
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    return [...source].sort((a, b) => {
      const left = a[this.sortColumn];
      const right = b[this.sortColumn];
      if (this.sortColumn === 'date' || this.sortColumn === 'description') {
        return String(left).localeCompare(String(right)) * direction;
      }
      return (Number(left) - Number(right)) * direction;
    });
  }

  async copyRow(row: ReportRow): Promise<void> {
    const csv = [
      this.csvField(row.date),
      this.csvField(row.orderId),
      this.csvField(row.description),
      this.csvField(row.cost)
    ].join(',');

    try {
      await navigator.clipboard.writeText(csv);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = csv;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    this.copiedId = row.id;
    setTimeout(() => {
      if (this.copiedId === row.id) {
        this.copiedId = null;
      }
    }, 1500);
  }

  private csvField(value: unknown): string {
    const text = value === null || value === undefined ? '' : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  }

  goBack(): void {
    this.location.back();
  }
}