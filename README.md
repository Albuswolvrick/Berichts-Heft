# Berichts-Heft

Ein Open-Source Berichtsheft Web-App mit modernem Tech-Stack für effiziente Berichtsverwaltung.

**[🔗 Live Demo](#) • [📚 Dokumentation](#) • [🐛 Issues](https://github.com/Albuswolvrick/Berichts-Heft/issues)**

---

## 🚀 Quick Start

### Voraussetzungen
- Node.js >= 18.x
- npm >= 9.x

### Installation & Setup

```bash
# Repository klonen
git clone https://github.com/Albuswolvrick/Berichts-Heft.git
cd Berichts-Heft

# Dependencies installieren
npm install

# .env Datei erstellen
cp .env.example .env
# SESSION_SECRET in .env Datei anpassen!

# Prisma Client generieren
npm run prisma:generate

# Datenbankschema initialisieren
npm run prisma:push

# Frontend & Backend gleichzeitig starten
npm run client:dev     # Terminal 1 (http://localhost:5173)
npm run server:dev     # Terminal 2 (http://localhost:3000)
```

---

## 📋 Verfügbare Commands

### Development
```bash
npm run client:dev       # Startet Vite Dev-Server (http://localhost:5173)
npm run client:build     # Production Build erstellen
npm run client:preview   # Preview des Production-Builds
npm run server:dev       # Startet Express Server (http://localhost:3000)
```

### Testing & Code Quality
```bash
npm test                 # Tests ausführen (Vitest)
npm run test:watch       # Tests im Watch-Modus
npm run test:coverage    # Test-Coverage Report
npm run lint             # ESLint prüfen
npm run lint:fix         # ESLint auto-fix
npm run format           # Code mit Prettier formatieren
```

### Datenbank Management
```bash
npm run prisma:push      # Synchronisiert Datenbankschema
npm run prisma:migrate   # Führt neue Migrationen durch
npm run prisma:studio    # Öffnet Prisma Studio (GUI)
npm run prisma:generate  # Generiert Prisma Client
npm run prisma:format    # Formatiert schema.prisma
npm run prisma:seed      # Führt Seed-Skript aus
npm run prisma:reset     # Setzt Datenbank zurück (Entwicklung)
```

---

## 🛠️ Technologie-Stack

| Kategorie | Technologie |
|-----------|-------------|
| **Frontend** | React 19, React Router 7, Vite 7 |
| **Backend** | Express.js 5, Node.js |
| **Datenbank** | Prisma ORM 7, SQLite |
| **Sicherheit** | bcrypt, express-session, helmet |
| **Logging** | Winston |
| **Testing** | Vitest, React Testing Library |
| **Code Quality** | ESLint, Prettier |

---

## 📁 Projektstruktur

```
Berichts-Heft/
├── src/
│   ├── server/                    # Backend (Express.js)
│   │   ├── config/                # Konfiguration (DB, Session, Env)
│   │   ├── controllers/           # Request-Handler
│   │   ├── middleware/            # Auth, Error Handler, Logging
│   │   ├── routes/                # API Route-Definitionen
│   │   ├── services/              # Business-Logik
│   │   ├── utils/                 # Hilfsfunktionen & Error-Klassen
│   │   ├── app.js                 # Express App Setup
│   │   └── index.js               # Server Entry Point
│   │
│   └── client/                    # Frontend (React)
│       ├── components/            # Wiederverwendbare Komponenten
│       ├── pages/                 # Seiten-Komponenten
│       ├── hooks/                 # Custom React Hooks
│       └── services/              # API Service Layer
│
├── __tests__/                     # Test-Dateien
│   ├── server/                    # Backend Tests
│   └── client/                    # Frontend Tests
├── prisma/                        # Datenbankschema & Migrationen
├── public/                        # Statische Assets (CSS, Bilder)
├── .eslintrc.json                 # ESLint Konfiguration
├── .prettierrc                    # Prettier Konfiguration
├── .env.example                   # Umgebungsvariablen Vorlage
├── vitest.config.js               # Test Konfiguration
└── vite.config.ts                 # Vite Konfiguration
```

---

## 🏗️ Architektur

Das Backend folgt einem **Service/Controller/Middleware** Pattern:

- **Routes** → definieren API-Endpunkte und verknüpfen Middleware
- **Controllers** → verarbeiten HTTP-Requests und senden Responses
- **Services** → enthalten die Business-Logik und Datenbankoperationen
- **Middleware** → Auth, Logging, Error-Handling

### API Endpunkte

| Methode | Pfad | Beschreibung |
|---------|------|-------------|
| POST | `/api/auth/register` | Benutzer registrieren |
| POST | `/api/auth/login` | Benutzer anmelden |
| POST | `/api/auth/logout` | Benutzer abmelden |
| GET | `/api/users/me` | Aktueller Benutzer |
| GET | `/api/users` | Alle Benutzer (Admin) |
| GET | `/api/health` | Health Check |
| CRUD | `/api/daily-reports` | Tägliche Berichte |
| CRUD | `/api/weekly-reports` | Wöchentliche Berichte |
| CRUD | `/api/monthly-reports` | Monatliche Berichte |
| CRUD | `/api/yearly-reports` | Jährliche Berichte |

---

## 💡 Development Tipps

### Prisma Studio verwenden
```bash
npm run prisma:studio
```

### Neue Migration erstellen
```bash
npm run prisma:migrate -- --name <migration_name>
```

### Tests schreiben
Tests liegen in `__tests__/server/` und `__tests__/client/`. Vitest wird als Test-Runner verwendet:
```bash
npm test               # Einmal ausführen
npm run test:watch     # Im Watch-Modus
```

---

## 📝 Lizenz

GNU AFFERO GENERAL PUBLIC LICENSE Version 3, 19 November 2007

---

## 🤝 Contributing

Beiträge sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/mein-feature`)
3. Committe deine Änderungen (`git commit -m 'feat: Beschreibung'`)
4. Pushe den Branch (`git push origin feature/mein-feature`)
5. Öffne einen Pull Request

**GitHub Repository:** [Albuswolvrick/Berichts-Heft](https://github.com/Albuswolvrick/Berichts-Heft)
