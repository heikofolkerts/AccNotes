# jsPDF-Accessibility Plugin - Technisches Konzept

**Version:** 1.0.0
**Datum:** 20. Oktober 2025
**Ziel:** PDF/UA-1 Unterstützung als Plugin für jsPDF
**Strategie:** Community Contribution (Pull Request an jsPDF upstream)

---

## 1. Vision & Ziele

### Vision
**"Jede JavaScript-Anwendung soll barrierefreie PDFs erstellen können."**

jsPDF ist die meistgenutzte clientseitige PDF-Bibliothek (15.7k GitHub Stars). Durch PDF/UA-1-Unterstützung können **Tausende von Anwendungen** weltweit barrierefreie Dokumente generieren.

### Primäre Ziele

1. **PDF/UA-1 Konformität:** Volle Unterstützung der ISO 14289-1:2014
2. **Opt-in Plugin:** Keine Breaking Changes für bestehende jsPDF-User
3. **Einfache API:** Intuitive Nutzung für Entwickler
4. **Upstream-Kompatibilität:** Bereit für Pull Request zu jsPDF
5. **Production-Ready:** Umfassend getestet und dokumentiert

### Sekundäre Ziele

- WCAG 2.1 AAA Konformität (über AA hinaus)
- Automatische Validierung (built-in PDF/UA Checker)
- Deutsche & englische Dokumentation
- Beispiele für gängige Use Cases

---

## 2. Plugin-Architektur

### 2.1 Design-Prinzipien

#### Prinzip 1: Opt-in, nicht Opt-out
```javascript
// Standard jsPDF - unverändert
const doc = new jsPDF();
doc.text('Hello', 10, 10);
// → Kein Tagged PDF, wie bisher

// Mit Accessibility Plugin
import 'jspdf-accessibility';
const doc = new jsPDF({ accessibility: true });
doc.text('Hello', 10, 10);
// → Automatisch Tagged PDF mit Structure Tree
```

#### Prinzip 2: Minimale API-Änderungen
Bestehende jsPDF-API bleibt kompatibel, neue Features sind **optional**:

```javascript
// Bestehende API funktioniert
doc.text('Normal text', 10, 10);

// Erweiterte API optional
doc.text('Heading', 10, 10, { structTag: 'H1' });
doc.addImage(img, 'PNG', 10, 20, 50, 50, undefined, 'FAST', { alt: 'Description' });
```

#### Prinzip 3: Automatische Intelligenz
Plugin erkennt Kontext automatisch:

```javascript
doc.setFontSize(24);
doc.text('Title', 10, 10);
// → Automatisch als H1 getaggt (basierend auf Schriftgröße)

doc.setFontSize(11);
doc.text('Body text', 10, 20);
// → Automatisch als P getaggt
```

### 2.2 Plugin-Struktur

```
jspdf-accessibility/
├── src/
│   ├── core/
│   │   ├── StructureTreeManager.js     # Hauptklasse: Structure Tree Verwaltung
│   │   ├── MarkInfoHandler.js          # MarkInfo Dictionary Management
│   │   ├── NumberTree.js               # ParentTree Implementation
│   │   └── RoleMapManager.js           # Role Mapping (Standard + Custom)
│   ├── wrappers/
│   │   ├── TextWrapper.js              # Wraps text() mit Marked Content
│   │   ├── ImageWrapper.js             # Wraps addImage() mit Alt-Text
│   │   └── PageWrapper.js              # Wraps addPage() für Structure
│   ├── validators/
│   │   ├── PDFUA1Validator.js          # PDF/UA-1 Compliance Check
│   │   └── WCAGValidator.js            # WCAG 2.1 Checks
│   ├── utils/
│   │   ├── TagGuesser.js               # Automatische Tag-Erkennung
│   │   └── PDFObjectBuilder.js         # Low-level PDF Object Construction
│   └── index.js                        # Plugin Entry Point
├── types/
│   └── index.d.ts                      # TypeScript Definitions
├── test/
│   ├── unit/                           # Unit Tests
│   ├── integration/                    # Integration Tests
│   └── fixtures/                       # Test PDFs
├── examples/
│   ├── basic-usage.js
│   ├── headings-structure.js
│   ├── images-with-alt.js
│   └── tables-accessible.js
└── docs/
    ├── API.md
    ├── MIGRATION.md
    └── BEST_PRACTICES.md
```

