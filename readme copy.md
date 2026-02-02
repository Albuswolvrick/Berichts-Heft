# Berichts-Heft

## Kurzfassung
Dieses Projekt existiert, weil irgendwer Berichtshefte schreiben **muss** und niemand Lust darauf hat. Ergebnis: eine Webapp, die das Elend wenigstens digital macht.

Wenn du perfekten Code erwartest: falsches Repo. Wenn du willst, dass es funktioniert: meistens ja.

---

## Wie wir auf die Idee gekommen sind
Niemand ist eines Morgens aufgewacht und dachte: *"Boah ja, Berichtshefte, mein Lebenstraum."*

Die Idee entstand aus einer Mischung aus:
- Pflicht
- Zeitmangel
- Genervtsein
- und der Erkenntnis, dass Papier im Jahr 2026 einfach peinlich ist

Also wurde beschlossen:
Wenn wir diesen Mist schon machen müssen, dann wenigstens mit einer Webapp.
Eine, die Berichte speichert, nicht verliert und uns nicht anschreit, wenn wir einen Tag vergessen.

Kein großes Startup. Kein Vision-Statement.
Nur der Wunsch, schneller fertig zu werden und weniger zu leiden.

---

## Was das hier ist
Eine Webanwendung zur Erstellung von Tages-, Wochen- und Monatsberichten.
Nicht mehr. Nicht weniger.

Tech-Zeug:
- Node.js
- Express
- Prisma ORM
- SQLite
- HTML + CSS (kein Zauberwerk)

---

## Zustand
- Läuft
- Sieht okay aus
- Noch nicht fertig
- Wird besser, wenn jemand Zeit hat

---

## Commit-Statistik
- **Gesamtanzahl Commits:** 35
- Qualität: schwankt
- Motivation: situationsabhängig

---

## Wichtige Commits (die wirklich was getan haben)

- **5813a6a** – Initial commit (Chaos beginnt)
- **8eaf72c / 684f49b** – Projektstruktur endlich halbwegs sinnvoll
- **737d936** – UI geändert, damit es nicht mehr ganz wehtut
- **242f845** – README, damit Leute nicht komplett verloren sind
- **b437e43** – MySQL rausgeworfen, Prisma rein (richtige Entscheidung)
- **a8b7a45** – Prisma + SQLite zum Laufen gebracht
- **5289881** – npm Scripts, weil Tipparbeit nervt
- **960b8a7** – Rechtschreibung repariert (endlich)

---

## Projektstruktur (damit du nicht suchen musst)

```
Berichts-Heft/
├─ public/        # Zeug für den Browser
├─ view/          # HTML Seiten
├─ prisma/        # Datenbank-Magie
├─ server.js      # Herzstück
├─ package.json   # npm macht brrr
└─ README.md      # das hier
```

---

## Voraussetzungen
- Node.js >= 18
- npm
- Geduld

---

## Installation

```bash
git clone https://github.com/Albuswolvrick/Berichts-Heft.git
cd Berichts-Heft
npm install
```

Wenn das fehlschlägt: Skill Issue.

---

## Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev
```

Datenbank anschauen:
```bash
npx prisma studio
```

---

## Starten

```bash
npm start
```
oder:
```bash
npm run dev
```

Dann:
```
http://localhost:3000
```

---

## Nützliche Befehle

```bash
npm install
npm start
npm run dev
npx prisma migrate
npx prisma studio
```

---

## Offene Baustellen (viele)

- Login fertig machen
- Rollen (User/Admin)
- Formularvalidierung
- PDF Export
- UI weniger hässlich
- Tests (ja, wirklich)
- Deployment

---

## Mitwirkende

- **Sindri** (Hauptverantwortlich, hat den Schaden angerichtet)

---

## Lizenz

**GNU General Public License v3.0**

Open Source. Nimm es. Ändere es. Beschwer dich nicht.

