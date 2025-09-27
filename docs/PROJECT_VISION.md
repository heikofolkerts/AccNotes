# AccNotes - Projektvision 3.0 🎯

## Mission Statement

**AccNotes unterstützt primär Privatpersonen dabei, BITV-Verstöße schnell zu erfassen und zu melden, bietet aber auch erweiterte Funktionen für professionelle BITV-Audits. Die Extension automatisiert die Erkennung typischer Barrieren und skaliert von einfachen Bürgermeldungen bis hin zu strukturierten Compliance-Prüfungen.**

## 📋 Aktuelle Kernfunktionen (Version 2.0)

- ✅ **Kontextmenü-Integration** für schnelle Notizenerstellung
- ✅ **Detaillierte ARIA-Attribut-Extraktion** aller relevanten Accessibility-Eigenschaften
- ✅ **Automatische Element-Analyse** (Zugänglichkeit, Fokus, Interaktivität)
- ✅ **BITV-Prüfschritt-Integration** mit vollständigem Katalog von bit-inklusiv.de
- ✅ **Strukturierte Bewertung** (Bestanden/Nicht bestanden/Teilweise/Zu überprüfen)
- ✅ **WCAG-konforme UI** mit Dark Mode und Accessibility-Features
- ✅ **Lokale Speicherung** und erweiterte Dateiexporte
- ✅ **Notizen-Übersicht** mit persistenter Speicherung

## 👥 Zielgruppen & User Personas

### 🥇 **PRIMÄRE ZIELGRUPPE: Privatpersonen & Bürgermeldungen**

#### Hauptpersona: "Maria - Bürgerin mit Behinderung"
- 🎯 **Rolle**: Möchte Barrieren auf behördlichen Websites melden
- 💼 **Kontext**: Nutzt regelmäßig Online-Services (Terminbuchung, Anträge, Formulare)
- 🔄 **Bedürfnisse**:
  - Schnelle Dokumentation von Problemen beim Formular ausfüllen
  - Einfache, verständliche Meldungen ohne Fachwissen
  - Nachverfolgung von gemeldeten Problemen und deren Behebung
- 📊 **Ziele**: Barrierefreie Nutzung öffentlicher Online-Services
- ⚡ **Typische Probleme**: Fehlende Alt-Texte, unlabeled Formularfelder, schlechte Kontraste

#### "Thomas - Selbstadvokat & Aktivist"
- 🔧 **Rolle**: Sensibilisiert für Barrierefreiheit und dokumentiert systematisch Verstöße
- ⚡ **Bedürfnisse**:
  - Strukturierte Sammlung von BITV-Verstößen für Beschwerden
  - Export von Dokumentationen für Behörden und Organisationen
  - Verständliche BITV-Referenzen für fundierte Meldungen
- 🎯 **Fokus**: Rechtlich verwertbare Dokumentation, Meldeverfahren

#### "Petra - Ehrenamtliche Beraterin"
- 🧪 **Rolle**: Unterstützt Menschen bei der Nutzung digitaler Services
- 📝 **Bedürfnisse**: Einfache Tools zur Dokumentation häufiger Barrieren
- 🎯 **Fokus**: Schnelle Problemerfassung ohne technische Komplexität

### 🥈 **SEKUNDÄRE ZIELGRUPPE: Professionelle BITV-Tester**

#### "Sarah - BITV-Prüferin & UX Accessibility Specialist"
- 🎯 **Rolle**: Führt professionelle BITV-Softwaretests und WCAG-Audits durch
- 💼 **Kontext**: Arbeitet in Beratungsagenturen mit mehreren Compliance-Projekten
- 🔄 **Bedürfnisse**:
  - Systematische Prüfung anhand definierter BITV-Prüfschritte
  - Strukturierte, wiederverwendbare BITV-konforme Reports
  - Nachvollziehbare Zuordnung zu Prüfschritten
- 📊 **Ziele**: Effiziente und normkonforme Dokumentation

#### "Max - Frontend-Entwickler"
- 🔧 **Rolle**: Implementiert Accessibility-Fixes basierend auf BITV-Anforderungen
- ⚡ **Bedürfnisse**: Technische Details (Selektoren, ARIA), BITV-Compliance
- 🔄 **Arbeitsweise**: Iterativ mit Accessibility-Experten zusammenarbeitend

## Kernfunktionen für Bürgermeldungen

### 1. Automatische Barriere-Erkennung 🤖
- **Häufige Verstöße automatisch erkennen**:
  - Bilder ohne Alt-Texte
  - Formularfelder ohne Labels
  - Schlechte Farbkontraste
  - Fehlende Überschriften-Struktur
