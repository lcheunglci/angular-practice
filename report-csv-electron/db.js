const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const Papa = require('papaparse');
const XLSX = require('xlsx');

function openDb(dbPath) {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
  }
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.exec(`
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      source_file TEXT NOT NULL,
      imported_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS report_rows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      order_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      cost REAL NOT NULL
    );
  `);
  return db;
}

function parseCsv(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(content, {
    header: true,
    skipEmptyLines: true
  });
  return parsed.data.map((row) => ({
    date: String(row.date ?? '').trim(),
    orderId: Number(row.orderId),
    description: String(row.description ?? '').trim(),
    cost: Number(row.cost)
  })).filter((row) => row.date !== '' || row.description !== '');
}

function toSummary(report, rowCount) {
  return {
    id: report.id,
    name: report.name,
    sourceFile: report.source_file,
    importedAt: report.imported_at,
    rowCount
  };
}

function listReports(db) {
  const rows = db.prepare(`
    SELECT r.id, r.name, r.source_file, r.imported_at,
           (SELECT COUNT(*) FROM report_rows WHERE report_id = r.id) AS row_count
    FROM reports r
    ORDER BY r.imported_at DESC
  `).all();
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    sourceFile: row.source_file,
    importedAt: row.imported_at,
    rowCount: row.row_count
  }));
}

function getReport(db, id) {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(id);
  if (!report) return null;
  const rows = db.prepare('SELECT * FROM report_rows WHERE report_id = ? ORDER BY id').all(id);
  return {
    id: report.id,
    name: report.name,
    sourceFile: report.source_file,
    importedAt: report.imported_at,
    rows: rows.map((row) => ({
      id: row.id,
      date: row.date,
      orderId: row.order_id,
      description: row.description,
      cost: row.cost
    }))
  };
}

function insertReport(db, name, sourceFile, rows) {
  const importRows = db.transaction(() => {
    const info = db.prepare(
      'INSERT INTO reports (name, source_file, imported_at) VALUES (?, ?, ?)'
    ).run(name, sourceFile, new Date().toISOString());
    const reportId = info.lastInsertRowid;

    const insertRow = db.prepare(
      'INSERT INTO report_rows (report_id, date, order_id, description, cost) VALUES (?, ?, ?, ?, ?)'
    );
    for (const row of rows) {
      insertRow.run(reportId, row.date, row.orderId, row.description, row.cost);
    }
    return reportId;
  });

  const reportId = importRows();
  return getReport(db, reportId);
}

function renameReport(db, id, name) {
  db.prepare('UPDATE reports SET name = ? WHERE id = ?').run(name, id);
  return getReport(db, id);
}

function deleteReport(db, id) {
  const result = db.prepare('DELETE FROM reports WHERE id = ?').run(id);
  return result.changes > 0;
}

function exportRowsToJson(db, id, filePath) {
  const report = getReport(db, id);
  if (!report) return { ok: false, message: 'Report not found' };
  fs.writeFileSync(filePath, JSON.stringify(report.rows, null, 2), 'utf8');
  return { ok: true, filePath };
}

function exportRowsToSpreadsheet(db, id, filePath, bookType) {
  const report = getReport(db, id);
  if (!report) return { ok: false, message: 'Report not found' };

  const sheetRows = report.rows.map((row) => ({
    date: row.date,
    orderId: row.orderId,
    description: row.description,
    cost: row.cost
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(sheetRows),
    'Report'
  );
  XLSX.writeFile(workbook, filePath, { bookType });
  return { ok: true, filePath };
}

module.exports = {
  openDb,
  parseCsv,
  listReports,
  getReport,
  insertReport,
  renameReport,
  deleteReport,
  exportRowsToJson,
  exportRowsToSpreadsheet
};