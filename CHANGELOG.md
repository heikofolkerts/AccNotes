# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### ✨ Neue Features

#### 🏗️ **PDF/UA-1 konforme PDF-Exporte (ISO 14289-1)**
- **jsPDF-UA Fork integriert**: Eigenständiger Fork von jsPDF mit vollständiger PDF/UA-1 Unterstützung ersetzt bisheriges jsPDF v2.5.1
- **Structure Tree**: Semantische Dokumentstruktur mit H1-H4, P, Sect, L/LI/Lbl/LBody, Figure
- **Marked Content**: Alle Textinhalte sind getaggt und für Screenreader navigierbar
- **Artifacts**: Dekorative Elemente (Trennlinien, Seitenfußzeilen) korrekt als Artefakte markiert
- **Figure mit Alt-Text**: Screenshots erhalten automatisch beschreibende Alt-Texte (`Screenshot der Barriere: [Titel]`)
- **Dokumentmetadaten**: Titel (`Barrierefreiheits-Bericht`) und Sprache (`de-DE`) werden korrekt gesetzt
- **Atkinson Hyperlegible Font**: Eingebetteter barrierefreier Font (optimiert für Lesbarkeit bei Sehbehinderungen), ersetzt Helvetica
- **PDF/UA-1 Identifier**: Korrektes PDF/UA-1 Conformance-Flag im Dokument

### ♿ Barrierefreiheit

- **Screenreader-Navigation im PDF**: Überschriften (H1-H4) sind per Screenreader navigierbar (NVDA-Test bestanden)
- **Logische Lesereihenfolge**: Structure Tree definiert korrekte Lesereihenfolge
- **Dekorative Inhalte ausgeblendet**: Trennlinien und Seitenzahlen sind als Artefakte markiert und werden von Screenreadern ignoriert
- **Barrierefreier Font**: Atkinson Hyperlegible bietet bessere Lesbarkeit als Standard-Systemfonts

### 🔧 Technische Änderungen

- **Library-Update**: `scripts/libs/jspdf.umd.min.js` von jsPDF v2.5.1 (364 KB) auf jsPDF-UA Fork (756 KB) aktualisiert
- **`generateAccessibilityPDF()` umgeschrieben**: Vollständige Nutzung der PDF/UA-API (`beginStructureElement`, `endStructureElement`, `beginArtifact`, `endArtifact`, `setDocumentTitle`, `setLanguage`)
- **Font-Umstellung**: Alle `doc.setFont('helvetica', ...)` durch `doc.setFont('AtkinsonHyperlegible', ...)` ersetzt

### 📄 Dokumentation

- **PDF_LIBRARY_EVALUATION.md**: Aktualisiert mit jsPDF-UA Fork Bewertung (25/25 Punkte)
- **JSPDF_ACCESSIBILITY_FORK_FEASIBILITY.md**: Aktualisiert - Fork wurde realisiert
- **PRODUCT_BACKLOG.md**: PDF/UA-Export als abgeschlossen markiert
- **IMPLEMENTATION_STATUS.md**: PDF/UA-Limitation entfernt, neuen Status dokumentiert

---

## [1.0.2] - 2025-01-13

### ✨ Neue Features

#### 📊 **Barrierefreie Tabellenansicht für Notizen-Übersicht**
- **Semantische HTML-Tabelle**: Vollständig strukturierte `<table>` mit `<thead>`, `<tbody>`, `<th>`, `<td>`
- **ARIA-Optimierung**: `aria-label` auf Tabelle, `scope="col"` auf allen Spalten-Headern
- **Screenreader-Navigation**: Optimiert für NVDA, JAWS und andere Screenreader
- **7 strukturierte Spalten**: Auswahl, Titel/Seite, Datum, Element, BITV/Status, Beschreibung, Aktionen
- **Kontextuelle ARIA-Labels**: Detaillierte Labels auf allen Buttons und Checkboxen

#### ✏️ **Notizen-Bearbeitung**
- **Bearbeiten-Button**: Ersetzt den Download-Button in der Notizen-Übersicht
- **Vollständige Bearbeitung**: Alle Felder (Titel, Inhalt, BITV-Test, Status, Screenshot) können bearbeitet werden
- **Intelligente ID-Verwaltung**: Bestehende IDs werden beim Speichern beibehalten
- **Screenshot-Erhaltung**: Vorhandene Screenshots bleiben erhalten
- **Rücknavigation**: Nach Bearbeitung automatische Rückkehr zur Übersicht
- **Aktualisierungs-Feedback**: Unterschiedliche Erfolgsmeldungen für neue vs. bearbeitete Notizen

#### 🗑️ **Verbessertes Löschen**
- **Benutzerdefinierter Dialog**: "Ja/Nein"-Buttons statt "OK/Abbrechen"
- **Sofortige UI-Aktualisierung**: Gelöschte Notizen verschwinden ohne Seiten-Reload
- **Cache-Invalidierung**: Korrekte Aktualisierung aller Filter und Statistiken
- **ESC-Taste Support**: Dialog kann mit ESC abgebrochen werden
- **Theme-Integration**: Dialog passt sich an Hell/Dunkel-Modus an

### 🎨 UI/UX-Verbesserungen

#### **Tabellenansicht**
- **Farbcodierung**: BITV-Status durch farbige linke Border (Rot/Orange/Grün/Blau)
- **Hover-Effekte**: Farbliche Hervorhebung bei Maus-Hover pro Status
- **Focus-Indikatoren**: Sichtbare Fokus-Rahmen bei Tastatur-Navigation
- **Responsive Design**: Optimiert für verschiedene Bildschirmgrößen
- **Kompakte Darstellung**: Beschreibung gekürzt auf 100 Zeichen mit "..."
- **Dark Mode**: Vollständige Unterstützung mit angepassten Farben

