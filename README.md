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
npm run db:push
# oder mit npx:
npx prisma db push

# Entwicklungsserver starten
npm run dev
```

---

## 📋 Verfügbare Commands

### Frontend Development
```bash
npm run dev          # Startet Vite Dev-Server (http://localhost:5173)
npm run build        # Production Build erstellen
npm run preview      # Preview des Production-Builds lokal testen
```

### Server
```bash
npm run server       # Startet Node.js/Express Server
```

### Datenbank Management
```bash
npm run db:push      # Synchronisiert Datenbankschema
npx prisma db push  # Direkter npx Befehl

npm run db:migrate   # Führt neue Migrationen durch
npx prisma migrate dev  # Direkter npx Befehl

npm run db:studio    # Öffnet Prisma Studio (GUI)
npx prisma studio   # Direkter npx Befehl
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
npm run db:studio
# oder
npx prisma studio
```

### TypeScript Type-Checking
Das Projekt verwendet TypeScript für Type-Safety. Type-Definitionen für alle wichtigen Packages sind installiert.

### Neue Migration erstellen
Bei Änderungen am Datenbankschema:
```bash
npm run db:migrate
# oder
npx prisma migrate dev --name <migration_name>
```

---

## 📝 Lizenz

ISC

---

## 🤝 Contributing

Beiträge sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

**GitHub Repository:** [Albuswolvrick/Berichts-Heft](https://github.com/Albuswolvrick/Berichts-Heft)
