# AccNotes 🌟

> **Professional Browser Extension for Accessibility Testing & Documentation**

AccNotes ist eine spezialisierte Browser-Extension für UX/UI-Designer, Entwickler und Accessibility-Experten zur effizienten Dokumentation von Barrierefreiheitsbefunden während der Website-Analyse.

![AccNotes Demo](https://img.shields.io/badge/Version-0.3.0-brightgreen)
![BITV Support](https://img.shields.io/badge/BITV-Softwaretest%20Ready-blue)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-blue)
![Browser Support](https://img.shields.io/badge/Browser-Chrome%2C%20Firefox%2C%20Edge-orange)

## ✨ Features

### 🎯 Aktuelle Funktionen (v0.3.0 - BITV-Edition)
- **Kontextmenü-Integration**: Schnelle Notizenerstellung per Rechtsklick
- **BITV-Prüfschritt-Integration**: Vollständiger Katalog aller 54 BITV-Prüfschritte von bit-inklusiv.de
- **Strukturierte Bewertung**: Bewertungssystem (Bestanden/Nicht bestanden/Teilweise/Zu überprüfen)
- **BITV-Filter & Suche**: Erweiterte Filter nach Kategorien, Bewertungen und Prüfschritten
- **BITV-Fortschritts-Dashboard**: Visuelle Fortschrittsanzeige pro BITV-Kategorie
- **Professional BITV-Reports**: Strukturierte BITV-Berichte für offizielle Dokumentation
- **Detaillierte Element-Analyse**: Automatische Extraktion von ARIA-Attributen, Fokus-Eigenschaften und Accessibility-Informationen
- **Moderne UI**: WCAG 2.1 AA konforme Benutzeroberfläche mit Dark Mode

### 🚀 Kommende BITV-Features (v0.4.0+)
- **BITV-Template-System** für alle 54 Prüfschritte mit vorgefertigten Texten
- **PDF/Excel-Reports** mit professioneller BITV-Struktur
- **BITV-Team-Kollaboration** und Prüfschritt-Assignment
- **Screenshot-Integration** mit Element-Highlighting
- **Multi-Projekt-Management** für größere BITV-Audits
- **KI-basierte Prüfschritt-Empfehlungen**

## 🚀 Installation

### Aus dem Repository
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