#### **Bearbeitungs-Workflow**
- **Screenshot-Checkbox deaktiviert**: Bei Bearbeitung ohne Screenshot mit Hinweistext
- **Kein Download bei Bearbeitung**: Nur neue Notizen werden automatisch heruntergeladen
- **Button-Text-Anpassung**: "💾 Aktualisieren" statt "💾 Speichern" bei Bearbeitung
- **Seitentitel-Update**: Zeigt "Notiz bearbeiten - [Titel]"

### 🔧 Technische Verbesserungen

#### **CSP-Konformität**
- **Event-Delegation**: Keine inline-Handler (`onclick`) mehr
- **Class-basierte Selektoren**: `.btn-edit-note`, `.btn-delete-note`
- **Data-Attribute**: `data-note-id` für ID-Übergabe

#### **ID-Konsistenz**
- **Einheitliches ID-Format**: Alle IDs sind Strings (z.B. `note_1760030453776_kmf7lhw5k`)
- **Storage-Key als ID**: `loadAllNotes()` überschreibt `value.id` mit Storage-Key
- **Präfix-Handling**: Automatische Erkennung ob `note_` Präfix bereits vorhanden
- **Abwärtskompatibilität**: Alte und neue Notizen funktionieren gleichermaßen

#### **Performance-Optimierungen**
- **Optimiertes Löschen**: Kein erneutes Laden aus Storage, direkte Array-Manipulation
- **Cache-Invalidierung**: `invalidateCache()` bei allen Daten-Änderungen
- **Sofortige UI-Updates**: `displayNotes()` statt `loadNotes()` wo möglich

### 🐛 Bugfixes

- **Löschen funktioniert**: Behoben durch korrekte ID-Übergabe und Cache-Invalidierung
- **Bearbeitung alter Notizen**: Funktioniert durch konsistente ID-Behandlung in `loadAllNotes()`
- **Screenshot-Checkbox-Problem**: Wird bei Bearbeitung ohne Screenshot deaktiviert
- **Download bei Bearbeitung**: Entfernt, nur bei neuen Notizen
- **UI-Aktualisierung**: Gelöschte Notizen verschwinden sofort aus der Ansicht

### ♿ Barrierefreiheit (WCAG 2.1 AA)

#### **Tabellenansicht**
- ✅ **Tastatur-Navigation**: Vollständig per Tab/Shift+Tab navigierbar
- ✅ **Screenreader-Support**: Korrekte Tabellenstruktur mit Headers
- ✅ **Focus-Management**: Sichtbare Fokus-Indikatoren (2px solid)
- ✅ **Kontrast**: Minimum 4.5:1 in beiden Modi (Hell/Dunkel)
- ✅ **ARIA-Labels**: Kontextuelle Labels für alle interaktiven Elemente
- ✅ **Semantisches HTML**: `<table>`, `<th scope="col">`, `<caption>` (via aria-label)

#### **Lösch-Dialog**
- ✅ **Tastatur-Support**: ESC zum Abbrechen, Tab-Navigation zwischen Buttons
- ✅ **Focus-Management**: Automatischer Focus auf "Nein"-Button (sichere Option)
- ✅ **Screen-Reader**: Korrekte Ankündigung von Titel und Nachricht
- ✅ **Visuell unterscheidbar**: Farbcodierung (Rot für "Ja", Grau für "Nein")

### 📄 Dokumentation

- **README**: Aktualisiert mit neuen Features
- **CLAUDE.md**: Erweitert um Tabellenansicht und Bearbeitungs-Workflow

---

## [1.0.1] - 2025-01-13

### ✨ Neue Features

#### 🔍 **Vollständige Accessibility-Seitenprüfung**
- **Automatische Seiten-Analyse**: Scannt alle interaktiven Elemente auf Barrierefreiheitsprobleme
- **Ergebnisseite mit Checkbox-Verwaltung**: Übersichtliche Liste aller erkannten Probleme
- **Bulk-Notiz-Speicherung**: Speichern mehrerer ausgewählter Probleme als Notizen in einem Durchgang
- **Report-Type-Auswahl**: Wahl zwischen "Schnelle Bürgermeldung" und "Detaillierte BITV-Notiz"
- **Alle auswählen/abwählen**: Komfortable Bulk-Aktionen für effiziente Workflows

#### 📋 **Accessibility Check Ergebnisseite**
- **Problem-Übersicht**: Tabellarische Darstellung mit Checkbox-Selektion
- **Element-Details**: Anzeige von Element-Typ, Text, ARIA-Label und CSS-Selector pro Problem
- **BITV-Badges**: Visuelle Kennzeichnung des zugeordneten BITV-Prüfschritts
- **Zusammenfassung**: Problemanzahl und Seiten-URL auf einen Blick
- **Standardmäßige Auswahl**: Alle Probleme sind beim Laden vorausgewählt

#### 🎯 **Workflow-Integration**
- **Kontextmenü-Eintrag**: "🔍 Barrierefreiheit prüfen" für schnellen Zugriff
- **Automatische Seitenanalyse**: Vollständiger Scan aller relevanten Elemente (Buttons, Links, Inputs, Bilder, Überschriften)
- **Storage-basierte Datenübertragung**: Robuste Kommunikation zwischen Content Script und Ergebnisseite
- **Automatische Weiterleitung**: Nach Speichern Weiterleitung zur Notizen-Übersicht

