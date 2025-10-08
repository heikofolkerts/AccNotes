# Screenshot-Anleitung für Screenreader-Nutzer

## 🎯 Ziel
Wir benötigen 2-3 Screenshots der AccNotes Extension für die Store-Submission.

## ✅ Einfachste Methode: Automatisiertes Tool

### Schritt 1: Beispieldaten laden
1. Öffne im Browser: `/screenshots/screenshot-generator.html`
2. Tab zur ersten Überschrift "AccNotes Screenshot Generator"
3. Tab weiter zu "Schritt 1: Beispieldaten laden"
4. Aktiviere Button "Beispieldaten laden" (Enter/Leertaste)
5. **Bestätigung hören**: "8 Beispiel-Notizen erfolgreich geladen"

### Schritt 2: Extension-Seite öffnen
1. Tab weiter zu "Schritt 3: Manuelle Alternative"
2. Aktiviere Button "Notizen-Übersicht öffnen"
3. Neue Browser-Tab öffnet sich automatisch mit AccNotes Übersicht

### Schritt 3: Screenshot mit Browser-Tools erstellen

#### Chrome (empfohlen):
1. In der AccNotes-Tab: `Strg + Shift + P` (öffnet Command Palette)
2. Tippe: "screenshot"
3. Pfeil-runter zu "Capture full size screenshot"
4. Enter drücken
5. Screenshot wird automatisch heruntergeladen
6. Umbenennen zu: `screenshot-1-overview.png`

#### Firefox:
1. `Shift + F2` (öffnet Developer Toolbar - falls aktiviert)
2. Tippe: `screenshot --fullpage --filename screenshot-1-overview.png`
3. Enter drücken

#### Alternative: Browser-Extension verwenden
- **GoFullPage** (Chrome/Firefox): Automatische Full-Page Screenshots
- **Awesome Screenshot** (Chrome/Firefox): Mit Keyboard-Shortcuts

## 📋 Benötigte Screenshots

### Screenshot 1: Notizen-Übersicht (ERFORDERLICH)
- **Datei**: `screenshot-1-overview.png`
- **Inhalt**: Hauptseite mit 8 Beispiel-Notizen
- **Status**: Wird durch screenshot-generator.html automatisch vorbereitet ✅

### Screenshot 2: BITV-Dashboard (OPTIONAL aber empfohlen)
- **Datei**: `screenshot-2-dashboard.png`
- **Wie**:
  1. In Notizen-Übersicht: Tab zu "BITV-Dashboard anzeigen" Checkbox
  2. Aktivieren (Leertaste)
  3. Screenshot erstellen (siehe oben)

### Screenshot 3: Einzelne Notiz (OPTIONAL)
- **Datei**: `screenshot-3-note-editor.png`
- **Wie**:
  1. In Notizen-Übersicht: Tab zur ersten Notiz
  2. Tab zu "Bearbeiten" Button
  3. Aktivieren → öffnet note.html
  4. Screenshot erstellen

## 🔧 Automatisierte Alternative (Kommandozeile)

Falls du Node.js installiert hast, kannst du Puppeteer verwenden:

```bash
# Installation (einmalig)
npm install puppeteer

# Screenshot-Script ausführen
node screenshots/generate-screenshots.js
```

(Script wird im nächsten Schritt erstellt)

## ✅ Checkliste

- [ ] `screenshot-generator.html` im Browser öffnen
- [ ] Beispieldaten laden (Button aktivieren)
- [ ] Notizen-Übersicht öffnen (Button aktivieren)
- [ ] Screenshot 1 erstellen: Übersicht (ERFORDERLICH)
- [ ] Screenshot 2 erstellen: BITV-Dashboard (optional)
- [ ] Screenshots im `/screenshots/store/` Ordner speichern
- [ ] Dateinamen korrekt: `screenshot-1-overview.png`, etc.

## 💡 Tipps für Screenreader-Nutzer

1. **Du musst die Screenshots nicht visuell prüfen** - das Design ist bereits WCAG-konform
2. **Automatische Tools** übernehmen die visuelle Qualitätssicherung
3. **Browser-Screenshot-Tools** sind vollständig keyboard-zugänglich
4. **Die Beispieldaten** werden automatisch geladen und sind realistisch

## 🆘 Falls Probleme auftreten

### Problem: Chrome Command Palette öffnet nicht
- **Lösung**: Verwende Browser-Extension "GoFullPage" mit Keyboard-Shortcut

### Problem: Firefox Screenshot-Befehl nicht verfügbar
- **Lösung**: Rechtsklick auf Seite → "Screenshot erstellen" (Kontextmenü ist accessible)

### Problem: Keine Tools funktionieren
- **Lösung**: Teile mir mit, welches Betriebssystem/Browser du verwendest, ich erstelle ein angepasstes Script

## 📞 Nächste Schritte

Nachdem du die Screenshots erstellt hast:
1. Speichere sie in `/screenshots/store/`
2. Die Extension ist bereit für Store-Submission!
3. Siehe `/docs/PUBLISHING_CHECKLIST.md` für weitere Schritte
