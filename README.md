# Berichts-Heft

Open-source Berichtsheft Web-Anwendung mit React-Frontend, Express-Backend und Prisma/SQLite.

## Voraussetzungen

- Node.js >= 18
- npm >= 9

## Installation

```bash
git clone https://github.com/Albuswolvrick/Berichts-Heft.git
cd Berichts-Heft
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:push
```

## Entwicklung starten

Ein Befehl startet Frontend und Backend parallel:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Verfügbare Scripts

### Entwicklung

```bash
npm run dev
npm run client:dev
npm run server:dev
npm run client:build
npm run client:preview
```

### Tests und Qualität

```bash
npm test
npm run test:watch
npm run test:coverage
npm run lint
npm run lint:fix
npm run format
```

### Datenbank

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
npm run prisma:studio
npm run prisma:format
npm run prisma:seed
npm run prisma:reset
```

## Architektur

### Backend (`src/server`)

- `config/`: Environment, Session, Datenbankverbindung
- `routes/`: API-Routen
- `controllers/`: HTTP-Handling
- `services/`: Business-Logik
- `middleware/`: Auth, Logging, Fehlerbehandlung
- `utils/`: Helper-Funktionen und Fehlerklassen

### Frontend (`src/client`)

- `pages/`: Seiten-Komponenten
- `components/`: Wiederverwendbare UI-Komponenten
- `hooks/`: React Hooks
- `services/`: API-Client
- `utils/`: PDF- und Datums-Helfer

## Hauptfunktionen

- Authentifizierung mit Session-Cookies
- Daily/Weekly/Monthly/Yearly Reports
- Automatische Kalenderwochen-Berechnung im Weekly Report
- Speicherung der Reports in der Datenbank
- Professionell formatierter PDF-Export pro Berichtstyp
- Kommentarsystem für Admin-Feedback
- Design-System (Light, Dark)
- Suche und Filter für Berichte
- Benutzer-Self-Service (Passwortänderung)
- Login-Tracking und Cookie-Hinweis
- Admin-Bereich für Verwaltung und Einsicht

## API-Endpunkte

| Methode | Pfad | Beschreibung |
| --- | --- | --- |
| POST | `/api/auth/register` | Benutzer registrieren |
| POST | `/api/auth/login` | Benutzer anmelden |
| POST | `/api/auth/logout` | Benutzer abmelden |
| GET | `/api/users/me` | Aktueller Benutzer |
| GET | `/api/users` | Alle Benutzer (Admin) |
| GET | `/api/comments/:type/:id` | Kommentare abrufen |
| POST | `/api/comments` | Kommentar erstellen (Admin/Manager) |
| CRUD | `/api/daily-reports` | Tägliche Berichte |
| CRUD | `/api/weekly-reports` | Wöchentliche Berichte |
| CRUD | `/api/monthly-reports` | Monatliche Berichte |
| CRUD | `/api/yearly-reports` | Jährliche Berichte |
| GET | `/api/health` | Health-Check |

## Hinweise

- Für lokale Entwicklung muss `SESSION_SECRET` in `.env` gesetzt sein.
- Report-Seiten erwarten einen eingeloggten Benutzer.
- PDF-Exporte werden clientseitig mit jsPDF erzeugt.

## Lizenz

GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007
