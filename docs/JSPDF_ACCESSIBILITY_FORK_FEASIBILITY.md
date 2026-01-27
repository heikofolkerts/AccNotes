# jsPDF Accessibility Fork - Machbarkeitsanalyse

**Datum:** 20. Oktober 2025
**Kontext:** Evaluation der Machbarkeit eines jsPDF-Forks mit PDF/UA-1 Unterstützung
**Analyst:** Claude Code
**Ziel:** Bewertung ob ein Fork realistisch ist, um Tagged PDF / PDF/UA-1 zu implementieren

---

## Executive Summary

**Bewertung: ⚠️ TECHNISCH MACHBAR, ABER NICHT EMPFOHLEN**

Ein Fork von jsPDF zur Implementierung von PDF/UA-1-Features ist **technisch machbar**, jedoch mit **erheblichem Aufwand** verbunden und **nicht im Verhältnis zum Nutzen** für AccNotes.

**Empfehlung:** Alternative Ansätze verfolgen (siehe Abschnitt "Empfohlene Alternativen")

---

## 1. Hintergrund

### Aktuelle Situation

Die vorhandene Evaluation (`PDF_LIBRARY_EVALUATION.md`) zeigt:
- ✅ jsPDF erfüllt **Priorität 1** (WCAG 2.1 AA Basis-Anforderungen)
- ⚠️ jsPDF erfüllt **NICHT Priorität 2** (Tagged PDF, PDF/UA-1, Alt-Texte)

### Fehlende Features

| Feature | Status in jsPDF | PDF/UA-1 Anforderung |
|---------|-----------------|----------------------|
| **Structure Tree** | ❌ Nicht vorhanden | ✅ Pflicht |
| **MarkInfo Dictionary** | ❌ Nicht vorhanden | ✅ Pflicht |
| **Tagged Content** | ❌ Nicht vorhanden | ✅ Pflicht |
| **Alt-Text API** | ❌ Nicht vorhanden | ✅ Pflicht |
| **RoleMap** | ❌ Nicht vorhanden | ✅ Pflicht |
| **ParentTree** | ❌ Nicht vorhanden | ✅ Pflicht |

---

## 2. Technische Analyse

### 2.1 PDF/UA-1 Anforderungen (Technisch)

#### Erforderliche PDF-Strukturen

```javascript
// 1. MarkInfo Dictionary (im Catalog)
{
  Type: /MarkInfo,
  Marked: true,          // Kennzeichnet Tagged PDF
  Suspects: false,       // Keine ungekennzeichneten Inhalte
  UserProperties: false  // Optional
}

// 2. StructTreeRoot (im Catalog)
{
  Type: /StructTreeRoot,
  K: [ref_to_structure_element],  // Verweis auf Root-Element
  ParentTree: ref_to_number_tree,  // Parent-Zuordnung
  RoleMap: ref_to_role_map,        // Rollen-Mapping
  ClassMap: ref_to_class_map       // Optional
}

// 3. Structure Elements (Hierarchisch)
{
  Type: /StructElem,
  S: /Document,           // oder /H1, /P, /Figure, etc.
  P: ref_to_parent,       // Parent-Element
  K: [ref_to_children],   // Kinder oder Content
  ID: "unique_id",        // Optional
  Alt: "(Alt-Text)",      // Für Bilder/Grafiken
  ActualText: "Text"      // Optional
}

// 4. Marked Content (auf Page-Ebene)
/P << /MCID 0 >> BDC    // Begin Marked Content
  ... content ...
EMC                      // End Marked Content
```

#### Daten-Hierarchie

```
PDF Document Root
└── Catalog
    ├── MarkInfo Dictionary
    └── StructTreeRoot
        ├── RoleMap
        ├── ParentTree (NumTree)
        └── K (Root Structure Element)
            └── Document
                ├── H1 (MCID 0)
                ├── P (MCID 1)
                ├── Figure (MCID 2, Alt-Text)
                └── P (MCID 3)
```

