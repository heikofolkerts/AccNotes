# AccNotes - Chrome Test Installation

## 📦 Externes Test-Paket

**Version**: 1.0.2
**Paket**: `accnotes-chrome-v1.0.2.zip` (210 KB)
**Datum**: 15.10.2025

---

## 🚀 Installation für externe Tester

### Voraussetzungen
- Google Chrome (Version 88+) oder Microsoft Edge (Version 88+)
- Windows, macOS oder Linux

### Schritt-für-Schritt Anleitung

#### 1. **Paket herunterladen**
- Laden Sie `accnotes-chrome-v1.0.2.zip` herunter
- Entpacken Sie die ZIP-Datei in einen Ordner Ihrer Wahl
  - **Wichtig**: Merken Sie sich den Speicherort!
  - Beispiel: `C:\AccNotes-Test\` oder `~/Downloads/AccNotes/`

#### 2. **Chrome Entwicklermodus aktivieren**

**In Google Chrome:**
1. Öffnen Sie Chrome
2. Geben Sie in der Adresszeile ein: `chrome://extensions/`
3. Drücken Sie Enter
4. Aktivieren Sie oben rechts den **"Entwicklermodus"** Schalter

**In Microsoft Edge:**
1. Öffnen Sie Edge
2. Geben Sie in der Adresszeile ein: `edge://extensions/`
3. Drücken Sie Enter
4. Aktivieren Sie links unten den **"Entwicklermodus"** Schalter

#### 3. **Extension laden**

1. Klicken Sie auf **"Entpackte Erweiterung laden"** (Chrome) bzw. **"Entpackte Erweiterung laden"** (Edge)
2. Navigieren Sie zum Ordner, in den Sie die Dateien entpackt haben
3. Wählen Sie den **Hauptordner** (der Ordner, der die `manifest.json` enthält)
4. Klicken Sie auf **"Ordner auswählen"**

✅ **Die Extension ist jetzt installiert!**

#### 4. **Extension überprüfen**

Sie sollten jetzt sehen:
- **AccNotes - BITV Accessibility Testing** in der Extension-Liste
- Das AccNotes-Icon (blau/weiß) in der Chrome-Toolbar
- Status: "Entpackte Erweiterung"

---

## 📖 Erste Schritte nach der Installation

