# AccNotes v1.0.0 Release

## 📦 Release-Pakete

### Chrome Web Store
- **Datei**: `accnotes-chrome-v1.0.0.zip` (203 KB)
- **Speicherort**: `/mnt/c/projekte/claude/accnotes-chrome-v1.0.0.zip`

### Firefox Add-ons
- **Datei**: `accnotes-firefox-v1.0.0.zip` (203 KB)
- **Speicherort**: `/mnt/c/projekte/claude/accnotes-firefox-v1.0.0.zip`

## ✅ Submission Checkliste

### Bereit für Upload
- [x] Manifest auf v1.0.0 aktualisiert
- [x] Icons erstellt (16, 32, 48, 128 px)
- [x] Screenshots erstellt (3 Stück)
- [x] Privacy Policy verfügbar
- [x] Store-Beschreibungen (DE + EN)
- [x] Chrome Package erstellt
- [x] Firefox Package erstellt

### Store-Submission Assets

#### Screenshots (in `/screenshots/store/`)
1. `screenshot-1-overview.png` - Notizen-Übersicht
2. `screenshot-2-dashboard.png` - BITV Dashboard
3. `screenshot-3-note-editor.png` - Notiz-Editor

#### Store-Beschreibungen
- Siehe: `/STORE_DESCRIPTION.md`
- Deutsch (primär) + Englisch (sekundär)

#### Privacy Policy
- URL: `https://github.com/heikofolkerts/AccNotes/blob/main/PRIVACY_POLICY.md`
- Datei: `/PRIVACY_POLICY.md`

## 📋 Nächste Schritte

### 1. Chrome Web Store Submission
1. Gehe zu: https://chrome.google.com/webstore/devconsole
2. Klicke "New Item"
3. Upload `accnotes-chrome-v1.0.0.zip`
4. Fülle Store-Listing aus (siehe `/STORE_DESCRIPTION.md`)
5. Lade Screenshots hoch (3 Stück)
6. Setze Privacy Policy URL
7. Wähle Kategorie: "Developer Tools"
8. Submit für Review

**Permissions Justification (für Review):**
- `contextMenus`: Rechtsklick-Menü für Element-Annotation
- `tabs`: URL/Titel der aktuellen Seite für Notiz-Kontext
- `activeTab`: Element-Inspektion auf aktiver Seite
- `storage`: Lokale Notiz-Speicherung (keine Cloud)
- `<all_urls>`: BITV-Tests auf beliebigen Websites

### 2. Firefox Add-ons Submission
1. Gehe zu: https://addons.mozilla.org/developers/
2. Klicke "Submit a New Add-on"
3. Upload `accnotes-firefox-v1.0.0.zip`
4. Fülle Add-on-Details aus (siehe `/STORE_DESCRIPTION.md`)
5. Lade Screenshots hoch (3 Stück)
6. Setze Privacy Policy URL
7. Wähle Kategorie: "Developer Tools" + "Accessibility"
8. Submit für Review

**Hinweis zu jsPDF:**
Firefox könnte nach Source Code für minifizierte Dateien fragen.
- jsPDF CDN: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
- Offizielle Library: https://github.com/parallax/jsPDF

### 3. Nach Approval
- [ ] Extension URLs notieren
- [ ] README.md mit Store-Links aktualisieren
- [ ] GitHub Release v1.0.0 erstellen
- [ ] Community-Announcement (optional)

## 📊 Package-Inhalt

Beide Packages enthalten:
- Alle Core-Dateien (background.js, content.js, manifest.json)
- UI-Dateien (note.html, notes-overview.html, help.html)
- Scripts (barrier-detector.js, bitv-catalog.js, storage-helper.js, etc.)
- Styles (modern-theme.css)
- Icons (alle 4 Größen)
- README.md

**Nicht enthalten** (für Store-Submission nicht nötig):
- Dokumentation (`/docs/`)
- Development-Tools (`.idea/`, `.vscode/`)
- Git-Dateien (`.git/`)
- Screenshot-Generator Tools
- Privacy Policy & Store Description (werden als URLs referenziert)

## 🎉 Release Features

### Hauptfunktionen
- ✅ Vollständiger BITV-Katalog (54 Prüfschritte)
- ✅ Automatische Barriere-Erkennung (5 Algorithmen)
- ✅ Intelligentes Kontextmenü mit Problem-Erkennung
- ✅ BITV-Dashboard mit Compliance-Analytics
- ✅ Dark/Light Mode (WCAG AA konform)
- ✅ PDF-Export-Funktionalität
- ✅ Performance-optimiert für 1000+ Notizen
- ✅ Vollständig lokalisiert (Deutsch)

### Technische Highlights
- WCAG 2.1 AA konform
- Manifest V2 (Chrome + Firefox kompatibel)
- Vanilla JavaScript (keine Dependencies)
- Lokale Datenspeicherung (100% Privacy)
- Open Source (GitHub)

## 📞 Support & Links

- **GitHub**: https://github.com/heikofolkerts/AccNotes
- **Issues**: https://github.com/heikofolkerts/AccNotes/issues
- **Privacy Policy**: https://github.com/heikofolkerts/AccNotes/blob/main/PRIVACY_POLICY.md
- **Dokumentation**: `/docs/PUBLISHING_CHECKLIST.md`

---

**Release Date**: 2025-10-03
**Version**: 1.0.0
**Status**: Ready for Store Submission ✅
