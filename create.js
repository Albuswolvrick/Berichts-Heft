// 1. Pfad-Check Log
console.log('DEBUG: Skript startet...');
const path = require('path');
const clientPath = path.resolve(__dirname, './generated/prisma');
console.log('DEBUG: Versuche Prisma-Client von hier zu laden:', clientPath);
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const dotenv = require('dotenv');
dotenv.config();

async function seedTestUsers() {
  const password = 'test_1';

  try {
    console.log('DEBUG: Starte Passwort-Hashing...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    console.log('DEBUG: Hashing erfolgreich.');
    console.log('DEBUG: Klar zum Anlegen der Test-User. (Passwort: test_1)');

    const testUsers = [
      { email: 'admin@test.de', name: 'Chef Admin', role: 'ADMIN' },
      { email: 'manager@test.de', name: 'Moni Manager', role: 'MANAGER' },
      { email: 'worker@test.de', name: 'Erik Employee', role: 'EMPLOYEE' },
      { email: 'azubi@test.de', name: 'Alex Azubi', role: 'TRAINEE' },
    ];

    const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
    const dbPath = dbUrl.replace(/^file:\/?/, '');
    console.log('DEBUG: Öffne SQLite DB:', dbPath);
    const db = new Database(dbPath);

    const selectStmt = db.prepare('SELECT id, email, name, role FROM "User" WHERE email = ?');
    const insertStmt = db.prepare('INSERT INTO "User" (email, name, role, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');
    const updateStmt = db.prepare('UPDATE "User" SET name = ?, role = ?, passwordHash = ?, updatedAt = ? WHERE id = ?');

    for (const u of testUsers) {
      console.log(`\n--- Verarbeite User: ${u.email} ---`);
      const existing = selectStmt.get(u.email);
      const now = new Date().toISOString();

      if (existing) {
        console.log(`DEBUG: User existiert bereits (ID: ${existing.id}), aktualisiere Eintrag...`);
        updateStmt.run(u.name, u.role, passwordHash, now, existing.id);
        console.log(`STATUS: ${u.email} aktualisiert (ID: ${existing.id})`);
      } else {
        console.log('DEBUG: Neuer User — Eintrag wird erstellt...');
        const info = insertStmt.run(u.email, u.name, u.role, passwordHash, now, now);
        console.log(`STATUS: ${u.email} angelegt (neue ID: ${info.lastInsertRowid})`);
      }
    }

    db.close();
    console.log('\n✅ Alle Operationen abgeschlossen. SQLite-Verbindung geschlossen.');
  } catch (error) {
    console.error('❌ KRITISCHER FEHLER IM SKRIPT:');
    console.error('Fehlermeldung:', error.message);
    console.error('Stacktrace:', error.stack);
  }
}

console.log('DEBUG: Rufe Hauptfunktion auf...');
seedTestUsers();