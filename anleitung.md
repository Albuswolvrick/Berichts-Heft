# Funktionsweise: Online-Berichtsheft

Diese Anleitung dokumentiert die technischen und administrativen Funktionen der Anwendung für Entwickler und Manager.

## 1. Benutzerrollen & Berechtigungen

Die Anwendung nutzt ein rollenbasiertes Zugriffssystem (RBAC):
- **USER:** Erstellt und verwaltet eigene Berichte. Kann das eigene Passwort ändern.
- **MANAGER:** Kann alle Berichte einsehen und kommentieren. Hat Zugriff auf das Admin-Dashboard und das Dev-Menü.
- **ADMIN:** Besitzt alle Rechte der Manager-Rolle und kann zusätzlich Benutzer löschen oder Rollen anpassen.

## 2. Berichtswesen (Reporting)

Die Berichte sind in vier Typen unterteilt:
- **Täglich (Daily):** Fokus auf tägliche Aufgaben.
- **Wöchentlich (Weekly):** Automatische Berechnung der Kalenderwochen basierend auf dem Datum.
- **Monatlich (Monthly):** Zusammenfassung eines ganzen Monats.
- **Jährlich (Yearly):** Jahresrückblick.

Alle Berichte können als professionelle **PDF-Dokumente** exportiert werden. Die PDF-Generierung erfolgt clientseitig mittels *jsPDF*.

## 3. Kommentarsystem

Das Kommentarsystem ermöglicht eine direkte Feedback-Schleife:
- Nur **Admins** und **Manager** können Kommentare verfassen.
- Kommentare sind an den jeweiligen Berichtstyp und die ID gebunden.
- Der Berichtsersteller sieht Kommentare in einer Sidebar, sobald ein Reviewer Feedback hinterlassen hat.

## 4. Design-System (Theming)

Die Anwendung nutzt CSS-Variablen für ein dynamisches Design-System:
- **Technik:** Themes werden über das `data-theme` Attribut im `<html>`-Element gesteuert.
- **Modi:** Unterstützt *Light*, *Dark* und den *Doom*-Modus (kontrastreiches Rot/Schwarz).
- **Persistenz:** Das gewählte Design wird im `localStorage` gespeichert.

## 5. Suche & Filterung

- **HomePage:** Nutzt ein kombiniertes Frontend-Filtering für Titel, Berichtsart und Status.
- **Admin-Dashboard:** Ermöglicht die Filterung nach spezifischen Benutzern und Zeiträumen.

## 6. Sicherheit & Datenschutz

- **Authentifizierung:** Erfolgt über verschlüsselte Session-Cookies.
- **Passwort-Management:** Nutzer können ihr Passwort selbstständig ändern; die Verschlüsselung erfolgt via *Bcrypt*.
- **Login-Tracking:** Erfasst den Zeitstempel und die IP-Adresse des letzten Logins zur Erhöhung der Transparenz.
- **Cookie-Consent:** Ein Banner erscheint nur für eingeloggte Nutzer, um rechtliche Anforderungen zu erfüllen.

## 7. Docker-Bereitstellung

Für Devs, die das System in einem Container laufen lassen möchten, stehen ein `Dockerfile` und eine `docker-compose.yml` zur Verfügung.

### Schritte zur Containerisierung:

1.  **Image bauen:**
    Verwenden Sie den Befehl `docker build -t berichts-heft .`. Das Dockerfile nutzt ein Multi-Stage-Verfahren, um die Frontend-Assets zu bauen und sie dann im schlanken Produktions-Image bereitzustellen.

2.  **Lizenzen & Compliance:**
    Das Projekt steht unter der **GNU AGPL v3**. Im Dockerfile wird die `LICENSE`-Datei automatisch in das Root-Verzeichnis des Containers kopiert (`/app/LICENSE`). Dies stellt sicher, dass die Lizenzinformationen auch innerhalb des Container-Dateisystems vorhanden sind.

3.  **Docker Compose nutzen:**
    Mit `docker-compose up -d` wird das System inklusive persistenter Volumes für die SQLite-Datenbank (`dev.db`) und die Sessions gestartet.

### Konfiguration im Container:

Stellen Sie sicher, dass die `.env` Variablen (insbesondere `SESSION_SECRET`) entweder über eine `.env`-Datei oder direkt in der `docker-compose.yml` an den Container übergeben werden.