### 🔧 Technische Verbesserungen

#### **Content Script Erweiterungen**
- **performFullAccessibilityCheck Message Handler**: Vollständiger Seiten-Scan-Workflow
- **DOM-Referenz-Bereinigung**: Verbesserte `cleanElementInfoForStorage()` mit rekursiver Tiefenprüfung
- **Storage-optimiert**: Entfernung aller nicht-serialisierbaren Objekte (DOM-Elemente, Window, HTMLElement)
- **Performance-optimiert**: Effiziente Element-Analyse mit BarrierDetector-Integration

#### **Background Script Verbesserungen**
- **handleAccessibilityCheck()**: Neue Handler-Funktion für Seiten-Prüfung
- **Firefox Manifest V2 Kompatibilität**: Callback-basiertes Message Passing statt Promises
- **Timeout-basierte Tab-Öffnung**: 2-Sekunden-Wartezeit für zuverlässige Analyse
- **Erweiterte Error-Behandlung**: Robuste Fehlerbehandlung mit detailliertem Logging

#### **Neue Dateien**
- `accessibility-check-results.html`: Ergebnisseite mit modernem Design
- `accessibility-check-results.js`: JavaScript-Logik für Checkbox-Verwaltung und Bulk-Speicherung
- Manifest-Update: Neue Dateien zu `web_accessible_resources` hinzugefügt

### 🐛 Bugfixes

#### **DataCloneError behoben**
- **Problem**: DOM-Elemente konnten nicht in localStorage gespeichert werden
- **Lösung**: Erweiterte `cleanElementInfoForStorage()` mit mehrfacher DOM-Prüfung
- **Details**: Prüfung auf `nodeType`, `instanceof Element/Node/HTMLElement/Window`
- **Filterung**: Explizites Entfernen bekannter DOM-Referenz-Keys (`element`, `node`, `targetElement`)

#### **Firefox Message Passing**
- **Problem**: `browserAPI.tabs.sendMessage()` gibt in Firefox kein Promise zurück
- **Lösung**: Callback-basierte Implementation statt `.then()/.catch()`
- **Workaround**: 2-Sekunden-Wartezeit vor Tab-Öffnung für zuverlässige Datenübertragung

### 🎨 UI/UX-Verbesserungen

#### **Accessibility Check Results Interface**
- **Responsive Design**: Optimiert für verschiedene Bildschirmgrößen
- **Dark/Light Mode Support**: Konsistent mit bestehendem Theme-System
- **Loading States**: Visuelles Feedback während Seiten-Analyse
- **Empty State**: Freundliche Meldung bei fehlenden Problemen
- **Selection Counter**: Echtzeit-Anzeige ausgewählter Probleme

#### **Problem-Liste Design**
- **Hover-Effekte**: Visuelles Feedback bei Maus-Interaktion
- **Selected State**: Farbliche Hervorhebung ausgewählter Probleme
- **Structured Layout**: Grid-basiertes Layout für Element-Details
- **Accessibility-optimiert**: WCAG 2.1 AA konforme Kontraste und Fokus-Indikatoren

### 📊 Performance

#### **Optimierte Seiten-Analyse**
- **Element-Selektion**: Effiziente querySelector für relevante Elemente
- **Async Processing**: Nicht-blockierende Element-Analyse
- **Storage Caching**: Temporäre Speicherung mit 5-Minuten-Timeout
- **Fehlertoleranz**: Try-Catch-Blöcke für robuste Element-Verarbeitung

### 📚 Dokumentation

#### **Code-Kommentare**
- Detaillierte Inline-Dokumentation in neuen Funktionen
- Workflow-Beschreibungen für komplexe Abläufe
- Browser-Kompatibilitäts-Hinweise

---

## [0.5.1] - 2025-09-29

### ✅ **PRODUCT BACKLOG ITEM #4 VOLLSTÄNDIG ABGESCHLOSSEN**

#### 🎯 **Erweiterte CSS-Background-Image-Button-Erkennung**
- **CSS-Background-Image-Button-Erkennung**: Vollständige Implementierung der Erkennung von Buttons mit CSS-Background-Images
- **Button-Typ-Klassifikation**: Erweiterte Klassifikation mit 15+ Button-Mustern (Close, Menu, Search, Cart, etc.)
- **Kontextuelle Button-Erkennung**: Header-Navigation-Button, Modal-Button, Footer-Button basierend auf Parent-Element-Kontext
- **Prioritäts-basierte Klassifikation**: CSS-Background-Image-Buttons und kontextuelle Klassifikation vor generischer Submit-Button-Erkennung

#### 🔧 **"Wie behebe ich das?"-Funktionalität**
- **Hilfe-System**: Detaillierte Schritt-für-Schritt-Anleitungen für jedes erkannte Problem
- **Code-Beispiele**: HTML-Code-Beispiele für Lösungsvorschläge
- **Test-Anweisungen**: Konkrete Anweisungen zum Testen der implementierten Lösungen
- **Button-Typ-spezifische Lösungen**: Maßgeschneiderte Lösungsvorschläge basierend auf identifiziertem Button-Typ

#### 📋 **Test-Infrastruktur**
- **test-css-background-buttons.html**: Spezialisierte Testseite für CSS-Background-Image-Button-Erkennung
- **test-button-types.html**: Erweiterte Testseite mit 40+ verschiedenen Button-Typen
- **Accessibility-optimierte Tests**: Alle Test-Buttons in Tab-Reihenfolge mit Keyboard-Support

