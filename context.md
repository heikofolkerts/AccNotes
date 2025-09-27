# AccNotes - Code-Basis Kontext

*Generiert am: 2024-12-24*
*Version: 0.4.0*
*Status: Product Backlog Item #3 ABGESCHLOSSEN*

## 🏗️ Projekt-Architektur

### **Kern-Technologie**
- **Browser Extension** (Manifest V2)
- **Vanilla JavaScript** (ES6+)
- **LocalStorage** für Datenpersistenz
- **CSS Grid/Flexbox** für responsive UI
- **WCAG 2.1 AA** konformes Design

### **Haupt-Komponenten**

```
AccNotes/
├── manifest.json                 # Extension Manifest (v0.4.0)
├── background.js                # Service Worker/Background Script
├── content.js                   # Content Script (Kontextmenü-Integration)
├── note.html + note.js          # Einzelnotiz-Editor
├── notes-overview.html + .js    # Hauptanwendung (Notizen-Übersicht)
├── styles/modern-theme.css      # Modernes Design-System
├── scripts/
│   ├── theme-toggle.js          # Dark/Light Mode Toggle
│   └── bitv-catalog.js          # BITV-Prüfschritt-Datenbank (54 Schritte)
└── docs/
    ├── PRODUCT_BACKLOG.md       # Agile Entwicklungsplanung
    ├── PROJECT_VISION.md        # Produktvision und Personas
    └── CHANGELOG.md             # Release-Historie
```

## 🎯 Aktuelle Features (v0.4.0)

### **✅ ABGESCHLOSSEN: Erweiterte BITV-Notizen-Verwaltung**

#### **1. BITV-Integration (54 Prüfschritte)**
- **Vollständiger BITV-Katalog** von bit-inklusiv.de
- **5 Hauptkategorien**: Wahrnehmbarkeit, Bedienbarkeit, Verständlichkeit, Robustheit, Interoperabilität
- **4 Bewertungsstufen**: Bestanden, Nicht bestanden, Teilweise, Zu überprüfen
- **Automatische Titel-Generierung** basierend auf gewähltem Prüfschritt

#### **2. Advanced Filter-System**
```javascript
// Filter-Optionen (notes-overview.js)
- Textsuche (Titel, URL, Inhalt, BITV-Prüfschritte)
- BITV-Kategorie (5 Kategorien)
- BITV-Bewertung (4 Stufen)
- Notiz-Typ (BITV vs. Allgemein)
- Website-spezifisch (automatisch aus URLs extrahiert)
- Sortierung (Neueste, Älteste, Seite, BITV-Prüfschritt, Bewertung)
```

#### **3. Performance-Optimierung**
```javascript
// Smart Caching System
let filteredNotesCache = null;
let lastFilterHash = '';
const PERFORMANCE_THRESHOLD = 200; // ms

// Virtualisierung für >100 Notizen
if (filteredNotes.length > 100) {
    renderNotesVirtualized(container, filteredNotes);
}
```

#### **4. Advanced BITV-Dashboard**
- **Gesamtfortschritt-Score**: Gewichtete Compliance-Berechnung
- **Problem-Website-Identifikation**: Top 5 problematischste Sites
- **Kategorien-Compliance**: Prozentuale BITV-Performance pro Kategorie
- **Website-übergreifende Analyse**: Vergleichsmetriken

#### **5. Bulk-Aktionen**
- **Export gefilterte Notizen**: Nur aktuell sichtbare Notizen
- **Bulk-Delete**: Löschen aller gefilterten Notizen mit Sicherheitsabfrage
- **Erweiterte CSV-Exporte**: BITV-Prüfschritt und Bewertung als Spalten
- **Aktive-Filter-Dokumentation**: Filter-Status in Exporten

## 📊 Datenmodell

