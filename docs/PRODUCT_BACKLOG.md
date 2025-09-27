# AccNotes - Product Backlog (Bürgermeldungen-fokussiert)

## 📋 Priorisiertes Product Backlog

*Neu-Priorisierung: Privatpersonen-Features vor Profi-Tools*

### 🔥 HIGH PRIORITY (Bürgermeldungen - Sofort umsetzbar)

#### 1. UI/UX Modernisierung *(Story Points: 8)* ✅ COMPLETED
**Status**: ✅ Abgeschlossen
- [x] Moderne, responsive Benutzeroberfläche
- [x] Dark Mode Support mit WCAG-konformen Kontrasten
- [x] Verbesserte Typografie und Spacing
- [x] Zugängliche Focus-Styles und Keyboard-Navigation
- [x] Skip-Links und Screen-Reader-Optimierungen

**Acceptance Criteria**:
- [x] WCAG 2.1 AA konform (Kontrast 4.5:1 minimum)
- [x] Cross-Browser kompatibel (Chrome, Firefox, Edge)
- [x] Responsive Design für verschiedene Bildschirmgrößen
- [x] Dark/Light Mode Toggle funktional

---

#### 2. BITV-Prüfschritt Integration *(Story Points: 13)* ✅ COMPLETED
**Status**: ✅ Abgeschlossen

**User Stories**:
- Als **Sarah (BITV-Prüferin)** möchte ich aus dem vollständigen BITV-Katalog auswählen können
- Als **Sarah** möchte ich Notizen spezifischen Prüfschritten zuordnen können
- Als **Max (Developer)** möchte ich verstehen, welcher BITV-Prüfschritt betroffen ist

**Tasks**:
- [x] BITV-Katalog von bit-inklusiv.de integrieren (54 Prüfschritte)
- [x] Kategorie-basierte Prüfschritt-Auswahl implementieren
- [x] Prüfschritt-Details Anzeige (Titel, Beschreibung, Level)
- [x] Bewertungssystem (Bestanden/Nicht bestanden/Teilweise/Zu überprüfen)
- [x] Erweiterte Notiz-Datenstruktur mit BITV-Zuordnung

**Acceptance Criteria**:
- [x] Alle 5 BITV-Kategorien verfügbar (Wahrnehmbarkeit, Bedienbarkeit, etc.)
- [x] Prüfschritt-Auswahl über Dropdown-Menüs
- [x] Automatische Titel-Generierung basierend auf Prüfschritt
- [x] BITV-konforme Dateiexporte mit Prüfschritt-Referenz

---

#### 3. Erweiterte BITV-Notizen-Verwaltung *(Story Points: 13)* ✅ COMPLETED
**Status**: ✅ Abgeschlossen

**User Stories**:
- Als **Sarah** möchte ich Notizen nach BITV-Prüfschritten filtern können
- Als **Sarah** möchte ich den Fortschritt pro Prüfschritt verfolgen können
- Als **Team** möchten wir BITV-Compliance-Übersichten haben

**Tasks**:
- [x] Suche & Filter nach BITV-Prüfschritten erweitern
- [x] Prüfschritt-basierte Sortierung implementieren
- [x] BITV-Fortschritts-Dashboard erstellen
- [x] Bulk-Aktionen für BITV-Reports
- [x] Prüfschritt-Statistiken anzeigen
- [x] Website-spezifische Filter hinzugefügt
- [x] Performance-Optimierung mit Caching implementiert
- [x] Export gefilterte Notizen Funktionalität
- [x] Bulk-Delete für gefilterte Notizen

**Acceptance Criteria**:
- [x] Filter nach BITV-Kategorie und Prüfschritt-ID
- [x] Fortschrittsanzeige pro Website/Prüfschritt
- [x] Übersicht über nicht-bestandene Prüfschritte
- [x] Bulk-Export nach BITV-Kriterien
- [x] Performance: <200ms für 1000+ BITV-Notizen (mit Caching und Virtualisierung)
- [x] Website-spezifische Filterung und Tracking
- [x] Erweiterte Dashboard-Statistiken mit Compliance-Score
- [x] Problem-Website-Identifikation

---

#### 4. Automatische Barriere-Erkennung für Bürgermeldungen *(Story Points: 21)*
**Status**: 📋 Ready for Development