### 2.2 jsPDF Architektur-Analyse

#### Aktuelle Architektur

```
jsPDF Core (356KB minified)
├── Core Engine
│   ├── PDF Document Structure (Basic)
│   ├── Page Management
│   ├── Font Handling
│   └── Image Embedding
├── Plugins (Optional)
│   ├── AutoTable
│   ├── HTML Renderer
│   └── SVG Support
└── Output Formats
    ├── Data URL
    ├── Blob
    └── PDF String
```

**Fehlende Komponenten für PDF/UA:**
- Keine Structure Tree API
- Keine MarkInfo Implementation
- Keine Marked Content Operators
- Kein ParentTree/NumTree System
- Keine RoleMap-Verwaltung

#### Erforderliche Änderungen

```javascript
// NEU: Structure Tree Manager
class StructureTreeManager {
  constructor(doc) {
    this.doc = doc;
    this.root = null;
    this.currentElement = null;
    this.mcidCounter = 0;
    this.parentTree = new NumberTree();
    this.roleMap = {};
  }

  createRootElement() { /* ... */ }
  beginElement(type, attributes) { /* ... */ }
  endElement() { /* ... */ }
  markContent(mcid) { /* ... */ }
}

// NEU: Marked Content Integration
class MarkedContentWrapper {
  wrapText(text, mcid, tag) { /* ... */ }
  wrapImage(imgData, mcid, altText) { /* ... */ }
}

// ÄNDERUNG: Bestehende API erweitern
jsPDF.prototype.text = function(text, x, y, options) {
  // Alt: Direkt Text schreiben
  // Neu: Mit Marked Content wrappen
  if (this._accessibilityEnabled) {
    const mcid = this._structureTree.getNextMCID();
    this._beginMarkedContent(mcid, options.tag || 'P');
  }
  // ... Original-Code ...
  if (this._accessibilityEnabled) {
    this._endMarkedContent();
  }
}
```

### 2.3 Komplexitäts-Schätzung

#### Neue Code-Module (geschätzte LOC)

| Modul | Beschreibung | Geschätzte LOC |
|-------|--------------|----------------|
| **StructureTreeManager** | Verwaltung der Struktur-Hierarchie | 800-1200 |
| **MarkInfoHandler** | MarkInfo Dictionary Management | 150-250 |
| **MarkedContentWrapper** | Wrapper für Page Content | 400-600 |
| **NumberTree** | ParentTree Implementation | 300-500 |
| **RoleMapManager** | Standard/Custom Role Mapping | 200-350 |
| **AltTextManager** | Alt-Text für Bilder/Grafiken | 250-400 |
| **ValidationHelper** | PDF/UA Compliance Check | 500-800 |
| **API Extensions** | Erweiterte User-facing API | 600-900 |

**Geschätzte Gesamtgröße:** 3.200 - 5.000 Zeilen neuer Code

#### Core-Änderungen (geschätzte LOC)

| Bereich | Art der Änderung | Geschätzte LOC |
|---------|------------------|----------------|
| **jsPDF.text()** | Marked Content Integration | 50-100 |
| **jsPDF.addImage()** | Alt-Text & Marked Content | 80-150 |
| **jsPDF.addPage()** | Structure Tree Page-Handling | 40-80 |
| **jsPDF Output** | StructTreeRoot in Catalog | 150-250 |
| **Font Handling** | Unicode/ActualText Support | 100-200 |

**Geschätzte Core-Änderungen:** 420 - 780 Zeilen

#### Tests & Dokumentation

| Bereich | Geschätzter Aufwand |
|---------|---------------------|
| **Unit Tests** | 2.000 - 3.000 LOC |
| **Integration Tests** | 1.000 - 1.500 LOC |
| **Dokumentation** | 50-80 Seiten |
| **Beispiele** | 20-30 Code-Beispiele |

---

## 3. Aufwandsschätzung