### 2.3 Kern-Komponenten

#### StructureTreeManager

**Verantwortung:** Verwaltung der gesamten PDF-Strukturhierarchie

```javascript
class StructureTreeManager {
  constructor(doc) {
    this.doc = doc;
    this.root = null;              // Root Structure Element
    this.currentElement = null;    // Aktueller Parent
    this.elementStack = [];        // Stack für verschachtelte Elemente
    this.mcidCounter = 0;          // Marked Content ID Counter
    this.parentTree = new NumberTree();
    this.roleMap = new RoleMapManager();
  }

  /**
   * Initialisiert den Structure Tree Root
   */
  initialize() {
    this.root = this.createStructElement('Document', null);
    this.currentElement = this.root;
  }

  /**
   * Erstellt ein neues Structure Element
   * @param {string} type - Element-Typ (H1, P, Figure, etc.)
   * @param {object} attributes - Optionale Attribute (Alt, ActualText, etc.)
   * @returns {object} Structure Element Object
   */
  createStructElement(type, attributes = {}) {
    const element = {
      type: type,
      parent: this.currentElement,
      children: [],
      attributes: attributes,
      mcids: []
    };

    if (this.currentElement) {
      this.currentElement.children.push(element);
    }

    return element;
  }

  /**
   * Beginnt ein neues verschachteltes Element (z.B. <div>)
   */
  beginElement(type, attributes = {}) {
    const element = this.createStructElement(type, attributes);
    this.elementStack.push(this.currentElement);
    this.currentElement = element;
    return element;
  }

  /**
   * Beendet das aktuelle verschachtelte Element
   */
  endElement() {
    if (this.elementStack.length > 0) {
      this.currentElement = this.elementStack.pop();
    }
  }

  /**
   * Markiert Content mit MCID und verknüpft mit Structure Element
   */
  markContent(mcid, structElement) {
    structElement.mcids.push(mcid);
    this.parentTree.add(mcid, structElement);
    return mcid;
  }

  /**
   * Generiert nächste MCID
   */
  getNextMCID() {
    return this.mcidCounter++;
  }

  /**
   * Serialisiert Structure Tree zu PDF Objects
   */
  serialize() {
    // Wird in PDF-Format konvertiert
    return this._buildPDFObjects(this.root);
  }

  _buildPDFObjects(element) {
    // Rekursiv durch Baum gehen und PDF Dictionary Objects erstellen
    // Format: << /Type /StructElem /S /H1 /P ref /K [mcids] >>
  }
}
```

#### TextWrapper

**Verantwortung:** Erweitert `doc.text()` um Marked Content

```javascript
class TextWrapper {
  constructor(structureTree, originalTextFn) {
    this.structureTree = structureTree;
    this.originalTextFn = originalTextFn;
  }

  /**
   * Erweiterte text() Funktion
   */
  text(text, x, y, options = {}) {
    const structTag = options.structTag || this._guessTag(text, options);
    const mcid = this.structureTree.getNextMCID();

    // Falls neues Element nötig (z.B. H1, P)
    let structElement;
    if (this._isBlockElement(structTag)) {
      structElement = this.structureTree.createStructElement(structTag, {
        actualText: text
      });
    } else {
      structElement = this.structureTree.currentElement;
    }

    // Marked Content Stream schreiben
    this._beginMarkedContent(mcid, structTag);

    // Original text() aufrufen
    const result = this.originalTextFn.call(this.doc, text, x, y, options);

    this._endMarkedContent();

    // MCID mit Structure Element verknüpfen
    this.structureTree.markContent(mcid, structElement);

    return result;
  }

  _guessTag(text, options) {
    // Intelligente Tag-Erkennung basierend auf:
    // - Schriftgröße (fontSize > 18 → H1, > 14 → H2, etc.)
    // - Schriftstil (bold → H oder Strong)
    // - Position (erste Zeile → vermutlich H1)
    const fontSize = options.fontSize || this.doc.getFontSize();
    const fontStyle = options.fontStyle || this.doc.getFont().fontStyle;

    if (fontSize >= 24 && fontStyle === 'bold') return 'H1';
    if (fontSize >= 18 && fontStyle === 'bold') return 'H2';
    if (fontSize >= 14 && fontStyle === 'bold') return 'H3';
    if (fontStyle === 'bold') return 'Strong';

    return 'P'; // Default
  }

  _beginMarkedContent(mcid, tag) {
    // Schreibt in PDF Stream: /tag << /MCID mcid >> BDC
    this.doc.internal.write(`/${tag} << /MCID ${mcid} >> BDC`);
  }

  _endMarkedContent() {
    // Schreibt in PDF Stream: EMC
    this.doc.internal.write('EMC');
  }

  _isBlockElement(tag) {
    const blockElements = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'Div'];
    return blockElements.includes(tag);
  }
}
```