**User Stories**:
- Als **Maria** möchte ich Probleme automatisch erkennen lassen, ohne technisches Wissen haben zu müssen
- Als **Thomas** möchte ich typische BITV-Verstöße schnell dokumentieren können
- Als **Petra** möchte ich Beratungsklienten einfach zeigen, was Barrieren sind

**Tasks**:
- [ ] Automatische Erkennung fehlender Alt-Texte auf Bildern
- [ ] Erkennung fehlender Alternativtexte auf Buttons (Icon-Buttons, Image-Buttons)
- [ ] Erkennung von Buttons ohne zugänglichen Namen (aria-label, aria-labelledby, Textinhalt)
- [ ] Spezielle Behandlung für häufige Button-Typen: Submit-Buttons, Close-Buttons, Menu-Toggle
- [ ] Erkennung von CSS-Background-Image-Buttons ohne Textinhalt
- [ ] Erkennung von Formularfeldern ohne Labels
- [ ] Kontrast-Checker für Text-Hintergrund-Kombinationen
- [ ] Überschriften-Struktur-Validator (H1-H6 Hierarchie)
- [ ] Integration in bestehendes Kontextmenü (keine zusätzlichen Buttons)
- [ ] Kontextmenü zeigt erkannte Probleme direkt an ("Button-Beschriftung fehlt", "Alt-Text fehlt")
- [ ] Automatische Vor-Ausfüllung der Notiz basierend auf erkanntem Problem
- [ ] Laienverständliche Problembeschreibungen (keine BITV-IDs)
- [ ] Automatische Lösungsvorschläge für häufige Probleme

**Acceptance Criteria**:
- [ ] Automatische Erkennung von mind. 5 häufigsten Barriere-Typen:
  - [ ] Bilder ohne Alt-Text
  - [ ] Icon-Buttons ohne Beschriftung
  - [ ] Image-Buttons ohne Alternativtext
  - [ ] Formularfelder ohne Labels
  - [ ] Schlechte Farbkontraste
- [ ] Kontextmenü zeigt erkannte Probleme kontextuell an
- [ ] Spezifische Erkennung für Button-Typen (button, input[type="button"], role="button")
- [ ] Verständliche Beschreibungen für Nicht-Experten ("Button-Beschriftung fehlt")
- [ ] Automatische Vor-Ausfüllung ohne manuelle BITV-Auswahl
- [ ] Automatische Screenshots der erkannten Probleme
- [ ] Performance: <500ms für Seiten-Scan
- [ ] Nahtlose Integration in bestehenden Workflow

---

#### 5. Vereinfachter Melde-Workflow über Kontextmenü *(Story Points: 13)*
**Status**: 📋 Ready for Development

**User Stories**:
- Als **Maria** möchte ich über das gewohnte Kontextmenü einfach "Problem melden" auswählen können
- Als **Thomas** möchte ich im Kontextmenü zwischen "Schnelle Meldung" und "Detaillierte Dokumentation" wählen
- Als **Petra** möchte ich Klienten das Kontextmenü als einzigen Einstiegspunkt zeigen

**Tasks**:
- [ ] Kontextmenü um "Problem melden (einfach)" erweitern
- [ ] Vereinfachter Notiz-Modus ohne BITV-Prüfschritt-Auswahl
- [ ] Automatische Auswahl des wahrscheinlichsten Problems
- [ ] Vorausgefüllte E-Mail-Templates für Behördenmeldungen
- [ ] PDF-Export im Meldungs-Format (kein technischer Report)
- [ ] Nachverfolgungsmodus für gemeldete Probleme
- [ ] Status-Tracking: Gemeldet → In Bearbeitung → Behoben
- [ ] Kontextmenü-Option "Detaillierte BITV-Notiz" für Profis

**Acceptance Criteria**:
- [ ] Kontextmenü bietet sowohl einfache als auch detaillierte Optionen
- [ ] Ein-Klick-Meldung ohne BITV-Kenntnisse nötig
- [ ] Automatische Problem-Erkennung schlägt passenden Modus vor
- [ ] Verständliche Meldungs-PDFs für Behörden
- [ ] E-Mail-Template mit korrekten rechtlichen Verweisen
- [ ] Nahtloser Workflow ohne zusätzliche UI-Elemente

---

#### 6. Bürgerfreundliche BITV-Referenzen *(Story Points: 8)*
**Status**: 📋 Ready for Development

