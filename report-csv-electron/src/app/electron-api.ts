export interface ReportSummary {
  id: number;
  name: string;
  sourceFile: string;
  importedAt: string;
  rowCount: number;
}

export interface ReportRow {
  id: number;
  date: string;
  orderId: number;
  description: string;
  cost: number;
}

export interface ReportDetail {
  id: number;
  name: string;
  sourceFile: string;
  importedAt: string;
  rows: ReportRow[];
}

export type ExportFormat = 'json' | 'xlsx' | 'ods';

export type OpenCsvResult =
  | { canceled: true }
  | { canceled: false; filePath: string };

export interface ExportResult {
  canceled?: boolean;
  ok?: boolean;
  filePath?: string;
  message?: string;
}

export interface ElectronReportApi {
  openCsvDialog(): Promise<OpenCsvResult>;
  importReport(filePath: string, name: string): Promise<ReportDetail>;
  listReports(): Promise<ReportSummary[]>;
  getReport(id: number): Promise<ReportDetail | null>;
  renameReport(id: number, name: string): Promise<ReportDetail | null>;
  deleteReport(id: number): Promise<boolean>;
  exportReport(id: number, format: ExportFormat): Promise<ExportResult>;
}

declare global {
  interface Window {
    reportApi: ElectronReportApi;
  }
}