- **Ein-Klick-Problemerfassung**: Automatische Dokumentation mit wenig Benutzerinteraktion
- **Laienverständliche Beschreibungen**: Keine technischen BITV-IDs, sondern verständliche Problembeschreibungen

### 2. Vereinfachte BITV-Referenzen 📋
- **Relevante Prüfschritte**: Fokus auf häufigste Probleme statt vollständigem Katalog
- **Bürgerfreundliche Sprache**: "Fehlendes Label" statt "BITV 3.3.2"
  - Robustheit (3 Prüfschritte)
  - Interoperabilität mit assistiven Technologien (17 Prüfschritte)
- **Prüfschritt-Auswahl**: Dropdown/Auswahlmenü für aktiven Prüfschritt
- **Kontextuelle Hilfe**: Anzeige der Prüfschritt-Beschreibung und -Kriterien

### 2. Erweiterte Notizen-Funktionalität 📝
- **Prüfschritt-Zuordnung**: Jede Notiz wird einem spezifischen BITV-Prüfschritt zugeordnet
- **Bewertung pro Prüfschritt**:
  - ✅ Bestanden
  - ❌ Nicht bestanden
  - ⚠️ Teilweise bestanden
  - 📝 Zu überprüfen
- **Element-Kontext**: Beibehaltung der technischen Element-Analyse
- **Empfehlungen**: Feld für konkrete Verbesserungsvorschläge

### 3. Strukturierte Berichtserstellung 📊
- **BITV-konforme Reports**: Automatische Generierung strukturierter Prüfberichte
- **Prüfschritt-Übersicht**: Zusammenfassung aller Bewertungen pro Kategorie
- **Befund-Details**: Detaillierte Auflistung aller Findings pro Prüfschritt
- **Export-Optionen**: PDF, Excel, strukturiertes JSON

### 4. Workflow-Optimierung ⚡
- **Prüfschritt-Navigation**: Sequenzielle Abarbeitung der Prüfschritte
- **Fortschritts-Tracking**: Übersicht über abgeschlossene/offene Prüfschritte
- **Bulk-Operationen**: Batch-Bearbeitung ähnlicher Befunde
- **Template-System**: Vordefinierte Notiz-Templates pro Prüfschritt-Typ

## Technische Evolution

### Datenmodell-Erweiterung
```javascript
// Erweiterte Notiz-Struktur
const note = {
  id: "uuid",
  timestamp: "2024-01-01T12:00:00Z",
  url: "https://example.com",
  element: {
    selector: ".button",
    tagName: "button",
    ariaRole: "button",
    // ... bestehende Element-Eigenschaften
  },
  bitvTest: {
    category: "bedienbarkeit",
    stepId: "2.1.1",
    stepTitle: "Tastatur",
    stepDescription: "Alle Funktionalitäten sind per Tastatur bedienbar",
    evaluation: "failed", // passed, failed, partial, needs_review
    priority: "high", // high, medium, low
  },
  content: {
    title: "Tastatur-Navigation nicht möglich",
    description: "Button ist nicht über Tab-Taste erreichbar",
    recommendation: "tabindex='0' hinzufügen oder nativen Button verwenden",
    severity: "critical" // critical, major, minor, cosmetic
  }
}
```

### UI/UX-Verbesserungen
- **Prüfschritt-Sidebar**: Permanente Navigation durch BITV-Katalog
- **Kontextuelle Prüfkriterien**: Anzeige relevanter Kriterien basierend auf Element-Typ
- **Progress Dashboard**: Visualisierung des Prüffortschritts
- **Quick Actions**: Schnellzugriff auf häufige Bewertungen

## 🗺️ Feature Roadmap & Meilensteine

### Phase 1: BITV-Integration Grundlagen ✅ (Q4 2024)
- [x] **BITV-Prüfschritt-Datenbank** implementieren
- [x] **Prüfschritt-Auswahl UI** entwickeln
- [x] **Notiz-Datenmodell** erweitern
- [x] **Grundlegende Zuordnungsfunktionalität**
- [x] **Bewertungssystem** implementieren (Bestanden/Nicht bestanden/Teilweise/Zu überprüfen)

### Phase 2: Erweiterte BITV-Features (Q1 2025)
- [ ] **Template-System** für verschiedene BITV-Audit-Typen
- [ ] **Fortschritts-Tracking** pro Website/Projekt
- [ ] **Bulk-Operationen** für Notizen-Management
- [ ] **Erweiterte Suche & Filter** in Notizen-Übersicht
- [ ] **BITV-konforme Report-Templates**