### 3.1 Entwicklungsaufwand

| Phase | Aufwand (Personentage) | Beschreibung |
|-------|------------------------|--------------|
| **Recherche & Design** | 10-15 PT | PDF-Spezifikation studieren, Architektur entwerfen |
| **Core Implementation** | 30-50 PT | Structure Tree, Marked Content, MarkInfo |
| **API Extensions** | 15-25 PT | User-facing API für Accessibility Features |
| **Integration** | 10-20 PT | Bestehende jsPDF-API anpassen |
| **Testing** | 20-30 PT | Unit Tests, Integration Tests, PDF/UA Validation |
| **Dokumentation** | 10-15 PT | API-Docs, Tutorials, Migration Guide |
| **Bug-Fixing** | 15-25 PT | Initial Bug Reports und Stabilisierung |

**Gesamtaufwand: 110-180 Personentage (5-9 Monate Vollzeit)**

### 3.2 Laufende Wartung

| Aktivität | Aufwand pro Jahr |
|-----------|------------------|
| **Bug-Fixing** | 20-40 PT |
| **Feature Updates** | 15-30 PT |
| **jsPDF Upstream Merges** | 10-20 PT |
| **Community Support** | 10-15 PT |

**Jährlicher Wartungsaufwand: 55-105 Personentage**

### 3.3 Risiken & Herausforderungen

#### Technische Risiken

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| **PDF-Spec Komplexität** | Hoch | Hoch | Externe PDF-Experten einbinden |
| **jsPDF Upstream Changes** | Mittel | Hoch | Regelmäßige Merges (alle 3-6 Monate) |
| **Browser-Kompatibilität** | Mittel | Mittel | Extensive Testing-Matrix |
| **Performance-Degradation** | Mittel | Mittel | Profiling & Optimization |
| **PDF/UA Validation Bugs** | Hoch | Hoch | Adobe Acrobat Pro & PAC Testing |

#### Maintenance Burden

- **Fork-Divergenz:** Mit jedem jsPDF-Update steigt die Merge-Komplexität
- **Community Split:** User müssen zwischen Standard und Fork wählen
- **Breaking Changes:** Upstream-Änderungen können Fork-Features brechen

---

## 4. Alternative Ansätze

### 4.1 Server-seitige PDF/UA-Generierung

**Ansatz:** Browser generiert Daten → Server generiert PDF/UA

```
AccNotes (Browser)
   ↓ JSON/API
Server (Node.js + PDFKit-Fork oder iText)
   ↓
PDF/UA-1 konformes PDF
   ↓
Download zum User
```

**Vorteile:**
- ✅ Nutzt existierende, getestete Libraries (z.B. PDFKit mit Tagged PDF Support)
- ✅ Kein Fork-Maintenance
- ✅ Volle PDF/UA-1 Konformität
- ✅ Zentrale Qualitätskontrolle

**Nachteile:**
- ❌ Server-Infrastruktur benötigt
- ❌ Keine Offline-Funktionalität
- ❌ Datenschutz: Notizen verlassen Browser

**Aufwand:** 15-25 PT (Server-Setup + API + PDFKit Integration)

---

### 4.2 Hybrid-Ansatz (Empfohlen für AccNotes)

**Ansatz:** Zwei Export-Optionen anbieten

```
AccNotes Export-Dialog:
┌────────────────────────────────────┐
│ PDF-Export                         │
├────────────────────────────────────┤
│ ○ Standard-PDF (jsPDF)             │
│   • Sofortiger Download            │
│   • Offline verfügbar              │
│   • WCAG 2.1 AA konform            │
│                                    │
│ ○ Barrierefreies PDF (PDF/UA-1)   │
│   • Server-Generierung             │
│   • Volle Accessibility-Features   │
│   • PDF/UA-1 Zertifiziert         │
│   ⚠️ Internet erforderlich         │
└────────────────────────────────────┘
```

