import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import { fileURLToPath } from 'url';

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to DB in Electron's userData folder
const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
console.log('Database location:', dbPath);

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new Database(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','user')),
    fullName TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username);
`);

const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
if (count === 0) {
  const hashPass = bcrypt.hashSync('Admin@091', 10);
  db.prepare(`
    INSERT INTO users (username, password, role, fullName)
    VALUES (@u, @p, @r, @n)
  `).run({
    u: 'admin',
    p: hashPass,
    r: 'admin',
    n: 'System Administrator'
  });
}

db.prepare(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product TEXT,
    quantity INTEGER
  )
`).run();

export default db;

// const Database = require('better-sqlite3');
// import { hash } from 'crypto';
// const bcrypt = require('bcryptjs');
// const path = require('path');
// const fs = require('fs');
// const { app } = require('electron'); // electron's app module

// // This folder is consistent and survives app updates
// const dbPath = path.join(app.getPath('userData'), 'database.sqlite');

// console.log('Database location:', app.getPath('userData'));
// // Store DB in userData folder
// // const dbPath = path.join(process.cwd(), 'database.sqlite');
// if (!fs.existsSync(dbPath)) {
//   fs.writeFileSync(dbPath, '');
// }

// const db = new Database(dbPath);


// db.exec(`
//   PRAGMA journal_mode = WAL;
//   CREATE TABLE IF NOT EXISTS users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   username TEXT UNIQUE NOT NULL,
//   password TEXT NOT NULL,
//   role NOT NULL CHECK( role in ('admin','user')),
//   fullName TEXT,
//   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
// );
// CREATE UNIQUE INDEX IF NOT EXISTS idx_user_username ON users(username)`
// )

// const count = db.prepare('SELECT COUNT(*) as a c FROM users').get().c;
// if(count === 0)
// {
//   const hashPass = bcrypt.hashSync('Admin@091',10)
//   db.prepare(`
//     INSERT INTO users (username, password, role, fullName) VALUES (@u, @p, @r, @n)`).run({
//       u:'admin', p:hash, r:'admin', n:'SystemAdministrator'
//     })
    
// }
// // return db
// // Create table if not exists
// db.prepare(`
//   CREATE TABLE IF NOT EXISTS orders (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     product TEXT,
//     quantity INTEGER
//   )
// `).run();

// module.exports = db;