#### ImageWrapper

**Verantwortung:** Erweitert `doc.addImage()` um Alt-Text

```javascript
class ImageWrapper {
  constructor(structureTree, originalImageFn) {
    this.structureTree = structureTree;
    this.originalImageFn = originalImageFn;
  }

  addImage(imageData, format, x, y, width, height, alias, compression, options = {}) {
    const altText = options.alt || '';
    const mcid = this.structureTree.getNextMCID();

    // Figure Structure Element mit Alt-Text
    const figureElement = this.structureTree.createStructElement('Figure', {
      alt: altText
    });

    // Marked Content
    this._beginMarkedContent(mcid, 'Figure');

    // Original addImage() aufrufen
    const result = this.originalImageFn.call(
      this.doc,
      imageData, format, x, y, width, height, alias, compression
    );

    this._endMarkedContent();

    // MCID verknüpfen
    this.structureTree.markContent(mcid, figureElement);

    return result;
  }

  _beginMarkedContent(mcid, tag) {
    this.doc.internal.write(`/${tag} << /MCID ${mcid} >> BDC`);
  }

  _endMarkedContent() {
    this.doc.internal.write('EMC');
  }
}
```

---

## 3. API-Design

### 3.1 Aktivierung

```javascript
// Option 1: Bei Initialisierung
const doc = new jsPDF({ accessibility: true });

// Option 2: Nachträglich aktivieren
const doc = new jsPDF();
doc.enableAccessibility();

// Option 3: Mit erweiterten Optionen
const doc = new jsPDF({
  accessibility: {
    enabled: true,
    pdfuaVersion: '1',        // PDF/UA-1
    language: 'de-DE',         // Dokumentsprache
    title: 'Mein Dokument',    // Titel für Metadaten
    author: 'Max Mustermann',
    autoTag: true              // Automatische Tag-Erkennung
  }
});
```

### 3.2 Manuelle Struktur-Definition

```javascript
// Heading-Hierarchie
doc.setFontSize(24);
doc.text('Hauptüberschrift', 10, 10, { structTag: 'H1' });

doc.setFontSize(18);
doc.text('Unterüberschrift', 10, 20, { structTag: 'H2' });

doc.setFontSize(12);
doc.text('Normaler Text', 10, 30, { structTag: 'P' });

// Bild mit Alt-Text
doc.addImage(imgData, 'PNG', 10, 40, 50, 50, undefined, 'FAST', {
  alt: 'Ein Screenshot der Barriere auf der Webseite'
});

// Liste
doc.beginStructElement('L');  // List
  doc.beginStructElement('LI'); // List Item
    doc.text('Erster Punkt', 10, 100, { structTag: 'Lbl' });
  doc.endStructElement();
  doc.beginStructElement('LI');
    doc.text('Zweiter Punkt', 10, 110, { structTag: 'Lbl' });
  doc.endStructElement();
doc.endStructElement();
```

### 3.3 Automatische Struktur (Empfohlen)

```javascript
const doc = new jsPDF({
  accessibility: { enabled: true, autoTag: true }
});

// Plugin erkennt automatisch basierend auf Schriftgröße/Stil
doc.setFontSize(24);
doc.setFont('helvetica', 'bold');
doc.text('Dies wird automatisch H1', 10, 10);
// → Automatisch als H1 getaggt

doc.setFontSize(12);
doc.setFont('helvetica', 'normal');
doc.text('Dies wird automatisch P', 10, 20);
// → Automatisch als P getaggt
```

### 3.4 Validierung

```javascript
// Vor dem Speichern validieren
const validation = doc.validateAccessibility();

if (validation.isValid) {
  doc.save('accessible.pdf');
} else {
  console.error('PDF/UA Validation Errors:', validation.errors);
  // Beispiel-Fehler:
  // [
  //   { code: 'IMG_NO_ALT', message: 'Bild auf Seite 1 hat keinen Alt-Text' },
  //   { code: 'MISSING_LANG', message: 'Dokumentsprache nicht definiert' }
  // ]
}
```

