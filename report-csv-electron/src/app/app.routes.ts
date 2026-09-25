import { Routes } from '@angular/router';
import { ReportsListComponent } from './reports-list.component';
import { ReportDetailComponent } from './report-detail.component';
import { ExportComponent } from './export.component';

export const routes: Routes = [
  { path: '', redirectTo: '/reports', pathMatch: 'full' },
  { path: 'reports', component: ReportsListComponent },
  { path: 'reports/:id', component: ReportDetailComponent },
  { path: 'export', component: ExportComponent }
];