import { Injectable } from '@angular/core';
import {
  ElectronReportApi,
  ExportFormat,
  ReportDetail,
  ReportSummary
} from './electron-api';

@Injectable({ providedIn: 'root' })
export class ReportService {
  listReports(): Promise<ReportSummary[]> {
    return this.requireApi().listReports();
  }

  getReport(id: number): Promise<ReportDetail | null> {
    return this.requireApi().getReport(id);
  }

  importReport(filePath: string, name: string): Promise<ReportDetail> {
    return this.requireApi().importReport(filePath, name);
  }

  renameReport(id: number, name: string): Promise<ReportDetail | null> {
    return this.requireApi().renameReport(id, name);
  }

  deleteReport(id: number): Promise<boolean> {
    return this.requireApi().deleteReport(id);
  }

  exportReport(id: number, format: ExportFormat) {
    return this.requireApi().exportReport(id, format);
  }

  openCsvDialog() {
    return this.requireApi().openCsvDialog();
  }

  private requireApi(): ElectronReportApi {
    if (!window.reportApi) {
      throw new Error(
        'Electron API is not available. Run the app via Electron (npm run electron:dev or electron:start).'
      );
    }
    return window.reportApi;
  }
}