### 3.5 Metadaten

```javascript
doc.setDocumentProperties({
  title: 'BITV-Testbericht',
  author: 'Heiko Folkerts',
  subject: 'Barrierefreiheitstests nach BITV',
  language: 'de-DE',
  keywords: 'Barrierefreiheit, BITV, WCAG'
});
```

---

## 4. PDF-Struktur-Output

### 4.1 Catalog-Erweiterung

```
% Bestehender Catalog
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R

  % NEU: Accessibility-Features
  /MarkInfo << /Marked true >>          % ← Kennzeichnet Tagged PDF
  /Lang (de-DE)                         % ← Dokumentsprache
  /StructTreeRoot 10 0 R                % ← Verweis auf Structure Tree
>>
endobj
```

### 4.2 StructTreeRoot Object

```
10 0 obj
<<
  /Type /StructTreeRoot
  /K 11 0 R                             % ← Root Structure Element
  /ParentTree 12 0 R                    % ← ParentTree (MCID → StructElem)
  /RoleMap << /H /H1 /Heading /H >>     % ← Custom Role Mapping (optional)
>>
endobj
```

### 4.3 Structure Elements (Beispiel)

```
% Root Document
11 0 obj
<<
  /Type /StructElem
  /S /Document
  /P 10 0 R                             % ← Parent: StructTreeRoot
  /K [13 0 R 14 0 R 15 0 R]             % ← Children: H1, P, Figure
>>
endobj

% H1 Heading
13 0 obj
<<
  /Type /StructElem
  /S /H1
  /P 11 0 R                             % ← Parent: Document
  /K 0                                  % ← MCID 0 (Content auf Seite)
  /Pg 3 0 R                             % ← Page Reference
>>
endobj

% Paragraph
14 0 obj
<<
  /Type /StructElem
  /S /P
  /P 11 0 R
  /K 1                                  % ← MCID 1
  /Pg 3 0 R
>>
endobj

% Figure mit Alt-Text
15 0 obj
<<
  /Type /StructElem
  /S /Figure
  /P 11 0 R
  /K 2                                  % ← MCID 2
  /Pg 3 0 R
  /Alt (Screenshot der Barriere)        % ← Alt-Text!
>>
endobj
```

### 4.4 Page Content mit Marked Content

```
% Page Content Stream
3 0 obj
<<
  /Length 450
>>
stream
BT
  /F1 24 Tf
  50 750 Td

  % Marked Content für H1
  /H1 << /MCID 0 >> BDC                 % ← Begin Marked Content
    (Hauptüberschrift) Tj
  EMC                                   % ← End Marked Content

  /F1 12 Tf
  50 720 Td

  % Marked Content für P
  /P << /MCID 1 >> BDC
    (Dies ist ein normaler Absatz.) Tj
  EMC

ET

% Marked Content für Figure
/Figure << /MCID 2 >> BDC
  q 50 0 0 50 50 600 cm
  /Im1 Do
  Q
EMC
endstream
endobj
```

### 4.5 ParentTree (NumberTree)

```
12 0 obj
<<
  /Nums [
    0 13 0 R                            % ← MCID 0 → H1 Element
    1 14 0 R                            % ← MCID 1 → P Element
    2 15 0 R                            % ← MCID 2 → Figure Element
  ]
>>
endobj
```

---

## 5. Kompatibilität & Migration

### 5.1 Backward Compatibility

**100% Abwärtskompatibel:**

```javascript
// Bestehender Code (ohne Plugin)
const doc = new jsPDF();
doc.text('Hello', 10, 10);
doc.save('old.pdf');
// → Funktioniert unverändert, kein Tagged PDF

// Bestehender Code (mit Plugin geladen, aber nicht aktiviert)
import 'jspdf-accessibility';
const doc = new jsPDF();  // accessibility: false (default)
doc.text('Hello', 10, 10);
doc.save('old.pdf');
// → Funktioniert unverändert, kein Tagged PDF
```

### 5.2 Opt-in Migration