**User Stories**:
- Als **Maria** möchte ich verstehen, warum etwas ein Problem ist
- Als **Thomas** möchte ich rechtlich fundierte Meldungen erstellen
- Als **Petra** möchte ich Barrieren einfach erklären können

**Tasks**:
- [ ] Vereinfachte BITV-Beschreibungen in Alltagssprache
- [ ] Fokus auf häufigste 15-20 Prüfschritte statt aller 54
- [ ] "Warum ist das ein Problem"-Erklärungen
- [ ] Rechtliche Grundlagen für Bürgermeldungen
- [ ] Beispiele für korrekte Umsetzungen
- [ ] Link zu Schlichtungsstelle und Beauftragte für Barrierefreiheit

**Acceptance Criteria**:
- [ ] Verständlich für Menschen ohne IT-Hintergrund
- [ ] Rechtlich korrekte Verweise auf BITV/BGG
- [ ] Priorisiert nach Häufigkeit der Probleme
- [ ] Kontaktdaten für zuständige Stellen integriert
- [ ] Mobile-optimiert für unterwegs

---

## 🔧 **Kontextmenü-Konzept für verschiedene Nutzergruppen**

### **Intelligentes Kontextmenü (abhängig von erkannten Problemen)**

```
Rechtsklick auf Bild ohne Alt-Text:
┌─────────────────────────────────────────────┐
│ 🚨 Problem erkannt: Alt-Text fehlt          │
│ ├─ 📝 Problem schnell melden               │
│ ├─ 📋 Detaillierte BITV-Notiz erstellen    │
│ └─ ❓ Was bedeutet das?                    │
├─────────────────────────────────────────────┤
│ 🔍 Element untersuchen                      │
│ 📄 Seitenübersicht                         │
└─────────────────────────────────────────────┘

Rechtsklick auf Icon-Button ohne Beschriftung:
┌─────────────────────────────────────────────┐
│ 🚨 Problem erkannt: Button-Beschriftung fehlt │
│ ├─ 📝 Problem schnell melden               │
│ ├─ 📋 Detaillierte BITV-Notiz erstellen    │
│ └─ ❓ Was bedeutet das?                    │
├─────────────────────────────────────────────┤
│ 🔍 Element untersuchen                      │
│ 📄 Seitenübersicht                         │
└─────────────────────────────────────────────┘

Rechtsklick auf Element ohne erkannte Probleme:
┌─────────────────────────────────────────────┐
│ 📝 Notiz zu diesem Element                  │
│ ├─ 🚀 Schnelle Meldung                     │
│ ├─ 📋 Detaillierte BITV-Dokumentation      │
│ └─ 🔍 Barrierefreiheit prüfen              │
├─────────────────────────────────────────────┤
│ 📄 Notizen-Übersicht                       │
└─────────────────────────────────────────────┘
```

### **Nutzergruppen-spezifische Workflows**

#### **Maria (Bürgerin)**: Bevorzugt "Problem schnell melden"
- Automatische Problemerkennung → vorgefülltes einfaches Formular
- Rechtliche Hinweise und Kontakte werden automatisch hinzugefügt

#### **Thomas (Aktivist)**: Nutzt beide Modi je nach Situation
- Schnellmeldung für offensichtliche Probleme
- Detaillierte Dokumentation für Beschwerdeverfahren

#### **Sarah (BITV-Prüferin)**: Bevorzugt "Detaillierte BITV-Dokumentation"
- Vollständiger BITV-Prüfschritt-Workflow
- Professionelle Reports und Dokumentation

---

### ⚡ MEDIUM PRIORITY (Professionelle Features - Nächste Iteration)

#### 7. BITV-Template-System *(Story Points: 8)*
**Status**: 📋 Ready for Development (Professional Feature)

**User Stories**:
- Als **Sarah** möchte ich vorgefertigte Templates für BITV-Prüfschritte haben
- Als **Team Lead** möchte ich Standard-BITV-Templates erstellen können
- Als **Organisation** möchten wir BITV-Templates zwischen Teams teilen

**Tasks**:
- [ ] BITV-spezifische Templates für jeden Prüfschritt erstellen
- [ ] Template-Editor mit BITV-Struktur implementieren
- [ ] BITV-Template-Import/Export Funktion
- [ ] Template-Bibliothek mit BITV-Kategorien
- [ ] Prüfschritt-spezifische Empfehlungs-Templates

