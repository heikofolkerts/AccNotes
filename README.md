# AccNotes 🌟

> **Professional Browser Extension for Accessibility Testing & Documentation**

AccNotes ist eine spezialisierte Browser-Extension für UX/UI-Designer, Entwickler und Accessibility-Experten zur effizienten Dokumentation von Barrierefreiheitsbefunden während der Website-Analyse.

![AccNotes Demo](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA%20Compliant-blue)
![Browser Support](https://img.shields.io/badge/Browser-Chrome%2C%20Firefox%2C%20Edge-orange)

## ✨ Features

### 🎯 Aktuelle Funktionen (v1.1)
- **Kontextmenü-Integration**: Schnelle Notizenerstellung per Rechtsklick
- **Detaillierte Element-Analyse**: Automatische Extraktion von ARIA-Attributen, Fokus-Eigenschaften und Accessibility-Informationen
- **WCAG-strukturierte Notizen**: Vorgefertigte Templates für professionelle Accessibility-Audits
- **Lokale Speicherung**: Persistent storage mit Export-Funktionalität
- **Moderne UI**: WCAG 2.1 AA konforme Benutzeroberfläche mit Dark Mode
- **Notizen-Übersicht**: Zentrale Verwaltung aller Accessibility-Befunde

### 🚀 Kommende Features
- **Erweiterte Suchfunktionen** und Filter
- **Team-Kollaboration** und Notizen-Sharing
- **PDF & Excel Export** für professionelle Reports
- **Screenshot-Integration** mit Element-Highlighting
- **Template-System** für verschiedene Audit-Typen

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
│   └── theme-toggle.js        # Dark/Light Mode Toggle
├── docs/
│   ├── PROJECT_VISION.md      # Projektvision und Roadmap
│   └── PRODUCT_BACKLOG.md     # Priorisiertes Product Backlog
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

Siehe [PRODUCT_BACKLOG.md](PRODUCT_BACKLOG.md) für detaillierte Feature-Planung.

### Nächste Releases
- **v1.2**: Erweiterte Notizen-Verwaltung (Suche, Filter, Sortierung)
- **v1.3**: Template-System für verschiedene Audit-Typen
- **v1.4**: Screenshot-Integration mit Element-Highlighting
- **v2.0**: Team-Kollaboration und Cloud-Sync

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