```javascript
// Schritt 1: Plugin laden
import 'jspdf-accessibility';

// Schritt 2: Aktivieren
const doc = new jsPDF({ accessibility: true });

// Schritt 3: Bestehender Code funktioniert, aber mit Auto-Tagging
doc.text('Hello', 10, 10);
// → Wird automatisch als P getaggt (basierend auf Font-Größe)

// Schritt 4: Optional explizite Tags für bessere Struktur
doc.text('Title', 10, 10, { structTag: 'H1' });
```

### 5.3 Breaking Changes: KEINE

Das Plugin ist als **nicht-invasives Plugin** designed:
- Keine Änderungen an Core jsPDF API
- Keine Änderungen an bestehenden Funktions-Signaturen
- Nur neue optionale Parameter (`options.structTag`, `options.alt`)

---

## 6. Testing-Strategie

### 6.1 Unit Tests

```javascript
describe('StructureTreeManager', () => {
  it('should create root Document element', () => {
    const manager = new StructureTreeManager(mockDoc);
    manager.initialize();
    expect(manager.root.type).toBe('Document');
  });

  it('should handle nested elements correctly', () => {
    manager.beginElement('Div');
      manager.beginElement('P');
      manager.endElement();
    manager.endElement();

    expect(manager.currentElement).toBe(manager.root);
  });

  it('should assign unique MCIDs', () => {
    const mcid1 = manager.getNextMCID();
    const mcid2 = manager.getNextMCID();
    expect(mcid2).toBe(mcid1 + 1);
  });
});
```

### 6.2 Integration Tests

```javascript
describe('PDF/UA-1 Output', () => {
  it('should generate valid Tagged PDF structure', () => {
    const doc = new jsPDF({ accessibility: true });
    doc.text('Heading', 10, 10, { structTag: 'H1' });
    doc.text('Paragraph', 10, 20, { structTag: 'P' });

    const pdfOutput = doc.output('datauristring');
    const parsed = parsePDF(pdfOutput);

    expect(parsed.catalog.MarkInfo.Marked).toBe(true);
    expect(parsed.catalog.StructTreeRoot).toBeDefined();
    expect(parsed.structTree.root.type).toBe('Document');
    expect(parsed.structTree.root.children).toHaveLength(2);
  });
});
```

### 6.3 PDF/UA Validation Tests

```javascript
describe('PDF/UA-1 Compliance', () => {
  it('should pass PAC validation', async () => {
    const doc = new jsPDF({
      accessibility: {
        enabled: true,
        language: 'en-US'
      }
    });

    doc.text('Test', 10, 10, { structTag: 'P' });

    const pdfBuffer = doc.output('arraybuffer');

    // Validate with PAC (PDF Accessibility Checker)
    const validation = await validateWithPAC(pdfBuffer);

    expect(validation.errors).toHaveLength(0);
    expect(validation.isPDFUA).toBe(true);
  });
});
```

---

## 7. Upstream-Contribution Strategy

### 7.1 Warum jsPDF das Plugin akzeptieren sollte

**Hauptargumente für Pull Request:**

1. **Community-Bedarf (hoch)**
   - 100+ GitHub Issues zu "accessibility", "tagged PDF", "screen reader"
   - Häufigste Feature-Requests
   - Keine Alternative in jsPDF-Ökosystem

2. **Keine Breaking Changes**
   - Opt-in Plugin
   - 100% Backward Compatible
   - Kein Performance-Impact für Non-Accessibility-Use-Cases

3. **Standards-konform**
   - Implementiert offizielle PDF/UA-1 Spec (ISO 14289-1:2014)
   - Befolgt WCAG 2.1 Guidelines
   - Validierbar mit Standard-Tools (PAC, Acrobat)

4. **Production-Ready**
   - Umfassende Tests (Unit + Integration + PDF/UA Validation)
   - Vollständige TypeScript Definitions
   - Dokumentation (API, Tutorials, Best Practices)

5. **Wartungsarm**
   - Kapselt in separatem Plugin
   - Minimale Abhängigkeiten zu jsPDF Core
   - Klare Verantwortlichkeiten

### 7.2 Contribution Roadmap

#### Phase 1: Proof of Concept (4-6 Wochen)
- Minimale lauffähige Implementation
- Core Features: MarkInfo, StructTreeRoot, Basic Tagging
- Einfache Demo
- **Ziel:** Zeigen dass es machbar ist

#### Phase 2: Alpha-Version (8-10 Wochen)
- Vollständige StructureTreeManager Implementation
- Text & Image Wrapping
- Automatische Tag-Erkennung
- Unit Tests
- **Ziel:** Intern testbar