**Acceptance Criteria**:
- [ ] Mindestens 1 Template pro BITV-Prüfschritt (54 Templates)
- [ ] Template-Editor mit BITV-Vorschau
- [ ] Import/Export als JSON mit BITV-Metadaten
- [ ] Template-Validation gegen BITV-Struktur

---

#### 8. BITV-Reporting & Export *(Story Points: 13)*
**Status**: 📋 Ready for Development (Professional Feature)

**User Stories**:
- Als **Sarah** möchte ich BITV-konforme PDF-Reports generieren
- Als **Management** möchten wir BITV-Compliance-Übersichten in Excel
- Als **Auditor** möchte ich strukturierte BITV-HTML-Reports

**Tasks**:
- [ ] BITV-PDF-Generator mit offizieller Struktur
- [ ] Excel-Export mit BITV-Prüfschritt-Spalten
- [ ] HTML-Report mit BITV-Navigation
- [ ] BITV-Compliance-Dashboard implementieren
- [ ] Multi-Format BITV-Export-Wizard

**Acceptance Criteria**:
- [ ] PDF folgt BITV-Reporting-Standards
- [ ] Excel mit Prüfschritt-ID, Status, Bewertung-Spalten
- [ ] HTML responsive mit BITV-Kategorien-Navigation
- [ ] Compliance-Prozentsatz pro Kategorie
- [ ] Export-Wizard führt durch BITV-Optionen

---

#### 9. BITV-Fortschritts-Tracking *(Story Points: 8)*
**Status**: 📋 Ready for Development (Professional Feature)

**User Stories**:
- Als **Sarah** möchte ich den BITV-Test-Fortschritt pro Website verfolgen
- Als **Team Lead** möchte ich BITV-Compliance-Status überwachen
- Als **Project Manager** möchte ich BITV-Deadlines verwalten

**Tasks**:
- [ ] BITV-Projekt-Management implementieren
- [ ] Prüfschritt-basiertes Fortschritts-Tracking
- [ ] BITV-Compliance-Score-Berechnung
- [ ] Website-übergreifende BITV-Statistiken
- [ ] BITV-Deadline und Milestone-Integration

**Acceptance Criteria**:
- [ ] Fortschritt als Prozentsatz pro BITV-Kategorie
- [ ] Übersicht über ausstehende Prüfschritte
- [ ] BITV-Compliance-Score (0-100%)
- [ ] Historisches Tracking über Zeit
- [ ] Export der Fortschritts-Daten

---

### 🚀 LOW PRIORITY (Future Features)

#### 10. BITV-Team-Kollaboration *(Story Points: 21)*
**Status**: 💭 Future Consideration (Professional Feature)

**Epic**: BITV-Team-Zusammenarbeit ermöglichen

**User Stories**:
- Als **BITV-Team Lead** möchte ich Prüfschritte zwischen Team-Mitgliedern aufteilen
- Als **BITV-Reviewer** möchte ich Prüfschritt-Bewertungen reviewen können
- Als **BITV-Team** möchten wir einen strukturierten Review-Workflow haben

**High-Level Tasks**:
- [ ] BITV-Prüfschritt-Assignment System
- [ ] Review-Workflow für BITV-Bewertungen
- [ ] BITV-Team-Dashboard implementieren
- [ ] Kommentar-System für Prüfschritte
- [ ] BITV-Notification-System

---

#### 11. BITV-Automatisierung *(Story Points: 21)*
**Status**: 💭 Future Consideration (Professional Feature)

**Epic**: Intelligente BITV-Unterstützung

**User Stories**:
- Als **Junior BITV-Tester** möchte ich automatische Prüfschritt-Vorschläge
- Als **BITV-Auditor** möchte ich Element-zu-Prüfschritt-Mapping
- Als **Organisation** möchten wir BITV-Compliance automatisch tracken

**High-Level Tasks**:
- [ ] Element-basierte Prüfschritt-Erkennung
- [ ] Automatische BITV-Regel-Zuordnung
- [ ] KI-basierte Prüfschritt-Empfehlungen
- [ ] BITV-Compliance-Predictor
- [ ] Automatisierte BITV-Trend-Analyse

---

#### 12. BITV-Enterprise-Features *(Story Points: 34)*
**Status**: 💭 Future Consideration (Professional Feature)