### **Notiz-Struktur (localStorage)**
```javascript
{
  id: "note_1734960000000",           // Eindeutige ID (timestamp-basiert)
  timestamp: "2024-12-24T10:00:00Z",  // ISO-String
  url: "https://example.com/page",    // Seiten-URL
  title: "Seitentitel",               // Automatisch oder manuell
  pageTitle: "HTML <title>",          // Ursprünglicher HTML-Titel
  content: "Notiz-Beschreibung",      // Haupt-Notiz-Inhalt
  elementType: "button",              // Element-Typ (button, link, etc.)
  element: {                          // Element-Details
    type: "button",
    text: "Klick mich",
    ariaLabel: "Navigation Button",
    role: "button",
    // weitere ARIA-Attribute
  },
  fileName: "note-example.txt",       // Export-Dateiname

  // BITV-spezifische Daten (optional)
  bitvTest: {
    stepId: "1.1.1",                  // BITV-Prüfschritt-ID
    stepTitle: "Nicht-Text-Inhalte",  // Prüfschritt-Titel
    category: "wahrnehmbarkeit",      // BITV-Kategorie
    evaluation: "failed",             // Bewertung (passed/failed/partial/needs_review)
    level: "A",                       // WCAG-Level (A/AA/AAA)
    description: "...",               // Prüfschritt-Beschreibung
  },
  recommendation: "Verbesserungsvorschlag" // Optional: Empfehlung
}
```

### **BITV-Katalog-Struktur (bitv-catalog.js)**
```javascript
const BITV_CATEGORIES = [
  {
    id: "wahrnehmbarkeit",
    title: "1. Wahrnehmbarkeit",
    description: "Informationen und UI-Komponenten müssen..."
  }
];

const BITV_STEPS = [
  {
    id: "1.1.1",
    categoryId: "wahrnehmbarkeit",
    title: "Nicht-Text-Inhalte",
    level: "A",
    description: "Alle Nicht-Text-Inhalte...",
    quickInfo: "Alt-Texte für Bilder"
  }
];
```

## 🔧 Technische Details

### **Performance-Features**
```javascript
// 1. Smart Caching
function getFilteredNotesWithCache(notes) {
  const currentFilterHash = generateFilterHash();
  if (filteredNotesCache !== null && lastFilterHash === currentFilterHash) {
    return filteredNotesCache; // Cache Hit
  }
  // Cache Miss - neu berechnen
}

// 2. Virtualisierung
function renderNotesVirtualized(container, notes) {
  const ITEMS_PER_PAGE = 20;
  // Nur sichtbare Items rendern
}

// 3. Performance Monitoring
const startTime = performance.now();
// ... rendering logic ...
if (endTime - startTime > PERFORMANCE_THRESHOLD) {
  console.warn(`Performance warning: ${Math.round(endTime - startTime)}ms`);
}
```

### **UI-Architektur**
```css
/* Modern Design System (modern-theme.css) */
:root {
  /* Light Mode */
  --bg-primary: #ffffff;
  --text-primary: #1a1a1a;
  --accent: #2563eb;
  /* WCAG AA konforme Kontraste */
}

[data-theme="dark"] {
  /* Dark Mode */
  --bg-primary: #0f172a;
  --text-primary: #f8fafc;
  /* Umgekehrte, WCAG-konforme Farben */
}

/* Komponenten */
.btn, .form-input, .form-select { /* Konsistente UI-Komponenten */ }
.bitv-progress-bar { /* BITV-spezifische Visualisierungen */ }
.notes-virtualized { /* Performance-optimierte Listen */ }
```

## 🎯 Aktueller Status