### 1. **Extension testen**
1. Öffnen Sie eine beliebige Webseite (z.B. https://www.bundestag.de)
2. **Rechtsklick** auf ein Element (z.B. ein Bild oder Button)
3. Im Kontextmenü sollten Sie sehen:
   - 📝 Notiz zu diesem [Element]
   - 🔍 Barrierefreiheit prüfen
   - 📋 Notizen-Übersicht öffnen

### 2. **Notiz erstellen**
1. Rechtsklick auf ein Element
2. Wählen Sie: **"📝 Notiz zu diesem [Element]"**
3. Ein neues Fenster öffnet sich mit dem Notizen-Editor
4. Füllen Sie die Felder aus:
   - **Titel**: Kurzbeschreibung des Problems
   - **Beschreibung**: Detaillierte Beschreibung
   - **BITV-Prüfschritt** (optional): Wählen Sie einen Prüfschritt
5. Klicken Sie auf **"💾 Speichern"**

### 3. **Notizen-Übersicht öffnen**
1. Rechtsklick irgendwo auf der Seite
2. Wählen Sie: **"📋 Notizen-Übersicht öffnen"**
3. Alternativ: Klicken Sie auf das AccNotes-Icon in der Chrome-Toolbar

---

## 🧪 Test-Szenarien

### Test 1: Automatische Barriere-Erkennung
1. Öffnen Sie: https://www.bundestag.de
2. Rechtsklick auf ein Bild ohne Alt-Text
3. Sie sollten sehen: **"🚨 Problem melden: Alt-Text fehlt"**
4. Klicken Sie darauf → Notiz wird automatisch vorbefüllt

### Test 2: Vollständige Seitenprüfung
1. Öffnen Sie eine beliebige Webseite
2. Rechtsklick → **"🔍 Barrierefreiheit prüfen"**
3. Eine Ergebnisseite öffnet sich mit allen gefundenen Problemen
4. Wählen Sie Probleme per Checkbox aus
5. Klicken Sie **"Ausgewählte speichern"**

### Test 3: Notizen-Übersicht (Tabellenansicht)
1. Öffnen Sie die Notizen-Übersicht
2. Sie sollten eine **Tabelle** mit allen Notizen sehen
3. Testen Sie:
   - ✏️ **Bearbeiten-Button**: Öffnet die Notiz zum Bearbeiten
   - 🗑️ **Löschen-Button**: Löscht die Notiz (mit Bestätigungsdialog)
   - ☑️ **Checkboxen**: Mehrere Notizen auswählen
   - 🎨 **Dark/Light Mode**: Theme-Toggle oben rechts

### Test 4: BITV-Dashboard
1. Erstellen Sie mehrere Notizen mit BITV-Prüfschritten
2. Öffnen Sie die Notizen-Übersicht
3. Scrollen Sie zum **BITV-Dashboard**
4. Sie sollten sehen:
   - Compliance-Score (Prozent)
   - Fortschritt pro BITV-Kategorie
   - Top 5 Problem-Websites

### Test 5: Export-Funktionen
1. In der Notizen-Übersicht
2. Klicken Sie auf **"📤 Export"**
3. Testen Sie verschiedene Formate:
   - **PDF**: BITV-konformer Report
   - **TXT**: Textdatei für Bürgermeldungen
   - **CSV**: Tabellarischer Export

---

## 🐛 Bekannte Test-Einschränkungen

### ⚠️ **Entwicklermodus-Warnungen**
- Chrome zeigt eine Warnung: "Erweiterungen im Entwicklermodus deaktivieren"
- **Dies ist normal** für Test-Versionen
- Klicken Sie einfach auf "Abbrechen" wenn die Warnung erscheint

### 🔄 **Updates**
- Im Entwicklermodus werden Updates NICHT automatisch installiert
- Für neue Versionen: Extension deinstallieren und neue Version laden

### 💾 **Daten bleiben lokal**
- Alle Notizen werden lokal im Browser gespeichert
- Bei Deinstallation gehen die Daten verloren
- Exportieren Sie wichtige Notizen vorher!

---

## 📊 Was sollten Sie testen?

### Priorität 1 (Kritisch)
- [ ] Extension lässt sich installieren
- [ ] Kontextmenü erscheint bei Rechtsklick
- [ ] Notizen können erstellt werden
- [ ] Notizen werden in der Übersicht angezeigt
- [ ] Notizen können bearbeitet werden
- [ ] Notizen können gelöscht werden

### Priorität 2 (Wichtig)
- [ ] Automatische Barriere-Erkennung funktioniert
- [ ] Vollständige Seitenprüfung funktioniert
- [ ] BITV-Prüfschritte können ausgewählt werden
- [ ] Dark/Light Mode funktioniert
- [ ] Export als PDF funktioniert
- [ ] Tabellenansicht ist mit Tastatur navigierbar

### Priorität 3 (Nice-to-have)
- [ ] BITV-Dashboard zeigt korrekte Statistiken
- [ ] Filter-Funktionen funktionieren
- [ ] Bulk-Aktionen (mehrere Notizen löschen) funktionieren
- [ ] Screenshots werden korrekt erfasst

---

## 🆘 Probleme melden

Falls Sie Probleme finden:

### Option 1: GitHub Issue
Erstellen Sie ein Issue auf: https://github.com/heikofolkerts/AccNotes/issues

**Bitte angeben:**
- Browser (Chrome/Edge) und Version
- Betriebssystem (Windows/Mac/Linux)
- Genaue Beschreibung des Problems
- Schritte zum Reproduzieren
- Screenshots (falls möglich)

### Option 2: Direkte Kontaktaufnahme
Kontaktieren Sie den Entwickler über GitHub

---

## 🔒 Datenschutz für Tester

- **Alle Daten bleiben lokal** auf Ihrem Computer
- **Keine Daten werden gesendet** an Server oder Dritte
- **Keine Tracking-Cookies** oder Analytics
- Die Extension ist **100% offline-fähig**

---

## ✅ Nach dem Test

### Feedback geben
Bitte teilen Sie mit:
- ✅ Was hat gut funktioniert?
- ❌ Welche Probleme sind aufgetreten?
- 💡 Verbesserungsvorschläge
- 🎯 Fehlende Features

### Extension deinstallieren
1. Gehen Sie zu `chrome://extensions/`
2. Klicken Sie bei AccNotes auf **"Entfernen"**
3. Bestätigen Sie die Deinstallation

---

## 📞 Support & Kontakt

- **GitHub Repository**: https://github.com/heikofolkerts/AccNotes
- **Issues**: https://github.com/heikofolkerts/AccNotes/issues
- **Dokumentation**: Siehe Repository README.md

---

**Vielen Dank für Ihre Unterstützung beim Testen!** 🙏

Ihre Rückmeldung hilft, AccNotes für alle Nutzer zu verbessern.