**Epic**: Enterprise-Level BITV-Management

**User Stories**:
- Als **BITV-Agentur** möchten wir Multi-Client BITV-Management
- Als **Compliance-Officer** möchte ich BITV-Audit-Zyklen verwalten
- Als **Organisation** möchten wir BITV-Zertifizierungs-Pipeline

**High-Level Tasks**:
- [ ] Multi-Client BITV-Architektur
- [ ] BITV-Zertifizierungs-Workflow
- [ ] Enterprise BITV-Reporting
- [ ] BITV-Audit-Lifecycle-Management
- [ ] Integration mit deutschen Zertifizierungsstellen

---

## 🎯 BITV-spezifische Definition of Done (DoD)

### Für alle BITV-Features gilt zusätzlich:

#### BITV-Compliance
- [ ] **BITV-Konformität**: Feature unterstützt deutsche BITV-Standards
- [ ] **Prüfschritt-Referenz**: Klare Zuordnung zu bit-inklusiv.de Katalog
- [ ] **Bewertungslogik**: Konsistent mit BITV-Bewertungskriterien
- [ ] **Reporting-Standard**: Ausgabe folgt BITV-Reporting-Konventionen

#### BITV-Integration
- [ ] **Katalog-Synchronisation**: Kompatibel mit aktuellen BITV-Prüfschritten
- [ ] **Kategorien-Mapping**: Korrekte Zuordnung zu BITV-Kategorien
- [ ] **Level-Unterstützung**: WCAG A/AA/AAA Level korrekt implementiert
- [ ] **Export-Kompatibilität**: BITV-konforme Export-Formate

#### BITV-Usability
- [ ] **Prüfer-Workflow**: Optimiert für professionelle BITV-Prüfer
- [ ] **Deutsche Lokalisierung**: UI und Inhalte in deutscher Sprache
- [ ] **Fachterminologie**: Korrekte Verwendung von BITV-Begriffen
- [ ] **Effizienz-Ziel**: Messbare Zeitersparnis bei BITV-Tests

---

## 📊 BITV-fokussierte Sprint Planning Guidelines

### BITV-Story Point Schätzung:
- **1-2 Points**: BITV-Template Anpassungen, kleine Prüfschritt-Fixes
- **3-5 Points**: Einzelne BITV-Features, Prüfschritt-UI-Components
- **8-13 Points**: BITV-Kategorie-Features, Report-Generation
- **21+ Points**: BITV-System-Architekturen, Multi-Client Features

### BITV-Prioritisierung Kriterien:
1. **BITV-Compliance Impact**: Verbessert die BITV-Konformität?
2. **Prüfer-Effizienz**: Reduziert Zeit für BITV-Softwaretests?
3. **Reporting-Qualität**: Verbessert BITV-Report-Standards?
4. **Deutsche Standards**: Unterstützt spezifisch deutsche Anforderungen?
5. **Skalierbarkeit**: Funktioniert für große BITV-Projekte?

### BITV-Sprint Capacity:
- **BITV-Spezialist**: 6-8 Story Points pro Woche (BITV-Domain-Wissen nötig)
- **Standard Developer**: 4-6 Story Points pro Woche (BITV-Einarbeitung)
- **BITV-Buffer**: 30% für BITV-Compliance-Tests und Standards-Updates

---

## 🎯 BITV-Meilensteine 2025

### Q1 2025: BITV-Foundation
- [ ] BITV-Template-System vollständig
- [ ] Erweiterte Notizen-Verwaltung mit BITV-Filter
- [ ] Grundlegendes BITV-Reporting

### Q2 2025: BITV-Professional
- [ ] Professional BITV-PDF/Excel-Reports
- [ ] BITV-Fortschritts-Tracking
- [ ] Screenshot-Integration für BITV-Dokumentation

### Q3 2025: BITV-Enterprise
- [ ] Team-Kollaboration für BITV-Teams
- [ ] Multi-Projekt BITV-Management
- [ ] Integration mit deutschen Tools

### Q4 2025: BITV-Intelligence
- [ ] KI-basierte BITV-Prüfschritt-Erkennung
- [ ] Automatisierte BITV-Compliance-Tracking
- [ ] Community-Features für BITV-Experten

---

*Letzte Aktualisierung: Dezember 2024*
*Fokus: Deutsche BITV-Softwaretest-Standards*