**Vorteile:**
- ✅ Beste User Experience: User wählt passende Option
- ✅ Kein Fork nötig
- ✅ Offline-Fähigkeit bleibt erhalten (Standard-PDF)
- ✅ Volle PDF/UA für kritische Anwendungsfälle (Server-PDF)
- ✅ Moderater Entwicklungsaufwand

**Aufwand:** 20-30 PT (Server + UI + beide Optionen)

---

### 4.3 Post-Processing mit Adobe PDF Services API

**Ansatz:** jsPDF generiert Basis-PDF → Adobe API fügt Tags hinzu

```
jsPDF (Browser)
   ↓ Standard-PDF
Adobe PDF Accessibility Auto-Tag API
   ↓
PDF/UA-1 konformes PDF
```

**Vorteile:**
- ✅ Professionelle AI-basierte Tagging
- ✅ Kein eigener Server nötig
- ✅ Offiziell von Adobe

**Nachteile:**
- ❌ Kostenpflichtig (Adobe Cloud)
- ❌ Vendor Lock-in
- ❌ Internet erforderlich

**Aufwand:** 8-12 PT (API-Integration)

---

### 4.4 Community-Contribution zu jsPDF

**Ansatz:** PDF/UA-Support als Plugin zu jsPDF upstream contributen

**Vorteile:**
- ✅ Community-getrieben
- ✅ Langfristige Wartung durch jsPDF-Team
- ✅ Benefit für alle jsPDF-User

**Nachteile:**
- ❌ Sehr langer Zeitrahmen (1-2 Jahre bis Merge)
- ❌ Unsicher ob akzeptiert wird
- ❌ Keine Kontrolle über Timeline

**Aufwand:** Gleich wie Fork (110-180 PT) + Community-Koordination

---

## 5. Bewertungs-Matrix

| Kriterium | Fork | Server | Hybrid | Adobe API | Plugin |
|-----------|------|--------|--------|-----------|--------|
| **Entwicklungsaufwand** | ❌ Sehr hoch | ✅ Niedrig | ⚠️ Mittel | ✅ Niedrig | ❌ Sehr hoch |
| **Wartungsaufwand** | ❌ Hoch | ✅ Niedrig | ⚠️ Mittel | ✅ Niedrig | ✅ Niedrig (upstream) |
| **Offline-Fähigkeit** | ✅ Ja | ❌ Nein | ✅ Optional | ❌ Nein | ✅ Ja |
| **PDF/UA-1 Qualität** | ⚠️ Ungetestet | ✅ Hoch | ✅ Hoch | ✅ Sehr hoch | ⚠️ Ungetestet |
| **Datenschutz** | ✅ Lokal | ⚠️ Server | ✅ Wahlweise | ❌ Adobe | ✅ Lokal |
| **Kosten** | ⚠️ Dev-Zeit | ⚠️ Hosting | ⚠️ Hosting | ❌ Lizenz | ⚠️ Dev-Zeit |
| **Time-to-Market** | ❌ 6-9 Monate | ✅ 3-4 Wochen | ⚠️ 4-5 Wochen | ✅ 2-3 Wochen | ❌ 6-12 Monate |
| **Risiko** | ❌ Hoch | ✅ Niedrig | ✅ Niedrig | ⚠️ Mittel | ❌ Hoch |

**Scoring (1-5 Sterne):**
- **Fork:** ⭐⭐☆☆☆ (2/5)
- **Server:** ⭐⭐⭐⭐☆ (4/5)
- **Hybrid:** ⭐⭐⭐⭐⭐ (5/5) ← **EMPFOHLEN**
- **Adobe API:** ⭐⭐⭐☆☆ (3/5)
- **Plugin:** ⭐⭐⭐☆☆ (3/5)

---

## 6. Empfehlung

### Kurzfristig (nächste 3 Monate)

**✅ EMPFOHLEN: Hybrid-Ansatz implementieren**

