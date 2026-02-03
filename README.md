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

# Datenbankschema initialisieren
npm run prisma:push

# Entwicklungsserver starten (Frontend)
npm run client:dev

# Backend-Server starten (in separatem Terminal)
npm run server:dev
```

---

## 📋 Verfügbare Commands

### Frontend Development
```bash
npm run client:dev       # Startet Vite Dev-Server (http://localhost:5173)
npm run client:build     # Production Build erstellen
npm run client:preview   # Preview des Production-Builds lokal testen
```

### Backend Server
```bash
npm run server:dev       # Startet Node.js/Express Server
```

### Datenbank Management
```bash
npm run prisma:push      # Synchronisiert Datenbankschema
npm run prisma:migrate   # Führt neue Migrationen durch
npm run prisma:studio    # Öffnet Prisma Studio (GUI)
npm run prisma:generate  # Generiert Prisma Client
npm run prisma:format    # Formatiert schema.prisma
npm run prisma:pull      # Pullt Schema von bestehender Datenbank
npm run prisma:seed      # Führt Seed-Skript aus
npm run prisma:reset     # Setzt Datenbank zurück (Entwicklung)
```

## 🛠️ Technologie-Stack

| Kategorie | Technologie | Version |
|-----------|-------------|---------|
| **Frontend** | React | ^19.2.3 |
| | React Router DOM | ^7.12.0 |
| | Vite | ^7.3.1 |
| | TypeScript | ^5.9.3 |
| **Backend** | Express.js | ^5.2.1 |
| **Datenbank** | Prisma ORM | ^7.3.0 |
| | SQLite | - |
| **Sicherheit** | bcrypt | ^6.0.0 |
| | express-session | ^1.18.2 |

---

## 📁 Projektstruktur

```
Berichts-Heft/
├── src/                          # React Komponenten & Pages
│   ├── App.jsx
│   ├── main.jsx
│   ├── components/
│   │   └── Navbar.jsx
│   └── pages/
│       ├── HomePage.jsx
│       ├── LoginPage.jsx
│       └── DevMenu.jsx
├── prisma/
│   ├── schema.prisma            # Datenbankschema
│   └── migrations/              # Datenbankmigrationen
├── public/                       # Statische Assets
│   ├── css/                     # Stylesheets
│   └── imgs/                    # Bilder & Icons
├── server.js                     # Express Server
├── vite.config.ts               # Vite Konfiguration
├── prisma.config.ts             # Prisma Konfiguration
├── package.json
└── README.md
```

---

## 💡 Development Tipps

### Prisma Studio verwenden
Prisma Studio ist eine GUI zur Datenbankverwaltung:
```bash
npm run prisma:studio
```

### TypeScript Type-Checking
Das Projekt verwendet TypeScript für Type-Safety. Type-Definitionen für alle wichtigen Packages sind installiert.

### Neue Migration erstellen
Bei Änderungen am Datenbankschema:
```bash
npm run prisma:migrate --name <migration_name>
```

### Frontend & Backend gleichzeitig starten
Öffne zwei separate Terminal-Fenster:
```bash
# Terminal 1 - Frontend
npm run client:dev

# Terminal 2 - Backend
npm run server:dev
```

### Aktuelle Entwicklungen
- ✅ Prisma ORM Integration mit SQLite
- ✅ Authentifizierung mit bcrypt & express-session
- ✅ Report-Erstellung implementiert
- ✅ Responsive UI mit React & Vite
- 🔄 Weitere Report-Features in Entwicklung

---

## 📝 Lizenz

ISC

---

## 🤝 Contributing

Beiträge sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

**GitHub Repository:** [Albuswolvrick/Berichts-Heft](https://github.com/Albuswolvrick/Berichts-Heft)