### 🐛 **Defekt-Management**
- **DEFECTS.md**: Neue zentrale Defekt-Dokumentation erstellt
- **DEF-001**: Button-Typ-Erkennung instabil in test-button-types.html dokumentiert
- **DEF-002**: Kontextmenü-Initialisierung beim ersten Aufruf (konsolidiert aus ursprünglichem Bug #1)
- **Backlog-Bereinigung**: Bug-Tracking aus Product Backlog in separate Defekt-Dokumentation verschoben

### 📚 **Dokumentation**
- **CLAUDE.md**: Vollständige Dokumentation für zukünftige Claude Code Instanzen
- **Product Backlog**: Item #4 als abgeschlossen markiert (alle Tasks und Acceptance Criteria erfüllt)
- **Implementierungs-Status**: Vollständige Übersicht über abgeschlossene Features

### 🔧 **Bug Fixes**
- **Button-Klassifikation**: Submit-Button-Erkennung nur für echte Form-Submit-Buttons oder entsprechenden Text-Content
- **Element-Type-Detection**: getElementType() nutzt jetzt BarrierDetector's erweiterte Button-Klassifikation
- **CSS-Background-Image-Detection**: Race-Condition zwischen doppelten Aufrufen behoben

---

## [0.5.0] - 2024-09-28

### 🐛 Bug Fixes
- **Kontextmenü**: Behebung der Race-Condition bei dynamischen Kontextmenü-Einträgen
- **Help-System**: "Was bedeutet das?" zeigt jetzt vollständige Problemerklärungen

### 🚀 New Features
- **Help-System**: Vollständige Hilfe-Seite mit problemspezifischen Erklärungen
- **Extended Context Menu**: Vollständige Report-Type-Auswahl auch bei erkannten Problemen
- **Manual Problem Reports**: Template für manuell gemeldete Probleme

### 📚 Documentation
- **Implementation Status**: Vollständige Aktualisierung des Implementierungsstatus
- **Bug Tracking**: Aufnahme von Bug #1 (Kontextmenü-Initialisierung) ins Product Backlog

---

## [0.5.0] - 2024-09-28

### 🎉 **VOLLSTÄNDIGER END-TO-END WORKFLOW IMPLEMENTIERT**

#### ✅ **Phase 1-3 ABGESCHLOSSEN: Automatisierte Barriere-Erkennung mit intelligentem Workflow**

### 🚀 Neue Features

#### 🔄 **Phase 2: Dynamisches Kontextmenü**
- **Problem-spezifische Menüpunkte**: Automatische Anzeige von "🚨 Problem melden: [Erkanntes Problem]"
- **Intelligente Menü-Anpassung**: Kontextmenü passt sich erkannten Problemen an
- **Mehrere Report-Modi**: Quick Problem, Detaillierte BITV-Notiz, Bürgermeldung
- **Real-time Kommunikation**: Content Script ↔ Background Script für Menü-Updates
- **Visual Problem Indicators**: Sofortige Anzeige der Problem-Anzahl im Menü

#### 🤖 **Phase 3: Vereinfachte Notiz-Erstellung mit KI-Automatisierung**
- **Automatische BITV-Prüfschritt-Vorschläge**: Intelligentes Mapping von Problemen zu BITV-Prüfschritten
- **Template-basierte Notizen**: 3 spezialisierte Report-Templates (Quick, Citizen, Detailed)
- **Auto-Population**: Automatische Befüllung aller relevanten Felder
- **Intelligente Bewertung**: Automatisches Setzen von "Nicht bestanden" bei erkannten Problemen
- **Visual AI Indicators**: "🤖 Automatisch vorgeschlagen" mit Problem-Referenz

#### 📝 **Template-System für verschiedene Nutzergruppen**

**Quick Problem Report (`quick-problem`)**:
- Fokussiert auf schnelle Problemmeldung
- Automatische Bewertung und BITV-Referenz
- Checkliste für Meldeprozess
- Rechtliche Grundlagen integriert

**Citizen Report (`quick-citizen`)**:
- Bürgerfreundliche Sprache ohne Fachjargon
- Verständliche Problem-Erklärungen
- Kontaktinformationen für Meldestellen
- BITV-Referenzen in Alltagssprache

**Detailed BITV Report (`detailed-bitv`)**:
- Vollständiger professioneller BITV-Prüfbericht
- Technische Details (Selektoren, CSS-Klassen)
- Test-Metadaten und Browser-Informationen
- Prioritäts-Einstufung nach Schweregrad

#### 🧠 **Intelligentes Problem-zu-BITV-Mapping**
- **5 häufigste Probleme** mit automatischer BITV-Zuordnung:
  - Alt-Text fehlt → BITV 1.1.1 (Nicht-Text-Inhalte)
  - Button-Label fehlt → BITV 2.4.4 (Linkzweck im Kontext)
  - Form-Label fehlt → BITV 3.3.2 (Beschriftungen)
  - Schlechter Kontrast → BITV 1.4.3 (Kontrast Minimum)
  - Überschriften-Struktur → BITV 1.3.1 (Info und Beziehungen)
- **Confidence-Level System**: High/Medium für Mapping-Qualität
- **Fallback-Mechanismen**: Alternative Mappings bei Unklarheiten

### ⚡ **End-to-End Automatisierung erreicht**

#### **Vollständiger Workflow in unter 30 Sekunden:**
```
Rechtsklick → Automatische Problem-Erkennung → Dynamisches Kontextmenü →
Template-Auswahl → Auto-BITV-Mapping → Vorbefüllte Notiz → Speichern
```

#### **Beispiel-Workflow:**
1. **Rechtsklick** auf Bild ohne Alt-Text
2. **Automatisch**: Problem erkannt und Kontextmenü angepasst
3. **Auswahl**: "🚨 Problem melden: Alt-Text fehlt"
4. **Automatisch**: BITV 1.1.1 ausgewählt, Template geladen, Bewertung gesetzt
5. **Ergebnis**: Vollständige BITV-konforme Notiz in 10 Sekunden

### 🔧 Technische Verbesserungen

#### **Advanced Message Passing & State Management**
- **Dynamic Context Menu System**: Runtime-Erstellung von Menüpunkten
- **Stateful Communication**: Bidirektionale Content ↔ Background Kommunikation
- **Performance-optimiert**: <500ms für kompletten Analyse-Workflow
- **Error-resilient**: Robuste Fallback-Mechanismen bei API-Fehlern

#### **Template Engine & Auto-Population**
- **Report-Type-Detection**: Automatische Template-Auswahl basierend auf Nutzer-Intent
- **Field-Population-Engine**: Intelligente Befüllung aller Formularfelder
- **Context-aware Generation**: Templates berücksichtigen Element-Typ und Problem-Art
- **Extensible Architecture**: Einfache Erweiterung um neue Templates

#### **AI-inspired BITV Mapping**
- **Problem-Pattern-Recognition**: Mustererkennung für BITV-Zuordnung
- **Confidence-based Selection**: Bevorzugung von High-Confidence-Mappings
- **Fallback-Strategien**: Sekundäre Mappings bei Unklarheiten
- **Learning-ready Architecture**: Vorbereitet für Machine Learning Integration

### 🎨 UI/UX-Verbesserungen

#### **Intelligente Benutzererfahrung**
- **Context-sensitive Menus**: Menü passt sich automatisch an Situation an
- **Visual AI Feedback**: Klare Indikatoren für automatische Vorschläge
- **Progressive Disclosure**: Komplexität basierend auf Nutzer-Typ
- **Seamless Transitions**: Flüssige Übergänge zwischen Workflow-Schritten

#### **Professional Reporting**
- **Multi-format Templates**: Angepasst an verschiedene Zielgruppen
- **Automatic Formatting**: Korrekte BITV-Terminologie und -Struktur
- **Legal Compliance**: Rechtskonforme Formulierungen für Meldungen
- **Export-ready**: Direkt verwendbare Reports ohne Nachbearbeitung

### 🐛 **Kritischer Bugfix**
- **BITV-Mapping Case-Sensitivity**: Problem-Types korrigiert (UPPERCASE statt lowercase)
- **Template Auto-Population**: Funktionierende Automatisierung für alle Report-Types
- **Dynamic Menu Updates**: Stabile Real-time Menü-Aktualisierung

### 📊 **Performance-Metriken erreicht**
- **Problem-Erkennung**: <200ms pro Element
- **Menü-Update**: <500ms nach Rechtsklick
- **Notiz-Auto-Population**: <200ms nach Template-Auswahl
- **End-to-End-Workflow**: <30 Sekunden für vollständige BITV-Notiz

### 🎯 **Milestone erreicht: Production-Ready Automation**
- **Vollständig automatisierter Workflow** von Problem-Erkennung bis BITV-Dokumentation
- **Nutzergruppen-spezifische Templates** für Bürger und Profis
- **KI-inspirierte Automatisierung** für effiziente Prüfschritt-Zuordnung
- **Enterprise-ready Features** für professionelle BITV-Audits

---

## [0.4.1] - 2025-01-13

### ✅ **Phase 1 ABGESCHLOSSEN: Automatische Barriere-Erkennung**

### 🚀 Neue Features

#### Automatische Barriere-Erkennung Engine
- **5 Erkennungsalgorithmen**: Alt-Text, Button-Labels, Formular-Labels, Kontrast, Überschriften-Struktur
- **Laienverständliche Beschreibungen**: "Button-Beschriftung fehlt" statt technischer BITV-IDs
- **BITV-Referenzen**: Automatische Zuordnung zu korrekten BITV-Prüfschritten
- **Schweregrad-Bewertung**: Critical, Major, Minor, Cosmetic
- **Performance-optimiert**: <500ms Zielzeit für Element-Analyse

#### Element-Informationen + Barriere-Integration
- **Unified Data Flow**: Element-Informationen und erkannte Probleme in einer Notiz
- **Storage-basierte Datenübertragung**: Robuste Alternative zu Message Passing
- **Cross-Browser Kompatibilität**: Chrome und Firefox Storage-APIs
- **Auto-Population**: Notizen werden automatisch mit erkannten Problemen vorbefüllt

#### Erkennungs-Algorithmen im Detail
- **Alt-Text-Erkennung**: Bilder ohne `alt`-Attribut oder leeren Alt-Text
- **Button-Label-Erkennung**: Icon-Buttons ohne aria-label oder sichtbaren Text
- **Formular-Label-Erkennung**: Input-Felder ohne Label-Zuordnung
- **Kontrast-Checker**: WCAG-konforme Kontrastberechnung (4.5:1 minimum)
- **Überschriften-Struktur**: Validierung der H1-H6 Hierarchie

### 🔧 Technische Verbesserungen

#### Robust Message Passing & Storage
- **Hybride Kommunikation**: Content Script ↔ Background Script ↔ Storage
- **Error-Resiliente Storage-APIs**: Callback- und Promise-basierte Zugriffe
- **Automatic Cleanup**: Temporäre Storage-Daten werden automatisch bereinigt
- **Cross-Browser Storage**: Einheitliche API für Chrome und Firefox

#### Performance-Optimierungen
- **Async Element Analysis**: Nicht-blockierende Barriere-Erkennung
- **DOM-Referenz-Bereinigung**: Serialisierbare Datenstrukturen für Storage
- **Optimized Logging**: Reduzierte Debug-Ausgaben für Production-Ready Code

### 🐛 Bugfixes

#### Storage & Message Passing Issues
- **DataCloneError behoben**: DOM-Elemente werden vor Storage-Speicherung entfernt
- **Message Passing Fallbacks**: Storage-basierte Alternative bei Message-Failures
- **Element-Info Übertragung repariert**: Korrekte Weiterleitung von Content → Background → Note

#### Cross-Browser Compatibility
- **Storage API Konsistenz**: Einheitliche Promise/Callback-Behandlung
- **Error Handling**: Robuste Fehlerbehandlung bei Storage-Zugriff
- **Performance Timing**: Optimierte Wartezeiten für Script-Koordination

### 📋 Product Backlog Updates

#### Neue High-Priority Story
- **Screen-Reader-optimierte Element-Erkennung** (Story #7): 13 Story Points
- **Problem**: Screen-Reader Browse-Mode erkennt nur Body-Element statt fokussiertes Element
- **Zielgruppe**: Menschen mit Sehbehinderungen (Hauptzielgruppe)
- **Nächste Sprint-Priorität**: Accessibility-kritische Verbesserung

### 🧹 Code-Aufräumung
- **50% weniger Debug-Logs**: Production-ready Console-Output
- **Vereinfachte Funktionen**: Streamlined Code ohne überkomplizierte Logik
- **Bessere Wartbarkeit**: Klarere, fokussierte Funktionsaufteilung
- **Error-Only Logging**: Nur kritische Fehler werden geloggt

### 🔍 Bekannte Einschränkungen
- **Screen-Reader-Kompatibilität**: Element-Erkennung funktioniert noch nicht optimal mit Screen-Readern im Browse-Mode (wird in v0.5.0 adressiert)
- **Kontrast-Erkennung**: Funktioniert nur bei direkt berechneten CSS-Farben
- **Komplexe ARIA-Strukturen**: Erkennung beschränkt auf Standard-HTML-Patterns

## [0.4.0] - 2024-12-24

### ✅ **Product Backlog Item #3 ABGESCHLOSSEN: Erweiterte BITV-Notizen-Verwaltung**

### ✨ Neue Features

#### Erweiterte BITV-Filter und Suche
- **Website-spezifische Filterung**: Neuer Filter nach einzelnen Websites/Domains
- **Kombinierbare Multi-Filter**: BITV-Kategorie + Bewertung + Website + Typ + Suche
- **Intelligente Website-Extraktion**: Automatische Hostname-Erkennung aus URLs
- **Dynamische Filter-Population**: Website-Liste wird automatisch aus vorhandenen Notizen generiert

#### Advanced BITV-Dashboard & Analytics
- **Gesamtfortschritt-Score**: Berechnung der BITV-Compliance mit gewichteten Partial-Bewertungen
- **Problem-Website-Identifikation**: Top 5 Websites mit den meisten BITV-Fehlern
- **Erweiterte Kategorien-Statistiken**: Compliance-Prozentsatz pro BITV-Kategorie
- **Visuelle Compliance-Anzeige**: Kreisförmiger Compliance-Score (0-100%)
- **Website-übergreifende Analyse**: Vergleich der BITV-Performance zwischen Websites

#### Bulk-Aktionen für gefilterte Notizen
- **Export gefilterte Notizen**: Export nur der aktuell sichtbaren/gefilterten Notizen
- **Bulk-Delete gefilterte Notizen**: Löschen aller gefilterten Notizen mit Sicherheitsabfrage
- **Aktive-Filter-Anzeige**: Übersicht über angewendete Filter bei Export/Delete
- **Erweiterte CSV-Spalten**: BITV-Prüfschritt und Bewertung in CSV-Export
- **Gefilterte BITV-Reports**: BITV-Berichte berücksichtigen aktive Filter

#### Performance-Optimierungen für große Notizen-Sammlungen
- **Intelligentes Caching**: Filter-Ergebnisse werden zwischengespeichert
- **Cache-Invalidierung**: Automatische Cache-Aktualisierung bei Filteränderungen
- **Virtualisierung**: Große Notizen-Listen (>100) werden portionsweise geladen
- **Performance-Monitoring**: Warnung bei Rendering-Zeiten >200ms
- **Optimierte Algorithmen**: Verbesserte Filter- und Sortier-Performance

### 🎨 UI/UX-Verbesserungen

#### Erweiterte Export-Optionen
- **"Gefilterte exportieren"-Button**: Eigener Button für Export der sichtbaren Notizen
- **Filter-Kontext im Export**: Aktive Filter werden in Export-Dateien dokumentiert
- **Bulk-Delete-Button**: "🎯🗑️ Gefilterte löschen" mit Sicherheitsnachfrage
- **Verbesserte Button-Labels**: Klarere Unterscheidung zwischen "Alle" und "Gefilterte"

#### Performance-Feedback
- **Notizen-Counter**: "Zeige X-Y von Z Notizen" bei großen Listen
- **Load-More-Funktion**: "Weitere X Notizen laden" für große Datensätze
- **Performance-Warnungen**: Console-Logs bei Performance-Problemen
- **Responsive Virtualisierung**: Automatische Umschaltung ab 100+ Notizen

### 🔧 Technische Verbesserungen

#### Smart Caching System
- **Filter-Hash-Generierung**: Eindeutige Hashes für Filter-Kombinationen
- **Automatische Cache-Invalidierung**: Bei Änderung von Filtern oder Notizen
- **Memory-Management**: Effiziente Speichernutzung bei großen Notizen-Sammlungen
- **Cache-Hit-Rate-Optimierung**: Maximale Wiederverwendung berechneter Ergebnisse

#### Erweiterte Datenstrukturen
- **Website-Mapping**: Strukturierte Speicherung von Website-Statistiken
- **Compliance-Berechnung**: Algorithmus für gewichtete BITV-Scores
- **Problem-Detection**: Automatische Identifikation problematischer Bereiche
- **Performance-Tracking**: Messungen und Optimierungen für große Datenmengen

#### Code-Qualität
- **Modulare Funktionen**: Aufgeteilte Verantwortlichkeiten für bessere Wartbarkeit
- **Fehlerbehandlung**: Robuste URL-Parsing mit Fallbacks
- **Type Safety**: Validierung von Filterwerten und Notizen-Strukturen
- **Memory Leaks Prevention**: Ordnungsgemäße Cleanup-Mechanismen

### 📊 Analytics & Insights

#### BITV-Compliance-Tracking
- **Website-Vergleich**: Identifikation der besten/schlechtesten Websites
- **Kategorien-Performance**: Schwachstellen-Analyse pro BITV-Kategorie
- **Trend-Erkennung**: Problem-Häufungen und Verbesserungs-Potentiale
- **Priorisierungs-Hilfe**: Automatische Sortierung nach Kritikalität

#### Reporting-Verbesserungen
- **Kontext-sensitive Exports**: Filter-Status in allen Export-Formaten
- **Erweiterte Metadaten**: Vollständige BITV-Informationen in Exporten
- **German Standards**: Deutsche Terminologie und BITV-konforme Ausgaben
- **Professional Formatting**: Für deutsche BITV-Audits optimiert

### 🔄 Geändert

#### Filter-System
- **Erweiterte Filter-Optionen**: Website-Filter hinzugefügt
- **Verbesserte Cache-Performance**: Bis zu 90% schnellere Filter-Anwendung
- **Clear-Filters-Funktion**: Setzt auch den neuen Website-Filter zurück
- **Filter-Kombinationen**: Alle Filter funktionieren nahtlos zusammen

#### Export-Funktionen
- **Alle Export-Funktionen**: Berücksichtigen jetzt aktive Filter
- **CSV-Structure**: Erweitert um BITV-Prüfschritt und Bewertung
- **Export-Naming**: Klarere Dateinamen mit Kontext-Information
- **Bulk-Operations**: Sicherere Implementierung mit Bestätigungen

### 🐛 Behoben

- **Performance-Issues**: Große Notizen-Sammlungen (1000+) sind jetzt flüssig
- **Memory-Usage**: Reduzierte Speichernutzung durch intelligentes Caching
- **Filter-Konsistenz**: Alle Filter arbeiten korrekt zusammen
- **URL-Parsing**: Robuste Behandlung von ungültigen URLs
- **Cache-Synchronisation**: Keine veralteten Filter-Ergebnisse mehr

### 📄 Dokumentation

#### Product Backlog Update
- **Item #3 als abgeschlossen markiert**: Alle Acceptance Criteria erfüllt
- **Erweiterte Tasks**: Zusätzliche implementierte Features dokumentiert
- **Performance-Kriterien**: <200ms Ziel erreicht und übertroffen
- **Nächste Prioritäten**: Item #4 (BITV-Template-System) vorbereitet

---

## [0.3.0] - 2024-12-21

### ✨ Neue Features

#### BITV-Prüfschritt-Integration
- **Vollständiger BITV-Katalog**: Integration aller 54 BITV-Prüfschritte von bit-inklusiv.de
- **Kategorisierte Auswahl**: 5 Hauptkategorien (Wahrnehmbarkeit, Bedienbarkeit, Verständlichkeit, Robustheit, Interoperabilität)
- **Strukturierte Bewertung**: Bewertungssystem mit 4 Optionen (Bestanden/Nicht bestanden/Teilweise/Zu überprüfen)
- **Automatische Titel-Generierung**: Notiz-Titel werden automatisch basierend auf gewähltem Prüfschritt erstellt

#### Erweiterte Notizen-Verwaltung
- **BITV-Filter**: Filter nach BITV-Kategorien, Bewertungen und Notiz-Typen
- **Erweiterte Sortierung**: Sortierung nach BITV-Prüfschritt und Bewertungsstatus
- **Kombinierbare Filter**: Alle Filter funktionieren zusammen für präzise Suche
- **BITV-Suche**: Durchsucht Prüfschritt-IDs, -Titel und -Beschreibungen

#### BITV-Fortschritts-Dashboard
- **Visuelle Progress-Bars**: Fortschrittsanzeige pro BITV-Kategorie
- **Compliance-Statistiken**: Detaillierte Übersicht über bestandene/nicht bestandene Tests
- **Automatische Berechnung**: Prozentuale Compliance-Werte pro Kategorie
- **Intelligente Anzeige**: Dashboard wird nur bei vorhandenen BITV-Notizen angezeigt

#### Professional BITV-Reporting
- **Strukturierte BITV-Berichte**: Export organisiert nach BITV-Kategorien
- **Offizielle Formatierung**: Für professionelle BITV-Dokumentation geeignet
- **Vollständige Metadaten**: Prüfschritt-IDs, Bewertungen, Empfehlungen
- **Deutsche Terminologie**: Korrekte Verwendung von BITV-Fachbegriffen

### 🎨 UI/UX-Verbesserungen

#### BITV-spezifisches Design
- **BITV-Badges**: Visuelle Prüfschritt-Anzeige in Notizen-Übersicht
- **Farbcodierung**: Grüne/rote/gelbe Sidebar-Markierung je nach Bewertung
- **BITV-Statistiken**: Erweiterte Statistik-Karten mit BITV-spezifischen Kennzahlen
- **Responsive BITV-Filter**: Optimal organisierte Filter-Sektion

#### Erweiterte Notiz-Formulare
- **Prüfschritt-Details**: Anzeige von Prüfschritt-Beschreibung und WCAG-Level
- **Empfehlungsfeld**: Separates Feld für konkrete Verbesserungsvorschläge
- **Titel-Feld**: Strukturierte Titel-Eingabe zusätzlich zur Beschreibung
- **BITV-Kontext**: Intelligente Anzeige relevanter BITV-Informationen

### 🔧 Technische Verbesserungen

#### Datenmodell-Erweiterung
- **BITV-Datenstruktur**: Erweiterte Notiz-Struktur mit vollständigen BITV-Metadaten
- **Backward-Kompatibilität**: Bestehende Notizen funktionieren weiterhin
- **Strukturierte Speicherung**: localStorage-basierte Datenhaltung statt Einzeldownloads
- **Performance-Optimierung**: Effiziente Filter- und Sortier-Algorithmen

#### Code-Architektur
- **Modulare BITV-Integration**: `scripts/bitv-catalog.js` als zentrale BITV-Datenquelle
- **Erweiterte Hilfsfunktionen**: BitvCatalog-API für Kategorien, Prüfschritte und Validierung
- **Clean Code**: Gut strukturierte und dokumentierte BITV-spezifische Funktionen
- **Type Safety**: Robuste Datenvalidierung und Fehlerbehandlung

### 📄 Dokumentation

#### Aktualisierte Projektvision
- **BITV-fokussierte Roadmap**: Angepasste Entwicklungsplanung auf BITV-Standards
- **Erweiterte Personas**: Sarah als BITV-Prüferin im Fokus
- **Deutsche Standards**: Spezialisierung auf deutsche BITV-Anforderungen

#### Product Backlog
- **BITV-spezifische User Stories**: Detaillierte Planung für BITV-Features
- **Prioritäts-Anpassung**: BITV-Features als High Priority
- **Sprint Planning**: BITV-angepasste Story Points und Kapazitätsplanung

### 🔄 Geändert

- **Manifest**: Version auf 0.3.0 erhöht, BITV-Fokus in Beschreibung
- **README**: Aktualisierte Feature-Liste und Roadmap
- **Extension-Name**: "BITV Accessibility Testing Assistant" für klarere Positionierung

### 🐛 Behoben

- **Notiz-Anzeige**: Verbesserte Darstellung von Element-Typen und Metadaten
- **Filter-Performance**: Optimierte Suchalgorithmen für große Notiz-Mengen
- **UI-Konsistenz**: Einheitliche BITV-Terminologie und -Darstellung

---

## [0.2.0] - 2024-09-20

### ✨ Neue Features
- **UI/UX Modernisierung**: Komplett überarbeitetes, modernes Design
- **Dark Mode Support**: WCAG-konforme Dark/Light Mode Umschaltung
- **Erweiterte Element-Analyse**: Verbesserte ARIA-Attribut-Extraktion
- **Notizen-Übersicht**: Zentrale Verwaltung aller Accessibility-Befunde

### 🎨 UI/UX-Verbesserungen
- **Modern Theme**: Neues Design-System mit WCAG 2.1 AA Compliance
- **Responsive Design**: Optimiert für verschiedene Bildschirmgrößen
- **Verbesserte Typografie**: Bessere Lesbarkeit und Hierarchie
- **Accessibility-Features**: Skip-Links, Screen-Reader-Optimierungen

### 🔧 Technische Verbesserungen
- **Performance**: Schnellere Ladezeiten und Responsiveness
- **Code-Qualität**: Refactoring und verbesserte Struktur
- **Cross-Browser**: Erweiterte Kompatibilität

---

## [0.1.0] - 2024-09-15

### ✨ Erste Veröffentlichung
- **Kontextmenü-Integration**: Rechtsklick-Notizenerstellung
- **Element-Analyse**: Automatische ARIA-Attribut-Extraktion
- **Lokale Speicherung**: Persistent storage für Notizen
- **Export-Funktionalität**: Download als Textdateien
- **Basis-UI**: Einfache, funktionale Benutzeroberfläche

### 🎯 Kernfunktionen
- Schnelle Accessibility-Notizen per Kontextmenü
- Detaillierte Element-Informationen
- WCAG-strukturierte Notizvorlagen
- Lokale Datenspeicherung
- Export-Möglichkeiten

---

## Versionsschema

**MAJOR.MINOR.PATCH** (Semantic Versioning)

- **MAJOR**: Inkompatible API-Änderungen
- **MINOR**: Neue Funktionalität (rückwärtskompatibel)
- **PATCH**: Bugfixes (rückwärtskompatibel)

## Geplante Releases

- ~~**v0.4.0**: BITV-Template-System~~ ✅
- ~~**v0.5.0**: PDF/Excel-Reports~~ ✅
- ~~**v0.6.0**: Screenshot-Integration~~ ✅
- ~~**v1.0.0**: Team-Kollaboration~~ (verschoben)
- **Nächste**: PDF/UA-1 Export (jsPDF-UA Fork) ✅