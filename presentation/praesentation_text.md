# Präsentation: Das Digitale Berichts-Heft

Hier ist ein strukturierter Text, den Sie direkt für Ihre PowerPoint-Präsentation verwenden können. Sie können die Struktur in Ihre Folien (Slides) übernehmen und die "Sprechernotizen" als Text für Ihren Vortrag nutzen.

---

## Folie 1: Titelfolie
**Titel:** Das Digitale Berichts-Heft
**Untertitel:** Die Zukunft der Ausbildungsdokumentation
**Bild:** (Optional: Ein schönes Mockup oder das Logo)

**Sprechernotiz:**
> "Herzlich willkommen zu meiner Präsentation. Ich möchte Ihnen heute das Projekt 'Digitales Berichts-Heft' vorstellen. Unser Ziel mit diesem Projekt war es, den oft lästigen Papierkram in der Ausbildung abzuschaffen und durch eine moderne, digitale und effiziente Lösung zu ersetzen."

---

## Folie 2: Das Problem & Unsere Lösung
**Titel:** Warum ein digitales Berichts-Heft?
**Aufzählungspunkte:**
- Traditionelle Berichtshefte sind unübersichtlich und papierintensiv.
- Statusverfolgung (Unterschriften, Abnahme) ist oft kompliziert.
- **Unsere Lösung:** Eine zentrale Web-Plattform für Auszubildende und Ausbilder.

**Sprechernotiz:**
> "Jeder kennt das Problem: Auszubildende müssen regelmäßig ihre Berichte schreiben, oft noch auf Papier oder in unübersichtlichen Word-Dokumenten. Die Unterschriften einzuholen dauert ewig. Unsere Lösung ist eine zentrale, intuitive Web-Plattform, die den gesamten Prozess automatisiert und digitalisiert."

---

## Folie 3: Barrierefreiheit & Design (Die Login-Ansicht)
**Titel:** Modernes Design & Barrierefreiheit
**Bilder:** Fügen Sie hier die beiden Login-Screenshots ein (`Login Dark Mode` und `Login Light Mode`).
**Aufzählungspunkte:**
- Anpassbares Design: Heller Modus, Dunkler Modus & Doom Modus.
- Dynamische Textgröße für maximale Zugänglichkeit.

**Sprechernotiz:**
> "Ein besonderer Fokus bei der Entwicklung lag auf der Barrierefreiheit und Benutzerfreundlichkeit. Jeder Nutzer hat andere Bedürfnisse. Deshalb unterstützt die Anwendung nicht nur einen hellen und dunklen Modus, sondern bietet auch einen Schieberegler, mit dem man die Textgröße auf der gesamten Webseite dynamisch anpassen kann. So ist sichergestellt, dass wirklich jeder die Plattform komfortabel nutzen kann."

---

## Folie 4: Das Dashboard
**Titel:** Übersicht behalten
**Bild:** Screenshot des Dashboards (`Meine Berichte`).
**Aufzählungspunkte:**
- Zentrale Verwaltung aller Berichte.
- Echtzeit-Status: Entwurf, Eingereicht, Abgelehnt, Genehmigt.
- Filter- und Suchfunktionen.

**Sprechernotiz:**
> "Hier sehen Sie das Herzstück der Anwendung: Das Dashboard. Auszubildende sehen sofort, welche Berichte noch offen sind, welche bereits genehmigt wurden und wo eventuell Nachbesserungen gefordert sind. Das System bietet eine klare und strukturierte Übersicht der Tages-, Wochen-, Monats- und Jahresberichte."

---

## Folie 5: Berichte Erstellen & Ausfüllen
**Titel:** Intuitive Dateneingabe
**Bilder:** Screenshots von der Berichtserstellung (`Einen neuen Bericht erstellen`) und dem Wochenbericht-Formular.
**Aufzählungspunkte:**
- Einfache Auswahl der Berichtsart.
- Automatisches Ausfüllen von Daten (z.B. Kalenderwochen).
- Strukturierte Eingabefelder für betriebliche Tätigkeiten und Schulungen.

**Sprechernotiz:**
> "Das Erstellen eines neuen Berichts ist denkbar einfach. Nutzer wählen zunächst die Art des Berichts – zum Beispiel einen Wochenbericht. Das Formular nimmt dem Nutzer viel Arbeit ab: Daten wie die aktuelle Kalenderwoche werden automatisch berechnet und eingetragen. Die Eingabefelder sind klar strukturiert, sodass man sich voll auf den Inhalt konzentrieren kann."

---

## Folie 6: Ein Blick unter die Haube (Code-Beispiele)
**Titel:** Moderne Architektur & Code
*(Tipp für die Folie: Fügen Sie hier Screenshots vom Code aus der `index.html` ein)*

**Beispiel 1: Status Updates**
Wir haben Logik implementiert, die automatisch Berichte aus der Datenbank löscht, wenn diese vom Ausbilder final "abgelehnt" (REJECTED) werden.

**Beispiel 2: Barrierefreiheit (Textgröße)**
Mit JavaScript und CSS-Variablen wird die Textgröße in Echtzeit angepasst und im Browser gespeichert. so ist die Gröze gut änderbar 

**Sprechernotiz:**
> "Technisch ist das Projekt auf dem neuesten Stand. Wir nutzen moderne Web-Technologien. Ein Beispiel für unsere saubere Architektur ist die Bericht-Logik: Wenn ein Ausbilder einen Bericht endgültig ablehnt, räumt das Backend diesen automatisch aus der Datenbank auf. Ein weiteres Highlight ist unsere Barrierefreiheit: Die dynamische Textgröße wird über CSS-Variablen gesteuert und lokal gespeichert, sodass die Präferenz des Nutzers beim nächsten Login erhalten bleibt."

---

## Folie 7: Fazit & Ausblick
**Titel:** Zusammenfassung
**Aufzählungspunkte:**
- Mehrsprachigkeit (über 10 Sprachen integriert).
- Rollenbasierte Zugriffskontrolle (Admin vs. User).
- strong pasword checker über regex

**Sprechernotiz:**
> "Zusammenfassend lässt sich sagen, dass dieses digitale Berichts-Heft den Ausbildungsalltag erheblich erleichtert. Neben den gezeigten Funktionen unterstützt das System übrigens auch über 10 verschiedene Sprachen. Für die Zukunft planen wir noch weitere Verbesserungen. Vielen Dank für Ihre Aufmerksamkeit – ich beantworte nun gerne Ihre Fragen!"