**Warum:**
1. **Pragmatisch:** Erfüllt beide Anforderungen (Offline + PDF/UA)
2. **Risikoarm:** Nutzt etablierte Technologien
3. **User-zentriert:** User wählt passende Option
4. **Moderate Kosten:** 20-30 PT vs. 110-180 PT für Fork

**Roadmap:**
1. **Phase 1 (Aktuell):** jsPDF mit WCAG 2.1 AA (bereits implementiert) ✅
2. **Phase 2 (2-3 Wochen):** Server-Setup mit PDFKit Tagged-PDF-Fork
3. **Phase 3 (1 Woche):** UI für Export-Optionen
4. **Phase 4 (1 Woche):** Testing & Dokumentation

### Mittelfristig (6-12 Monate)

**Prüfen:** Contribution zu jsPDF upstream

Falls viele User den Server-Export nutzen, könnte man die Features als Plugin zu jsPDF beitragen.

### Langfristig (1-2 Jahre)

**Optional:** Fork nur wenn:
- Server-Kosten zu hoch werden
- Datenschutzbedenken überwiegen
- Community-Plugin nicht akzeptiert wird

---

## 7. Antwort auf die ursprüngliche Frage

### "Ist es realistisch, einen Fork zu erstellen?"

**Ja, aber...**

#### Technisch: ✅ MACHBAR
- PDF/UA-1 ist eine dokumentierte Spezifikation
- PDFKit hat es bereits gezeigt (Proof of Concept)
- JavaScript bietet alle notwendigen Werkzeuge

#### Wirtschaftlich: ❌ NICHT EMPFOHLEN
- **110-180 Personentage** Entwicklung
- **55-105 Personentage/Jahr** Wartung
- **Hohe technische Risiken** (PDF-Spec-Komplexität)
- **Maintenance Burden** (Fork-Divergenz)

#### Strategisch: ⚠️ ALTERNATIVEN BESSER
- Hybrid-Ansatz: **5x schneller** (20-30 PT vs. 110-180 PT)
- Server-Ansatz: **Niedrigeres Risiko**, etablierte Tools
- Adobe API: **Professionelle Qualität** ohne eigene Implementation

---

## 8. Fazit

### Fork ist technisch machbar, aber strategisch nicht sinnvoll

**Für AccNotes wird empfohlen:**

```
✅ Kurzfristig:  Hybrid-Ansatz (jsPDF Standard + Server PDF/UA)
⚠️ Mittelfristig: jsPDF Plugin Contribution evaluieren
❌ Fork:         Nur als absolute Notlösung
```

**Begründung:**
Ein Fork würde **9 Monate Entwicklung** + **laufende Wartung** erfordern, während der **Hybrid-Ansatz in 4-5 Wochen** produktionsreif ist und **bessere PDF/UA-Qualität** liefert.

---

## Anhang A: Technische Referenzen

### PDF-Spezifikationen
- **PDF 2.0 (ISO 32000-2:2020):** https://www.iso.org/standard/75839.html
- **PDF/UA-1 (ISO 14289-1:2014):** https://www.iso.org/standard/64599.html
- **WCAG 2.1 (W3C):** https://www.w3.org/TR/WCAG21/

### Existierende Implementierungen
- **PDFKit Tagged PDF:** https://github.com/foliojs/pdfkit (Issue #1147)
- **Apache PDFBox:** https://pdfbox.apache.org/ (Java)
- **iText 7:** https://itextpdf.com/ (Java/C#)

### Tools & Validation
- **PAC (PDF Accessibility Checker):** https://pdfua.foundation/en/pdf-accessibility-checker-pac
- **Adobe Acrobat Pro:** Accessibility-Checker integriert
- **veraPDF:** https://verapdf.org/ (PDF/UA Validator)

---

**Erstellt:** 20. Oktober 2025
**Autor:** Claude Code
**Review:** Ausstehend
**Status:** 📋 Zur Diskussion