### **✅ Abgeschlossene Items**
1. **UI/UX Modernisierung** (Item #1) - v0.2.0
2. **BITV-Prüfschritt Integration** (Item #2) - v0.3.0
3. **Erweiterte BITV-Notizen-Verwaltung** (Item #3) - v0.4.0 ✨

### **🚧 Nächste Prioritäten (Product Backlog)**
4. **BITV-Template-System** (Story Points: 8) - READY FOR DEVELOPMENT
5. **BITV-Reporting & Export** (Story Points: 13) - Geplant
6. **BITV-Fortschritts-Tracking** (Story Points: 8) - Geplant

### **🔄 Aktueller Entwicklungsstand**
- **Version**: 0.4.0 (deployed)
- **Branch**: main (up-to-date)
- **Performance**: <200ms für 1000+ Notizen ✅
- **WCAG-Konformität**: 2.1 AA Level ✅
- **Browser-Support**: Chrome, Firefox, Edge ✅

## 📋 Wichtige Code-Bereiche

### **1. Hauptanwendung (notes-overview.js)**
```javascript
// Kern-Funktionen:
- loadNotes()                    // Lädt alle Notizen aus localStorage
- displayNotes()                 // Rendert gefilterte/sortierte Notizen
- getFilteredNotesWithCache()    // Smart-Caching für Filter-Performance
- updateBitvDashboard()          // BITV-Analytics Dashboard
- exportFilteredNotes()          // Export nur sichtbarer Notizen
- bulkDeleteFiltered()           // Bulk-Löschung mit Sicherheitsabfrage

// Performance-kritische Bereiche:
- Filter-Algorithmen (kombinierbar)
- Virtualisierung für große Listen
- Dashboard-Berechnungen
```

### **2. BITV-Integration (bitv-catalog.js)**
```javascript
// API:
BitvCatalog.getCategories()      // Alle BITV-Kategorien
BitvCatalog.getStepsByCategory() // Prüfschritte pro Kategorie
BitvCatalog.getStepById()        // Einzelner Prüfschritt
BitvCatalog.validateStep()       // Prüfschritt-Validierung
```

### **3. Notiz-Editor (note.js)**
```javascript
// BITV-Workflow:
- Prüfschritt-Auswahl über Dropdowns
- Automatische Titel-Generierung
- Bewertungs-Interface
- Element-Analyse mit ARIA-Extraktion
```

## 🛠️ Entwicklungs-Guidelines

### **Code-Qualität**
- **Vanilla JavaScript** (keine Frameworks)
- **Modulare Funktionen** mit klaren Verantwortlichkeiten
- **Performance-First**: Caching und Optimierung für große Datenmengen
- **WCAG 2.1 AA**: Accessibility in allen UI-Komponenten
- **Deutsche Lokalisierung**: UI und Fachterminologie

### **BITV-Standards**
- **bit-inklusiv.de Kompatibilität**: Offizielle deutsche BITV-Prüfschritte
- **Reporting-Konformität**: Deutsche BITV-Audit-Standards
- **Fachterminologie**: Korrekte Verwendung von BITV-Begriffen

### **Performance-Ziele**
- **<200ms** Rendering für 1000+ Notizen
- **Smart Caching** für wiederholte Filter-Operationen
- **Memory-Efficient**: Keine Memory Leaks bei großen Datenmengen
- **Responsive UI**: Flüssige Interaktion auch bei vielen Notizen

## 🔮 Technische Schulden & TODOs

### **Bekannte Limitierungen**
- **localStorage-Größe**: Browser-Limit bei sehr großen Notizen-Sammlungen
- **Manifest V2**: Migration zu V3 für zukünftige Browser-Kompatibilität
- **Offline-Sync**: Keine Cloud-Synchronisation zwischen Geräten

### **Optimierungspotential**
- **IndexedDB**: Für unbegrenzte lokale Speicherkapazität
- **Service Worker**: Für echte Offline-Funktionalität
- **Virtual Scrolling**: Noch bessere Performance bei 10.000+ Notizen
- **Data Export**: Strukturierte API für externe Tools

---

## 📚 Wichtige Referenzen

- **BITV-Standard**: https://www.bit-inklusiv.de/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/
- **Chrome Extensions**: https://developer.chrome.com/docs/extensions/
- **Accessibility Testing**: https://web.dev/accessibility/

---

*Diese Datei wird bei größeren Code-Änderungen aktualisiert.*
*Letzte Aktualisierung: v0.4.0 (Product Backlog Item #3 ABGESCHLOSSEN)*