#### Phase 3: Beta-Version (4-6 Wochen)
- PDF/UA Validation
- Integration Tests
- Dokumentation (API, Examples)
- **Ziel:** Community Testing

#### Phase 4: Release Candidate (4-6 Wochen)
- PAC Validation Tests
- TypeScript Definitions
- Performance Optimization
- Migration Guide
- **Ziel:** Production-Ready

#### Phase 5: Pull Request (2-4 Wochen)
- Code Review Feedback einarbeiten
- jsPDF Maintainer Feedback
- **Ziel:** Merge in jsPDF upstream

**Gesamtdauer: 22-32 Wochen (5-8 Monate)**

### 7.3 PR-Submission Checklist

```markdown
## jsPDF-Accessibility Plugin

**Typ:** Feature (Plugin)
**Breaking Changes:** Keine
**Issue:** Closes #847, #1234, #2345 (und weitere Accessibility Issues)

### Beschreibung

Fügt PDF/UA-1 (ISO 14289-1:2014) Unterstützung zu jsPDF hinzu als opt-in Plugin.

**Features:**
- ✅ Tagged PDF Structure (StructTreeRoot, StructElements)
- ✅ Marked Content Sequences mit MCIDs
- ✅ Alt-Text für Bilder
- ✅ Automatische Tag-Erkennung
- ✅ PDF/UA-1 Validation
- ✅ WCAG 2.1 AA Konformität

**Tests:**
- ✅ Unit Tests (95% Coverage)
- ✅ Integration Tests
- ✅ PDF/UA Validation Tests (PAC)
- ✅ Backward Compatibility Tests

**Dokumentation:**
- ✅ API Documentation
- ✅ Migration Guide
- ✅ Examples (5 Use Cases)
- ✅ TypeScript Definitions

### Breaking Changes
Keine. Plugin ist vollständig opt-in.

### Checklist
- [x] Tests geschrieben und bestanden (`npm run test-local`)
- [x] TypeScript Definitions aktualisiert (`types/index.d.ts`)
- [x] Code formatiert (`npm run prettier`)
- [x] PDF 1.3+ Spec befolgt
- [x] Polyfills dokumentiert (`src/polyfills.js`)
- [x] CI Tests grün
- [x] Keine dist/ Files committed

### Screenshots/Examples
[Beispiel-PDF mit PAC Validation Report]
```

---

## 8. Langfristige Vision

### 8.1 Roadmap nach Initial Release

**v1.0 (Initial Release)**
- PDF/UA-1 Konformität
- Text & Bild Tagging
- Automatische Tag-Erkennung
- Basic Validation

**v1.1 (Erweitert)**
- Tabellen-Support (`<Table>`, `<TR>`, `<TD>`)
- Listen-Support (`<L>`, `<LI>`, `<Lbl>`)
- Custom RoleMap

**v1.2 (Advanced)**
- Formulare (interaktive PDFs)
- Annotations mit Alt-Text
- Lesezeichen/Bookmarks

**v2.0 (Next Level)**
- PDF/UA-2 Support (wenn veröffentlicht)
- WCAG 2.2 / 3.0 Features
- AI-basierte Accessibility Improvements

### 8.2 Community-Building

Nach erfolgreichem Merge:
- Deutsche Accessibility-Community einbinden (BIK, BITV-Test)
- Konferenzen (z.B. CSUN, Accessibility Days)
- Blog-Posts & Tutorials
- Workshops & Webinare

---

## Anhang: Technische Referenzen

### PDF-Spezifikationen
- **PDF 1.3:** https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdfs/pdf_reference_archives/PDFReference13.pdf
- **PDF/UA-1 (ISO 14289-1:2014):** https://www.iso.org/standard/64599.html
- **WCAG 2.1:** https://www.w3.org/TR/WCAG21/

### Existierende Implementierungen (als Referenz)
- **PDFKit Tagged PDF:** https://github.com/foliojs/pdfkit
- **Apache PDFBox:** https://pdfbox.apache.org/
- **iText 7:** https://itextpdf.com/

### Tools
- **PAC (PDF Accessibility Checker):** https://pdfua.foundation/
- **veraPDF:** https://verapdf.org/

---

**Version:** 1.0.0
**Status:** 📋 Konzept-Phase
**Nächster Schritt:** Produkt-Backlog erstellen
