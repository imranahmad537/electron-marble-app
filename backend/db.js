const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron'); // electron's app module

// This folder is consistent and survives app updates
const dbPath = path.join(app.getPath('userData'), 'database.sqlite');

console.log('Database location:', app.getPath('userData'));
// Store DB in userData folder
// const dbPath = path.join(process.cwd(), 'database.sqlite');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new Database(dbPath);

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT,
    quantity INTEGER
  )
`).run();

module.exports = db;
