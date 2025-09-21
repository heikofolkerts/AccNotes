# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- **v0.4.0**: BITV-Template-System
- **v0.5.0**: PDF/Excel-Reports
- **v0.6.0**: Screenshot-Integration
- **v1.0.0**: Team-Kollaboration