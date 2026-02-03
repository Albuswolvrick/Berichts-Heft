# Projekt: Online-Berichtsheft

## Was ist das?

Dieses Projekt ist eine Webanwendung zur digitalen Verwaltung von Berichtsheften, wie sie beispielsweise von der IHK gefordert werden. Auszubildende können ihre Berichte online erstellen, bearbeiten und speichern.

## Wie wird es genutzt?

1.  **Abhängigkeiten installieren:**
    Führen Sie `npm install` im Terminal aus, um alle für das Projekt notwendigen Pakete zu installieren.

2.  **Datenbank initialisieren:**
    Führen Sie `npx prisma db push` aus, um das Datenbankschema zu erstellen und die Datenbank zu initialisieren.

3.  **Anwendung starten:**
    Führen Sie `npm run dev` im Terminal aus. Die Anwendung ist dann unter `http://localhost:5173` in Ihrem Browser erreichbar.

## Wie wird es auf einem Server bereitgestellt?

Um die Anwendung live zu schalten, können Sie die folgenden Schritte ausführen, um sie auf Firebase Hosting, einem Dienst von Google, bereitzustellen:

1.  **Build-Prozess:**
    Führen Sie `npm run build` im Terminal aus. Dieser Befehl kompiliert die Anwendung und erstellt einen `dist`-Ordner mit den statischen Dateien, die für das Hosting benötigt werden.

2.  **Firebase-Projekt erstellen:**
    - Gehen Sie zur [Firebase-Konsole](https://console.firebase.google.com/).
    - Erstellen Sie ein neues Projekt oder wählen Sie ein bestehendes aus.
    - Fügen Sie Ihrem Projekt "Hosting" hinzu.

3.  **Firebase-CLI installieren:**
    Falls noch nicht geschehen, installieren Sie die Firebase-Befehlszeilen-Tools global auf Ihrem Computer:
    `npm install -g firebase-tools`

4.  **Anmelden und initialisieren:**
    - Melden Sie sich mit Ihrem Google-Konto an: `firebase login`
    - Initialisieren Sie Firebase in Ihrem Projektordner: `firebase init`
    - Wählen Sie "Hosting" aus der Liste der Funktionen.
    - Konfigurieren Sie das Hosting, indem Sie die folgenden Angaben machen:
        - **Öffentliches Verzeichnis:** `dist` (der Ordner, der im ersten Schritt erstellt wurde)
        - **Als Single-Page-App konfigurieren:** Ja

5.  **Bereitstellen:**
    Führen Sie den folgenden Befehl aus, um Ihre Anwendung bereitzustellen:
    `firebase deploy`

Nach Abschluss des Deployments erhalten Sie eine URL, unter der Ihre Anwendung live erreichbar ist.