### Phase 3: Professionelle Berichtserstellung (Q2 2025)
- [ ] **PDF/Excel-Export** mit BITV-Struktur
- [ ] **Zusammenfassungs-Dashboard** mit Compliance-Übersicht
- [ ] **Empfehlungs-Generator** basierend auf Prüfschritten
- [ ] **Screenshot-Integration** mit Element-Highlighting
- [ ] **Multi-Format Export-Wizard**

### Phase 4: Collaboration & Enterprise (Q3 2025)
- [ ] **Team-Features** & Notizen-Sharing
- [ ] **Sequenzielle Prüfschritt-Navigation**
- [ ] **Review-Workflow** (Draft → Review → Approved)
- [ ] **Integration mit externen Tools** (Jira, etc.)
- [ ] **Multi-Projekt-Management**

### Phase 5: Intelligence & Automation (Q4 2025)
- [ ] **Automatische WCAG-Regelvalidierung**
- [ ] **KI-basierte Verbesserungsvorschläge**
- [ ] **Analytics & Trend-Analyse**
- [ ] **Compliance-Tracking** über Zeit
- [ ] **Cloud-Synchronisation**

## 📊 Success Metrics

### Quantitative Metriken
- 📈 **Nutzung**: >1000 aktive Nutzer in 6 Monaten
- ⏱️ **BITV-Prüfeffizienz**: 50% Reduktion der Zeit pro BITV-Softwaretest
- 🎯 **Vollständigkeit**: 95% Abdeckung aller relevanten Prüfschritte
- 👥 **Community**: >100 GitHub Stars, aktive Contributions
- 📊 **Berichtqualität**: 90% der Reports entsprechen BITV-Standards

### Qualitative Metriken
- 😊 **User Satisfaction**: >4.5/5 Sterne in Extension Stores
- 🎓 **Learning**: Verbesserte BITV-Kenntnisse der Nutzer
- 🔄 **Adoption**: Integration in Standard-BITV-Workflows von Teams
- 🏆 **Recognition**: Anerkennung in der deutschen Accessibility-Community
- **Nutzeradoption**: 80% der BITV-Prüfer nutzen AccNotes regelmäßig

## Differenzierung

### Alleinstellungsmerkmale
1. **Vollständige BITV-Integration**: Einzige Extension mit komplettem BITV-Katalog
2. **Element-zu-Prüfschritt-Mapping**: Automatische Zuordnung von Elementen zu relevanten Prüfschritten
3. **Strukturierte Bewertung**: Systematische Bewertungsmethodik statt Freitext-Notizen
4. **Workflow-Integration**: Nahtlose Integration in bestehende Prüfprozesse

### Konkurrenzabgrenzung
- **vs. axe DevTools**: Fokus auf BITV statt allgemeine WCAG-Prüfung
- **vs. Wave**: Strukturierte Dokumentation statt reine Fehlererkennung
- **vs. Lighthouse**: Spezialisierung auf deutsche BITV-Anforderungen
- **vs. manuelle Prüfung**: Effizienzsteigerung durch Automatisierung der Dokumentation

## 🎯 Kernwerte

1. **Accessibility First**: Das Tool selbst muss WCAG 2.1 AA konform sein
2. **BITV-Compliance**: Vollständige Unterstützung deutscher Accessibility-Standards
3. **Effizienz**: Reduzierung der Zeit für BITV-Softwaretests um 50%
4. **Qualität**: >90% BITV-konforme Reports
5. **Benutzerfreundlichkeit**: Intuitive Bedienung für alle Zielgruppen
6. **Kollaboration**: Nahtlose Zusammenarbeit zwischen Teams

## 🌟 Langfristige Vision (2025+)

AccNotes entwickelt sich zu einer umfassenden BITV-Compliance-Plattform:

### KI-Integration
- **Intelligente Prüfschritt-Vorschläge**: ML-basierte Zuordnung von Elementen zu BITV-Prüfschritten
- **Automatische Bewertung**: KI-unterstützte Vorbewertung einfacher Prüfkriterien
- **Empfehlungs-Engine**: Personalisierte Verbesserungsvorschläge basierend auf BITV-Kriterien

### Ecosystem-Integration
- **BITV-Zertifizierungs-Pipeline**: Integration in offizielle deutsche Zertifizierungsprozesse
- **Tool-Vernetzung**: APIs für Integration in bestehende Testing-Workflows
- **Compliance-Tracking**: Langzeit-Monitoring der BITV-Compliance-Entwicklung
- **Community-Platform**: Austausch von Best Practices und BITV-Templates

---

*Diese Vision positioniert AccNotes als führendes Werkzeug für professionelle BITV-Softwaretests und schafft einen klaren Mehrwert für Accessibility-Experten in Deutschland.*

*Letzte Aktualisierung: Dezember 2024*