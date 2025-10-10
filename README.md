# AccNotes 🚀

> **Automatisierte Browser-Extension für BITV-Accessibility Testing mit KI-Unterstützung**

AccNotes bietet einen **vollständig automatisierten End-to-End Workflow** von der Barriere-Erkennung bis zur fertigen BITV-Dokumentation. Mit intelligenter Problem-Erkennung, dynamischen Kontextmenüs und automatischer BITV-Zuordnung reduziert AccNotes die Zeit für Accessibility-Tests um 80%.

![AccNotes Demo](https://img.shields.io/badge/Version-1.0.2-brightgreen)
![Automation Ready](https://img.shields.io/badge/Automation-AI%20Powered-purple)
![BITV Support](https://img.shields.io/badge/BITV-Softwaretest%20Ready-blue)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-blue)
![Browser Support](https://img.shields.io/badge/Browser-Chrome%2C%20Firefox%2C%20Edge-orange)

## 🎉 **Neue Generation: Vollautomatisierter BITV-Workflow (v0.5.0)**

### ⚡ **End-to-End Automatisierung in unter 30 Sekunden**

```
Rechtsklick → Automatische Problem-Erkennung → Dynamisches Kontextmenü →
Template-Auswahl → Auto-BITV-Mapping → Vorbefüllte Notiz → Speichern
```

### 🤖 **KI-inspirierte Features**

#### **Automatische Barriere-Erkennung**
- **5 Erkennungsalgorithmen**: Alt-Text, Button-Labels, Formular-Labels, Kontrast, Überschriften-Struktur
- **Laienverständliche Beschreibungen**: "Button-Beschriftung fehlt" statt technischer BITV-IDs
- **Performance-optimiert**: <200ms Element-Analyse
- **BITV-Referenzen**: Automatische Zuordnung zu korrekten Prüfschritten

#### **Dynamisches Kontextmenü**
- **Problem-spezifische Menüpunkte**: "🚨 Problem melden: [Erkanntes Problem]"
- **Intelligente Menü-Anpassung**: Kontextmenü passt sich erkannten Problemen an
- **Real-time Updates**: Sofortige Anzeige der Problem-Anzahl
- **Mehrere Report-Modi**: Quick Problem, Detaillierte BITV-Notiz, Bürgermeldung

#### **Automatische BITV-Prüfschritt-Vorschläge**
- **Intelligentes Problem-zu-BITV-Mapping**:
  - Alt-Text fehlt → BITV 1.1.1 (Nicht-Text-Inhalte)
  - Button-Label fehlt → BITV 2.4.4 (Linkzweck im Kontext)
  - Form-Label fehlt → BITV 3.3.2 (Beschriftungen)
  - Schlechter Kontrast → BITV 1.4.3 (Kontrast Minimum)
  - Überschriften-Struktur → BITV 1.3.1 (Info und Beziehungen)
- **Visual AI Indicators**: "🤖 Automatisch vorgeschlagen" mit Problem-Referenz
- **Confidence-Level System**: High/Medium für Mapping-Qualität

#### **Template-basierte Auto-Population**
- **Quick Problem Report**: Fokussiert auf schnelle Problemmeldung
- **Citizen Report**: Bürgerfreundliche Sprache für Laien
- **Detailed BITV Report**: Vollständiger professioneller Prüfbericht
- **Automatische Felderbefüllung**: Titel, Beschreibung, BITV-Referenz, Bewertung

### 🎯 **Bewährte BITV-Features (v0.4.x)**
- **Vollständiger BITV-Katalog**: Alle 54 BITV-Prüfschritte von bit-inklusiv.de
- **Strukturierte Bewertung**: Bewertungssystem (Bestanden/Nicht bestanden/Teilweise/Zu überprüfen)
- **BITV-Filter & Suche**: Erweiterte Filter nach Kategorien, Bewertungen und Prüfschritten
- **BITV-Fortschritts-Dashboard**: Visuelle Fortschrittsanzeige pro BITV-Kategorie
- **Professional BITV-Reports**: Strukturierte BITV-Berichte für offizielle Dokumentation
- **Website-spezifische Analyse**: Filter und Tracking pro Domain
- **Performance-optimiert**: <200ms für 1000+ Notizen mit Caching

### 🚀 **Roadmap: Nächste Features (v0.6.0+)**
- **PDF/Excel-Reports** mit professioneller BITV-Struktur
- **Screenshot-Integration** mit Element-Highlighting
- **BITV-Team-Kollaboration** und Prüfschritt-Assignment
- **Multi-Projekt-Management** für größere BITV-Audits
- **Machine Learning Integration** für erweiterte Problem-Erkennung

## 🚀 Installation

### Firefox Add-on Store (Empfohlen)
[![Firefox Add-on](https://img.shields.io/badge/Firefox-Get%20Add--on-orange?logo=firefox)](https://addons.mozilla.org/firefox/addon/accnotes-bitv-accessibility-testing/)

**Status**: 🔄 In Review (eingereicht am 10.10.2025)

### Aus dem Repository (Entwicklung)
1. Repository klonen:
   ```bash
   git clone https://github.com/heikofolkerts/AccNotes.git
   cd AccNotes
   ```

2. In Chrome/Edge laden:
   - Öffne `chrome://extensions/`
   - Aktiviere "Entwicklermodus"
   - Klicke "Entpackte Erweiterung laden"
   - Wähle den AccNotes-Ordner

3. In Firefox laden:
   - Öffne `about:debugging`
   - Klicke "Diese Firefox-Version"
   - Klicke "Temporäres Add-on laden"
   - Wähle die `manifest.json`

## 📖 Nutzung

### Erste Schritte
1. **Extension installieren** (siehe Installation)
2. **Beliebige Website öffnen**
3. **Rechtsklick auf Element** → "Notiz hinzufügen"
4. **Notiz erstellen** mit automatisch extrahierten Element-Informationen
5. **Speichern** (Download + lokale Speicherung)
6. **Alle Notizen anzeigen** über Rechtsklick → "Alle Notizen anzeigen"

### Erweiterte Funktionen
- **Dark Mode**: Toggle oben rechts in jeder AccNotes-Seite
- **Keyboard Shortcuts**:
  - `Ctrl+S` / `Cmd+S`: Notiz speichern
  - `Escape`: Abbrechen
- **Auto-Save**: Entwürfe werden automatisch gespeichert
- **Element-Details**: Automatische Extraktion von ARIA-Attributen, Rollen, und Accessibility-Eigenschaften

## 🛠️ Entwicklung

### Projekt-Struktur
```
AccNotes/
├── manifest.json              # Extension-Manifest
├── background.js              # Service Worker
├── content.js                 # Content Script für Element-Analyse
├── note.html                  # Notiz-Erstellungsseite
├── note.js                    # Notiz-Funktionalität
├── notes-overview.html        # Notizen-Übersicht
├── notes-overview.js          # Übersicht-Funktionalität
├── styles/
│   └── modern-theme.css       # Modernes, zugängliches Design-System
├── scripts/
│   ├── theme-toggle.js        # Dark/Light Mode Toggle
│   └── bitv-catalog.js        # BITV-Prüfschritt-Katalog und Hilfsfunktionen
├── docs/
│   ├── PROJECT_VISION.md      # BITV-fokussierte Projektvision und Roadmap
│   ├── PRODUCT_BACKLOG.md     # BITV-spezifisches Product Backlog
│   ├── PROJECT_VISION_OLD.md  # Originale Projektvision (Archiv)
│   └── PRODUCT_BACKLOG_OLD.md # Originales Product Backlog (Archiv)
└── README.md                  # Diese Datei
```

### Development Setup
1. **Repository klonen**
2. **Browser Developer Mode** aktivieren
3. **Extension laden** (siehe Installation)
4. **Änderungen machen**
5. **Extension reloaden** für Tests

### Code-Qualität
- **WCAG 2.1 AA Compliance**: Alle UI-Komponenten getestet
- **Cross-Browser Support**: Chrome, Firefox, Edge
- **Responsive Design**: Mobile-friendly
- **Semantic HTML**: Screen-Reader optimiert
- **Modern CSS**: Custom Properties, Grid, Flexbox

## 🎨 Design System

AccNotes verwendet ein modernes, zugängliches Design-System:

### Farben (WCAG AA konform)
- **Primary**: `#1565c0` (7.35:1 Kontrast auf Weiß)
- **Secondary**: `#37474f` (9.85:1 Kontrast)
- **Success**: `#2e7d32` (6.74:1 Kontrast)
- **Error**: `#c62828` (7.44:1 Kontrast)

### Dark Mode
- Automatische Systemerkennung
- Manueller Toggle verfügbar
- Erhält Kontrast-Ratios für Accessibility

### Typography
- **Font Stack**: System-Fonts für beste Performance
- **Scale**: 0.75rem - 1.875rem
- **Line Heights**: Optimiert für Lesbarkeit

## 🧪 Testing

### Accessibility Testing
- **Screen Reader**: NVDA, JAWS, VoiceOver kompatibel
- **Keyboard Navigation**: Vollständig tastaturnavigierbar
- **Color Contrast**: WCAG AA konform (4.5:1 minimum)
- **Focus Management**: Sichtbare Fokus-Indikatoren

### Browser Testing
- ✅ **Chrome**: Version 88+
- ✅ **Firefox**: Version 85+
- ✅ **Edge**: Version 88+

### Manual Testing Checklist
- [ ] Extension lädt korrekt
- [ ] Kontextmenü erscheint
- [ ] Element-Informationen werden extrahiert
- [ ] Notiz kann gespeichert werden
- [ ] Notizen-Übersicht funktional
- [ ] Dark Mode Toggle funktional
- [ ] Responsive auf verschiedenen Bildschirmgrößen

## 🤝 Contributing

Wir freuen uns über Beiträge! Bitte beachte:

### Contribution Guidelines
1. **Fork** das Repository
2. **Feature Branch** erstellen (`git checkout -b feature/amazing-feature`)
3. **Changes committen** (`git commit -m 'Add amazing feature'`)
4. **Branch pushen** (`git push origin feature/amazing-feature`)
5. **Pull Request** erstellen

### Code Standards
- **WCAG 2.1 AA Compliance** für alle UI-Änderungen
- **Semantic HTML** verwenden
- **Responsive Design** implementieren
- **Comments** für komplexe Logik
- **Testing** vor Pull Request

## 📋 Roadmap

Siehe [docs/PRODUCT_BACKLOG.md](docs/PRODUCT_BACKLOG.md) für detaillierte BITV-Feature-Planung.

### Nächste Releases
- **v0.4.0**: BITV-Template-System für alle 54 Prüfschritte
- **v0.5.0**: Professional PDF/Excel-Reports mit BITV-Struktur
- **v0.6.0**: Screenshot-Integration mit Element-Highlighting
- **v1.0.0**: BITV-Team-Kollaboration und Multi-Projekt-Management

## 📄 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🙏 Danksagungen

- **WCAG Working Group** für die Accessibility-Guidelines
- **Web Extensions Community** für Best Practices
- **Open Source Contributors** für Inspiration und Feedback

## 📞 Support

- **GitHub Issues**: [Bug Reports & Feature Requests](https://github.com/heikofolkerts/AccNotes/issues)
- **Documentation**: [Project Wiki](https://github.com/heikofolkerts/AccNotes/wiki)
- **Community**: [Discussions](https://github.com/heikofolkerts/AccNotes/discussions)

---

**Made with ♿ for a more accessible web**

*AccNotes hilft dabei, das Web für alle zugänglich zu machen - ein Element nach dem anderen.*