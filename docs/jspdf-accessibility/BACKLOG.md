# jsPDF-Accessibility Plugin - Produkt-Backlog

**Version:** 1.0.0
**Datum:** 20. Oktober 2025
**Aktualisiert:** 7. Februar 2026
**Projekt:** PDF/UA-1 Plugin für jsPDF
**Ziel:** ~~Community Contribution (Pull Request)~~ → Eigenständiger Fork (PR ohne Feedback)

---

> **Status-Update (Februar 2026):** Der jsPDF-UA Fork wurde als eigenständiges Projekt unter `../jsPDF-UA/` realisiert und in AccNotes integriert. Die Core-Features (Structure Tree, Marked Content, Artifacts, Figure mit Alt-Text, Atkinson Hyperlegible Font, XMP-Metadata) sind implementiert und getestet. Der PR an jsPDF upstream blieb ohne Feedback - der Fork wird als eigenständiges Projekt weitergeführt. Viele der unten aufgeführten Backlog-Items sind damit abgeschlossen oder hinfällig.

---

## Backlog-Struktur

Jedes Item hat:
- **ID:** Eindeutige Nummer (ACC-XXX)
- **Titel:** Kurzbeschreibung
- **Priorität:** P0 (Muss), P1 (Sollte), P2 (Kann)
- **Aufwand:** Story Points (1 SP = ~0.5 Personentage)
- **Abhängigkeiten:** Andere Items
- **Definition of Done:** Klar definierte Abnahmekriterien

---

## Epic 1: Projekt-Setup & Infrastruktur

### ACC-001: Repository & Build-Setup
**Priorität:** P0 | **Aufwand:** 3 SP | **Abhängigkeiten:** Keine

**Beschreibung:**
Erstelle Projekt-Struktur, Build-System und Development-Environment.

**Tasks:**
- [ ] Repository-Struktur anlegen (siehe CONCEPT.md)
- [ ] package.json mit Dependencies konfigurieren
- [ ] Build-System einrichten (Webpack/Rollup für UMD/ESM)
- [ ] ESLint & Prettier konfigurieren
- [ ] Git Hooks (pre-commit) einrichten
- [ ] README.md mit Development-Anleitung

**Definition of Done:**
- ✅ `npm install` funktioniert
- ✅ `npm run build` erstellt dist/jspdf-accessibility.js
- ✅ `npm run lint` zeigt keine Fehler
- ✅ Git Hooks laufen automatisch

**Dateien:**
```
jspdf-accessibility/
├── package.json
├── .eslintrc.js
├── .prettierrc
├── webpack.config.js
├── .gitignore
└── README.md
```

---

### ACC-002: Testing-Infrastruktur
**Priorität:** P0 | **Aufwand:** 3 SP | **Abhängigkeiten:** ACC-001

**Beschreibung:**
Richte Test-Framework und CI/CD Pipeline ein.

**Tasks:**
- [ ] Jest konfigurieren
- [ ] Test-Utilities für PDF-Parsing schreiben
- [ ] GitHub Actions Workflow erstellen
- [ ] Test-Coverage-Reporting (Coveralls/Codecov)
- [ ] PDF-Validator Integration (PAC oder veraPDF)

**Definition of Done:**
- ✅ `npm test` führt alle Tests aus
- ✅ GitHub Actions läuft bei jedem Push
- ✅ Coverage-Report wird generiert
- ✅ PDF-Validierung funktioniert

**Dateien:**
```
├── jest.config.js
├── .github/workflows/ci.yml
└── test/
    ├── helpers/
    │   ├── pdfParser.js
    │   └── pdfValidator.js
    └── setup.js
```

---

### ACC-003: TypeScript Definitions Setup
**Priorität:** P0 | **Aufwand:** 2 SP | **Abhängigkeiten:** ACC-001

**Beschreibung:**
Erstelle TypeScript-Definitionen für Plugin-API.

**Tasks:**
- [ ] types/index.d.ts erstellen
- [ ] jsPDF-Erweiterungen definieren
- [ ] AccessibilityOptions Interface
- [ ] StructTag Enum/Type
- [ ] dtslint für Type-Checking

**Definition of Done:**
- ✅ TypeScript-Projekt kann Plugin importieren ohne Fehler
- ✅ Autocompletion funktioniert in VS Code
- ✅ `npm run test:types` erfolgreich

**Dateien:**
```
└── types/
    ├── index.d.ts
    └── test/
        └── index.test-d.ts
```

---

## Epic 2: Core Implementation

### ACC-010: NumberTree Implementation
**Priorität:** P0 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-001

**Beschreibung:**
Implementiere NumberTree-Struktur für ParentTree (MCID → StructElem Mapping).

**Tasks:**
- [ ] NumberTree Klasse implementieren
- [ ] add(key, value) Methode
- [ ] get(key) Methode
- [ ] serialize() zu PDF-Format
- [ ] Unit Tests (100% Coverage)

**Definition of Done:**
- ✅ NumberTree kann MCID → StructElem mappings speichern
- ✅ Serialisierung zu PDF /Nums Array korrekt
- ✅ Tests bestanden
- ✅ JSDoc Dokumentation vollständig

**Testdaten:**
```javascript
// test/fixtures/numbertree-test-data.js
export const testCases = [
  {
    name: 'Simple mapping',
    input: [[0, 'ref1'], [1, 'ref2']],
    expectedPDF: '/Nums [0 ref1 1 ref2]'
  },
  {
    name: 'Large dataset (>100 entries)',
    input: Array.from({length: 200}, (_, i) => [i, `ref${i}`]),
    expectedPDF: '...' // Sollte in Kids-Array aufgeteilt werden
  }
];
```

**Datei:** `src/core/NumberTree.js`

---

### ACC-011: RoleMapManager Implementation
**Priorität:** P0 | **Aufwand:** 4 SP | **Abhängigkeiten:** ACC-001

**Beschreibung:**
Verwalte Standard- und Custom-Role-Mappings.

**Tasks:**
- [ ] RoleMapManager Klasse
- [ ] Standard PDF/UA Roles definieren
- [ ] Custom Role Registration API
- [ ] Role-Validierung
- [ ] Unit Tests

**Definition of Done:**
- ✅ Standard-Roles (H1-H6, P, Figure, etc.) definiert
- ✅ Custom Roles registrierbar
- ✅ Serialisierung zu /RoleMap Dictionary
- ✅ Tests bestanden

**Testdaten:**
```javascript
// test/fixtures/rolemap-test-data.js
export const standardRoles = [
  'Document', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'P', 'Figure', 'Table', 'TR', 'TD', 'L', 'LI', 'Lbl'
];

export const customRoleMappings = [
  { custom: 'Header', standardRole: 'H1' },
  { custom: 'Subheader', standardRole: 'H2' },
  { custom: 'Image', standardRole: 'Figure' }
];
```

**Datei:** `src/core/RoleMapManager.js`

---

### ACC-012: MarkInfoHandler Implementation
**Priorität:** P0 | **Aufwand:** 3 SP | **Abhängigkeiten:** ACC-001

**Beschreibung:**
Verwalte MarkInfo Dictionary im PDF Catalog.

**Tasks:**
- [ ] MarkInfoHandler Klasse
- [ ] setMarked(true) Methode
- [ ] setSuspects(false) Methode
- [ ] serialize() zu PDF Dictionary
- [ ] Unit Tests

**Definition of Done:**
- ✅ MarkInfo Dictionary wird korrekt generiert
- ✅ Im Catalog-Object referenzierbar
- ✅ Tests bestanden

**Testdaten:**
```javascript
// test/fixtures/markinfo-test-data.js
export const expectedMarkInfo = {
  pdfString: '<< /Type /MarkInfo /Marked true /Suspects false >>',
  object: { Type: 'MarkInfo', Marked: true, Suspects: false }
};
```

**Datei:** `src/core/MarkInfoHandler.js`

---

### ACC-013: StructureTreeManager Implementation
**Priorität:** P0 | **Aufwand:** 13 SP | **Abhängigkeiten:** ACC-010, ACC-011, ACC-012

**Beschreibung:**
Hauptklasse für Structure Tree Verwaltung (Kern des Plugins).

**Tasks:**
- [ ] StructureTreeManager Klasse
- [ ] initialize() - Root Document Element
- [ ] createStructElement(type, attributes)
- [ ] beginElement(type) / endElement()
- [ ] markContent(mcid, structElement)
- [ ] getNextMCID()
- [ ] Element-Stack Verwaltung
- [ ] serialize() zu PDF Objects
- [ ] Integration mit NumberTree, RoleMap
- [ ] Unit Tests (>90% Coverage)
- [ ] Integration Tests

**Definition of Done:**
- ✅ Kann verschachtelte Struktur-Hierarchie verwalten
- ✅ MCIDs werden korrekt zugewiesen und gemappt
- ✅ Serialisierung zu PDF StructTreeRoot + StructElems
- ✅ Tests bestanden
- ✅ Dokumentation vollständig

**Testdaten:**
```javascript
// test/fixtures/structure-tree-test-data.js
export const simpleStructure = {
  description: 'Document with H1 and P',
  structure: {
    type: 'Document',
    children: [
      { type: 'H1', mcids: [0] },
      { type: 'P', mcids: [1] }
    ]
  },
  expectedObjectCount: 4 // Root, Document, H1, P
};

export const nestedStructure = {
  description: 'Document with nested Divs',
  structure: {
    type: 'Document',
    children: [
      {
        type: 'Div',
        children: [
          { type: 'H2', mcids: [0] },
          { type: 'P', mcids: [1] }
        ]
      }
    ]
  },
  expectedObjectCount: 5 // Root, Document, Div, H2, P
};
```

**Datei:** `src/core/StructureTreeManager.js`

---

## Epic 3: jsPDF API Integration

### ACC-020: TextWrapper Implementation
**Priorität:** P0 | **Aufwand:** 8 SP | **Abhängigkeiten:** ACC-013

**Beschreibung:**
Erweitere `doc.text()` um Marked Content und Structure Tagging.

**Tasks:**
- [ ] TextWrapper Klasse
- [ ] Original `doc.text()` wrappen
- [ ] Marked Content Stream schreiben (BDC/EMC)
- [ ] MCID Zuweisung
- [ ] Structure Element Erstellung
- [ ] Automatische Tag-Erkennung (TagGuesser)
- [ ] Unit Tests
- [ ] Integration Tests mit realem jsPDF

**Definition of Done:**
- ✅ `doc.text()` funktioniert mit und ohne `structTag` Option
- ✅ Marked Content wird korrekt in PDF Stream geschrieben
- ✅ Structure Tree wird aktualisiert
- ✅ Automatische Tag-Erkennung funktioniert
- ✅ Tests bestanden

**Testdaten:**
```javascript
// test/fixtures/text-wrapper-test-data.js
export const textTests = [
  {
    name: 'Explicit H1 tag',
    code: `doc.text('Title', 10, 10, { structTag: 'H1' })`,
    expectedMCID: 0,
    expectedStructTag: 'H1',
    expectedPDFStream: '/H1 << /MCID 0 >> BDC\n(Title) Tj\nEMC'
  },
  {
    name: 'Auto-detect H1 (fontSize 24)',
    code: `doc.setFontSize(24); doc.text('Title', 10, 10)`,
    expectedStructTag: 'H1',
    reason: 'Font size >= 24 should auto-detect as H1'
  },
  {
    name: 'Auto-detect P (fontSize 12)',
    code: `doc.setFontSize(12); doc.text('Body', 10, 10)`,
    expectedStructTag: 'P',
    reason: 'Font size 10-14 should auto-detect as P'
  }
];
```

**Dateien:**
- `src/wrappers/TextWrapper.js`
- `src/utils/TagGuesser.js`

---

### ACC-021: ImageWrapper Implementation
**Priorität:** P0 | **Aufwand:** 6 SP | **Abhängigkeiten:** ACC-013

**Beschreibung:**
Erweitere `doc.addImage()` um Alt-Text und Structure Tagging.

**Tasks:**
- [ ] ImageWrapper Klasse
- [ ] Original `doc.addImage()` wrappen
- [ ] Marked Content für Figure
- [ ] Alt-Text in Structure Element
- [ ] MCID Zuweisung
- [ ] Unit Tests
- [ ] Integration Tests

**Definition of Done:**
- ✅ `doc.addImage()` funktioniert mit `options.alt` Parameter
- ✅ Figure Element mit Alt-Text wird erstellt
- ✅ Marked Content korrekt
- ✅ Tests bestanden

**Testdaten:**
```javascript
// test/fixtures/image-wrapper-test-data.js
export const imageTests = [
  {
    name: 'Image with Alt-Text',
    code: `doc.addImage(imgData, 'PNG', 10, 10, 50, 50, undefined, 'FAST', { alt: 'Test image' })`,
    expectedStructElement: {
      type: 'Figure',
      attributes: { alt: 'Test image' },
      mcids: [0]
    }
  },
  {
    name: 'Image without Alt-Text (should warn)',
    code: `doc.addImage(imgData, 'PNG', 10, 10, 50, 50)`,
    expectedWarning: 'Image without alt-text will fail PDF/UA validation',
    expectedStructElement: {
      type: 'Figure',
      attributes: { alt: '' }  // Leer, aber vorhanden
    }
  }
];
```

**Datei:** `src/wrappers/ImageWrapper.js`

---

### ACC-022: PageWrapper Implementation
**Priorität:** P0 | **Aufwand:** 4 SP | **Abhängigkeiten:** ACC-013

**Beschreibung:**
Erweitere `doc.addPage()` für Structure Tree Page-Handling.

**Tasks:**
- [ ] PageWrapper Klasse
- [ ] Original `doc.addPage()` wrappen
- [ ] Structure Tree State bei neuem Page
- [ ] MCID Counter fortsetzung
- [ ] Unit Tests

**Definition of Done:**
- ✅ Mehrseitige PDFs haben korrekte Structure
- ✅ MCIDs sind unique über alle Pages
- ✅ Tests bestanden

**Testdaten:**
```javascript
// test/fixtures/page-wrapper-test-data.js
export const multipageTests = [
  {
    name: 'Two pages with content',
    pages: [
      { content: ['H1: Page 1', 'P: Content 1'], expectedMCIDs: [0, 1] },
      { content: ['H1: Page 2', 'P: Content 2'], expectedMCIDs: [2, 3] }
    ],
    expectedPageCount: 2,
    expectedMCIDRange: [0, 3]
  }
];
```

**Datei:** `src/wrappers/PageWrapper.js`

---

### ACC-023: Plugin Entry Point & Initialization
**Priorität:** P0 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-020, ACC-021, ACC-022

**Beschreibung:**
Haupteinstiegspunkt des Plugins - integriert alle Komponenten in jsPDF.

**Tasks:**
- [ ] Plugin-Registrierung in jsPDF.API
- [ ] `jsPDF({ accessibility: true })` Option
- [ ] Wrapper-Installation (Text, Image, Page)
- [ ] `doc.enableAccessibility()` Methode
- [ ] `doc.disableAccessibility()` Methode
- [ ] Unit Tests
- [ ] Integration Tests mit komplettem Workflow

**Definition of Done:**
- ✅ Plugin kann in jsPDF geladen werden
- ✅ Alle Wrapper funktionieren zusammen
- ✅ Enable/Disable funktioniert
- ✅ Tests bestanden

**Beispiel-Anwendung:**
```javascript
// examples/basic-usage.js
import jsPDF from 'jspdf';
import 'jspdf-accessibility';

const doc = new jsPDF({ accessibility: true });

doc.setFontSize(24);
doc.text('Accessible Document', 10, 10, { structTag: 'H1' });

doc.setFontSize(12);
doc.text('This is a paragraph.', 10, 20, { structTag: 'P' });

doc.addImage(imgData, 'PNG', 10, 30, 50, 50, undefined, 'FAST', {
  alt: 'Example image description'
});

doc.save('accessible.pdf');
```

**Datei:** `src/index.js`

---

## Epic 4: Validation & Quality

### ACC-030: PDF/UA-1 Validator
**Priorität:** P1 | **Aufwand:** 8 SP | **Abhängigkeiten:** ACC-023

**Beschreibung:**
Implementiere Built-in PDF/UA-1 Compliance Checker.

**Tasks:**
- [ ] PDFUA1Validator Klasse
- [ ] Check: MarkInfo vorhanden und Marked=true
- [ ] Check: StructTreeRoot vorhanden
- [ ] Check: Alle MCIDs in ParentTree gemappt
- [ ] Check: Alle Bilder haben Alt-Text
- [ ] Check: Dokumentsprache definiert
- [ ] Check: Heading-Hierarchie korrekt (H1 → H2 → H3, keine Sprünge)
- [ ] Validation-Report generieren
- [ ] Unit Tests für jeden Check

**Definition of Done:**
- ✅ `doc.validateAccessibility()` gibt ValidationResult zurück
- ✅ Alle PDF/UA-1 Pflicht-Checks implementiert
- ✅ Tests mit validen und invaliden PDFs
- ✅ Klare Fehlermeldungen

**Testdaten:**
```javascript
// test/fixtures/validation-test-data.js
export const validationTests = [
  {
    name: 'Valid PDF/UA-1',
    setup: (doc) => {
      doc.setLanguage('en-US');
      doc.text('Title', 10, 10, { structTag: 'H1' });
      doc.text('Text', 10, 20, { structTag: 'P' });
    },
    expectedValid: true,
    expectedErrors: []
  },
  {
    name: 'Missing language',
    setup: (doc) => {
      doc.text('Title', 10, 10, { structTag: 'H1' });
    },
    expectedValid: false,
    expectedErrors: [
      { code: 'MISSING_LANG', message: 'Document language not set' }
    ]
  },
  {
    name: 'Image without Alt-Text',
    setup: (doc) => {
      doc.setLanguage('en-US');
      doc.addImage(imgData, 'PNG', 10, 10, 50, 50);
    },
    expectedValid: false,
    expectedErrors: [
      { code: 'IMG_NO_ALT', message: 'Image on page 1 has no alt-text', severity: 'error' }
    ]
  },
  {
    name: 'Broken heading hierarchy (H1 → H3)',
    setup: (doc) => {
      doc.setLanguage('en-US');
      doc.text('Main', 10, 10, { structTag: 'H1' });
      doc.text('Sub', 10, 20, { structTag: 'H3' }); // Fehler: H2 übersprungen
    },
    expectedValid: false,
    expectedErrors: [
      { code: 'HEADING_SKIP', message: 'Heading hierarchy jumps from H1 to H3' }
    ]
  }
];
```

**Datei:** `src/validators/PDFUA1Validator.js`

---

### ACC-031: WCAG Validator
**Priorität:** P2 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-030

**Beschreibung:**
Zusätzliche WCAG 2.1 Checks (z.B. Kontrast, Schriftgröße).

**Tasks:**
- [ ] WCAGValidator Klasse
- [ ] Check: Mindest-Schriftgröße (10pt für Body-Text)
- [ ] Check: Kontrast (simuliert, da PDF statisch)
- [ ] Check: Sinnvolle Alt-Texte (Länge > 5 Zeichen)
- [ ] Unit Tests

**Definition of Done:**
- ✅ WCAG 2.1 AA Checks implementiert
- ✅ Warnungen (nicht Fehler) für Best Practices
- ✅ Tests bestanden

**Testdaten:**
```javascript
// test/fixtures/wcag-test-data.js
export const wcagTests = [
  {
    name: 'Font size too small',
    setup: (doc) => {
      doc.setFontSize(8);
      doc.text('Tiny text', 10, 10, { structTag: 'P' });
    },
    expectedWarnings: [
      { code: 'FONT_TOO_SMALL', message: 'Font size 8pt is below recommended 10pt minimum' }
    ]
  },
  {
    name: 'Alt-text too short',
    setup: (doc) => {
      doc.addImage(img, 'PNG', 10, 10, 50, 50, undefined, 'FAST', { alt: 'Img' });
    },
    expectedWarnings: [
      { code: 'ALT_TOO_SHORT', message: 'Alt-text "Img" is very short (3 chars). Consider more descriptive text.' }
    ]
  }
];
```

**Datei:** `src/validators/WCAGValidator.js`

---

### ACC-032: PAC Integration Tests
**Priorität:** P1 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-023

**Beschreibung:**
Automatische Validierung generierter PDFs mit PAC (PDF Accessibility Checker).

**Tasks:**
- [ ] PAC CLI Wrapper schreiben
- [ ] Test-Runner für PAC-Validierung
- [ ] Verschiedene Test-PDFs generieren
- [ ] PAC-Report parsen
- [ ] Integration in CI/CD

**Definition of Done:**
- ✅ Generierte PDFs können mit PAC validiert werden
- ✅ CI läuft PAC-Tests automatisch
- ✅ Reports werden ausgewertet

**Testdaten:**
```javascript
// test/pac/test-cases.js
export const pacTestCases = [
  {
    name: 'Simple document',
    generator: (doc) => {
      doc.setLanguage('en-US');
      doc.setDocumentProperties({ title: 'Test Document' });
      doc.text('Hello', 10, 10, { structTag: 'P' });
    },
    expectedPACResult: {
      isPDFUA: true,
      errorCount: 0
    }
  },
  {
    name: 'Complex document',
    generator: (doc) => {
      doc.setLanguage('en-US');
      doc.text('Title', 10, 10, { structTag: 'H1' });
      doc.text('Subtitle', 10, 20, { structTag: 'H2' });
      doc.text('Paragraph', 10, 30, { structTag: 'P' });
      doc.addImage(testImg, 'PNG', 10, 40, 50, 50, undefined, 'FAST', {
        alt: 'Test image showing accessibility features'
      });
    },
    expectedPACResult: {
      isPDFUA: true,
      errorCount: 0,
      warningCount: 0
    }
  }
];
```

**Dateien:**
- `test/pac/pac-wrapper.js`
- `test/pac/test-runner.js`

---

## Epic 5: Examples & Documentation

### ACC-040: Basic Usage Examples
**Priorität:** P0 | **Aufwand:** 3 SP | **Abhängigkeiten:** ACC-023

**Beschreibung:**
Erstelle einfache Beispiele für Haupt-Use-Cases.

**Tasks:**
- [ ] examples/basic-usage.js - Einfachstes Beispiel
- [ ] examples/headings-structure.js - Heading-Hierarchie
- [ ] examples/images-with-alt.js - Bilder mit Alt-Text
- [ ] examples/multi-page.js - Mehrseitige Dokumente
- [ ] examples/auto-tagging.js - Automatische Tag-Erkennung
- [ ] Jedes Beispiel als lauffähiges Script
- [ ] README mit Screenshots der generierten PDFs

**Definition of Done:**
- ✅ 5 Beispiele funktionieren standalone
- ✅ Können mit `node examples/basic-usage.js` ausgeführt werden
- ✅ Generierte PDFs bestehen PAC-Validierung
- ✅ Screenshots in README dokumentiert

**Beispiel-Code:**
```javascript
// examples/basic-usage.js
const jsPDF = require('jspdf');
require('../dist/jspdf-accessibility');

const doc = new jsPDF({
  accessibility: {
    enabled: true,
    language: 'en-US',
    title: 'My First Accessible PDF'
  }
});

doc.setFontSize(24);
doc.text('Welcome', 10, 20, { structTag: 'H1' });

doc.setFontSize(12);
doc.text('This is an accessible PDF document.', 10, 35, { structTag: 'P' });

doc.save('basic-accessible.pdf');
console.log('✅ Generated: basic-accessible.pdf');
```

**Dateien:**
```
examples/
├── README.md
├── basic-usage.js
├── headings-structure.js
├── images-with-alt.js
├── multi-page.js
├── auto-tagging.js
└── output/              # Generierte PDFs + Screenshots
    ├── basic-accessible.pdf
    ├── basic-accessible.png
    ├── ...
```

---

### ACC-041: Advanced Examples
**Priorität:** P1 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-040

**Beschreibung:**
Erweiterte Beispiele für spezielle Use Cases.

**Tasks:**
- [ ] examples/tables-accessible.js - Tabellen (wenn implementiert)
- [ ] examples/lists-accessible.js - Listen (wenn implementiert)
- [ ] examples/nested-structure.js - Verschachtelte Divs
- [ ] examples/custom-roles.js - Custom RoleMap
- [ ] examples/validation-workflow.js - Mit Validierung
- [ ] examples/accnotes-integration.js - Spezifisch für AccNotes Use Case

**AccNotes-Spezifisches Beispiel:**
```javascript
// examples/accnotes-integration.js
/**
 * Dieses Beispiel zeigt, wie AccNotes das Plugin nutzen kann
 * für barrierefreie BITV-Testberichte.
 */
const jsPDF = require('jspdf');
require('../dist/jspdf-accessibility');

function generateBITVReport(note) {
  const doc = new jsPDF({
    accessibility: {
      enabled: true,
      language: 'de-DE',
      title: `BITV-Bericht: ${note.bitvTest.stepId}`,
      author: 'AccNotes'
    }
  });

  // Hauptüberschrift
  doc.setFontSize(24);
  doc.text(
    `BITV ${note.bitvTest.stepId}: ${note.bitvTest.stepTitle}`,
    10, 20,
    { structTag: 'H1' }
  );

  // BITV-Kategorie
  doc.setFontSize(14);
  doc.text(
    `Kategorie: ${note.bitvTest.category}`,
    10, 35,
    { structTag: 'H2' }
  );

  // Bewertung
  doc.setFontSize(12);
  doc.text(
    `Bewertung: ${note.bitvTest.evaluation}`,
    10, 50,
    { structTag: 'P' }
  );

  // Beschreibung
  doc.text(
    'Beschreibung:',
    10, 65,
    { structTag: 'Strong' }
  );
  const descLines = doc.splitTextToSize(note.content, 180);
  let yPos = 75;
  descLines.forEach(line => {
    doc.text(line, 10, yPos, { structTag: 'P' });
    yPos += 7;
  });

  // Screenshot (falls vorhanden)
  if (note.screenshotDataUrl) {
    doc.text(
      'Screenshot:',
      10, yPos + 5,
      { structTag: 'Strong' }
    );
    doc.addImage(
      note.screenshotDataUrl,
      'PNG',
      10, yPos + 15, 100, 75,
      undefined, 'FAST',
      { alt: `Screenshot zeigt: ${note.content.substring(0, 100)}` }
    );
  }

  // Validierung (optional)
  const validation = doc.validateAccessibility();
  if (!validation.isValid) {
    console.warn('⚠️ PDF/UA Validation Warnings:', validation.errors);
  }

  return doc;
}

// Test mit Beispiel-Notiz
const testNote = {
  bitvTest: {
    stepId: '1.1.1',
    stepTitle: 'Nicht-Text-Inhalte',
    category: 'Wahrnehmbarkeit',
    evaluation: 'Nicht bestanden'
  },
  content: 'Button ohne Beschriftung gefunden. Der Button hat weder sichtbaren Text noch ein aria-label.',
  screenshotDataUrl: '...' // Base64 PNG
};

const doc = generateBITVReport(testNote);
doc.save('bitv-report-1.1.1.pdf');
console.log('✅ BITV-Bericht generiert');
```

**Dateien:**
```
examples/
├── ...
├── tables-accessible.js
├── lists-accessible.js
├── nested-structure.js
├── custom-roles.js
├── validation-workflow.js
└── accnotes-integration.js
```

---

### ACC-042: API Documentation
**Priorität:** P0 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-023

**Beschreibung:**
Vollständige API-Dokumentation schreiben.

**Tasks:**
- [ ] docs/API.md - Vollständige API-Referenz
- [ ] JSDoc für alle öffentlichen Funktionen
- [ ] TypeScript-Kommentare
- [ ] Code-Beispiele für jede API-Methode
- [ ] Parameter-Beschreibungen

**Structure:**
```markdown
# API Documentation

## Initialization

### new jsPDF({ accessibility: options })
...

## Configuration Options

### AccessibilityOptions
...

## Methods

### doc.text(text, x, y, options)
...

### doc.addImage(..., options)
...

### doc.validateAccessibility()
...
```

**Datei:** `docs/API.md`

---

### ACC-043: Migration Guide
**Priorität:** P0 | **Aufwand:** 3 SP | **Abhängigkeiten:** ACC-042

**Beschreibung:**
Anleitung zur Migration bestehender jsPDF-Projekte.

**Tasks:**
- [ ] docs/MIGRATION.md erstellen
- [ ] Schritt-für-Schritt Anleitung
- [ ] Häufige Fallstricke dokumentieren
- [ ] Vorher/Nachher Code-Beispiele

**Structure:**
```markdown
# Migration Guide

## Schritt 1: Plugin installieren
...

## Schritt 2: Accessibility aktivieren
...

## Schritt 3: Alt-Texte hinzufügen
...

## Schritt 4: Struktur-Tags (optional)
...

## Schritt 5: Validieren
...

## Troubleshooting
...
```

**Datei:** `docs/MIGRATION.md`

---

### ACC-044: Best Practices Guide
**Priorität:** P1 | **Aufwand:** 3 SP | **Abhängigkeiten:** ACC-042

**Beschreibung:**
Best Practices für barrierefreie PDFs.

**Tasks:**
- [ ] docs/BEST_PRACTICES.md erstellen
- [ ] Do's and Don'ts
- [ ] Accessibility-Patterns
- [ ] Testing-Empfehlungen
- [ ] Deutsche und englische Version

**Datei:** `docs/BEST_PRACTICES.md`

---

### ACC-045: Deutsche Dokumentation
**Priorität:** P1 | **Aufwand:** 4 SP | **Abhängigkeiten:** ACC-042, ACC-043, ACC-044

**Beschreibung:**
Übersetze Haupt-Dokumentation ins Deutsche.

**Tasks:**
- [ ] docs/de/API.md
- [ ] docs/de/MIGRATION.md
- [ ] docs/de/BEST_PRACTICES.md
- [ ] README.de.md

**Dateien:**
```
docs/
├── API.md
├── MIGRATION.md
├── BEST_PRACTICES.md
└── de/
    ├── API.md
    ├── MIGRATION.md
    └── BEST_PRACTICES.md
```

---

## Epic 6: Upstream Contribution

### ACC-050: jsPDF Contribution Guidelines analysieren
**Priorität:** P0 | **Aufwand:** 2 SP | **Abhängigkeiten:** Keine

**Beschreibung:**
Detaillierte Analyse der jsPDF Contribution-Anforderungen.

**Tasks:**
- [ ] CONTRIBUTING.md lesen und verstehen
- [ ] Code-Style Guide analysieren
- [ ] Test-Anforderungen dokumentieren
- [ ] PR-Template vorbereiten
- [ ] Checklist erstellen

**Definition of Done:**
- ✅ Alle Anforderungen dokumentiert
- ✅ Checklist erstellt

**Datei:** `docs/CONTRIBUTION_CHECKLIST.md`

---

### ACC-051: Code-Style & Linting Anpassung
**Priorität:** P0 | **Aufwand:** 3 SP | **Abhängigkeiten:** ACC-050

**Beschreibung:**
Passe Code-Style an jsPDF Konventionen an.

**Tasks:**
- [ ] ESLint Config von jsPDF übernehmen
- [ ] Prettier Config anpassen
- [ ] Bestehenden Code refactoren
- [ ] `npm run prettier` erfolgreich

**Definition of Done:**
- ✅ Alle Dateien folgen jsPDF Code-Style
- ✅ Keine Linter-Errors
- ✅ Prettier-Check erfolgreich

---

### ACC-052: jsPDF Version Kompatibilität
**Priorität:** P0 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-023

**Beschreibung:**
Teste Plugin mit verschiedenen jsPDF-Versionen.

**Tasks:**
- [ ] Teste mit jsPDF 2.5.1 (aktuelle Version)
- [ ] Teste mit jsPDF 2.4.x (vorherige Major)
- [ ] Teste mit jsPDF 3.x (falls verfügbar)
- [ ] Kompatibilitäts-Matrix erstellen
- [ ] Mindest-Version definieren

**Definition of Done:**
- ✅ Plugin funktioniert mit definierten jsPDF-Versionen
- ✅ Kompatibilitäts-Matrix dokumentiert
- ✅ Mindest-Version in package.json spezifiziert

---

### ACC-053: Pull Request vorbereiten
**Priorität:** P0 | **Aufwand:** 5 SP | **Abhängigkeiten:** Alle vorherigen

**Beschreibung:**
PR für jsPDF Repository vorbereiten.

**Tasks:**
- [ ] Branch von jsPDF fork erstellen
- [ ] Code in jsPDF-Repository integrieren
- [ ] PR-Beschreibung schreiben
- [ ] Screenshots/Videos erstellen
- [ ] Review-Kommentare vorbereiten

**Definition of Done:**
- ✅ PR ist bereit zum Einreichen
- ✅ Alle Checklisten-Items erfüllt
- ✅ CI-Tests grün

**PR-Template:**
```markdown
## jsPDF-Accessibility Plugin

Adds PDF/UA-1 (ISO 14289-1:2014) support to jsPDF as opt-in plugin.

### Features
- Tagged PDF Structure
- Alt-text for images
- Automatic tag detection
- Built-in validation

### Breaking Changes
None. Plugin is fully opt-in.

### Tests
- Unit Tests: 95% coverage
- Integration Tests: ✅
- PAC Validation: ✅

### Documentation
- API Docs: ✅
- Examples: 5+ use cases
- Migration Guide: ✅

### Related Issues
Closes #847, #1234, ...

### Checklist
- [x] Tests passing
- [x] TypeScript definitions
- [x] Code formatted
- [x] PDF Spec compliant
- [x] CI green
```

---

## Epic 7: Polish & Release

### ACC-060: Performance Optimization
**Priorität:** P1 | **Aufwand:** 5 SP | **Abhängigkeiten:** ACC-023

**Beschreibung:**
Optimiere Plugin für Performance.

**Tasks:**
- [ ] Benchmark ohne vs. mit Plugin
- [ ] Structure Tree Serialisierung optimieren
- [ ] Memory Leaks prüfen
- [ ] Lazy Loading wo möglich
- [ ] Performance-Tests in CI

**Definition of Done:**
- ✅ Performance-Impact < 10% für aktiviertes Plugin
- ✅ Keine Memory Leaks
- ✅ Performance-Tests grün

---

### ACC-061: Bundle Size Optimization
**Priorität:** P1 | **Aufwand:** 3 SP | **Abhängigkeiten:** ACC-060

**Beschreibung:**
Minimiere Bundle-Größe.

**Tasks:**
- [ ] Tree-shaking ermöglichen
- [ ] Minification optimieren
- [ ] Code-Splitting (falls sinnvoll)
- [ ] Bundle-Größe in CI tracken

**Definition of Done:**
- ✅ Bundle-Größe < 50KB (minified)
- ✅ Tree-shaking funktioniert
- ✅ Größe wird in CI getrackt

---

### ACC-062: Error Handling & User Messages
**Priorität:** P1 | **Aufwand:** 4 SP | **Abhängigkeiten:** ACC-023

**Beschreibung:**
Verbessere Fehlermeldungen und Warnungen.

**Tasks:**
- [ ] Klare Error-Messages für häufige Fehler
- [ ] Warnungen für Best Practice Violations
- [ ] Console-Output konfigurierbar (quiet mode)
- [ ] Error-Code-Dokumentation

**Definition of Done:**
- ✅ Alle Fehler haben hilfreiche Messages
- ✅ Quiet-Mode funktioniert
- ✅ Error-Codes dokumentiert

---

### ACC-063: README & Landing Page
**Priorität:** P0 | **Aufwand:** 3 SP | **Abhängigkeiten:** Alle vorherigen

**Beschreibung:**
Erstelle ansprechendes README.

**Tasks:**
- [ ] README.md mit Badges, Screenshots
- [ ] Quick-Start Guide
- [ ] Feature-Liste
- [ ] Links zu Dokumentation
- [ ] Deutsche und englische Version

**Definition of Done:**
- ✅ README ist vollständig
- ✅ Screenshots vorhanden
- ✅ Beide Sprachen verfügbar

---

### ACC-064: Release Notes & Changelog
**Priorität:** P0 | **Aufwand:** 2 SP | **Abhängigkeiten:** ACC-063

**Beschreibung:**
Erstelle Release Notes.

**Tasks:**
- [ ] CHANGELOG.md
- [ ] Release Notes für v1.0.0
- [ ] Breaking Changes (keine erwartet)
- [ ] Migration Notes

**Definition of Done:**
- ✅ CHANGELOG vollständig
- ✅ Release Notes geschrieben

---

## Sprint-Planung (Beispiel)

### Sprint 1: Foundation (3 Wochen)
- ACC-001: Repository Setup
- ACC-002: Testing-Infrastruktur
- ACC-003: TypeScript Definitions
- ACC-010: NumberTree
- ACC-011: RoleMapManager

**Velocity:** ~20 SP

---

### Sprint 2: Core (4 Wochen)
- ACC-012: MarkInfoHandler
- ACC-013: StructureTreeManager
- ACC-020: TextWrapper (Start)

**Velocity:** ~25 SP

---

### Sprint 3: Integration (3 Wochen)
- ACC-020: TextWrapper (Fertig)
- ACC-021: ImageWrapper
- ACC-022: PageWrapper
- ACC-023: Plugin Entry Point

**Velocity:** ~20 SP

---

### Sprint 4: Validation (3 Wochen)
- ACC-030: PDF/UA-1 Validator
- ACC-031: WCAG Validator
- ACC-032: PAC Integration

**Velocity:** ~18 SP

---

### Sprint 5: Examples & Docs (3 Wochen)
- ACC-040: Basic Examples
- ACC-041: Advanced Examples
- ACC-042: API Documentation
- ACC-043: Migration Guide

**Velocity:** ~16 SP

---

### Sprint 6: Upstream Prep (2 Wochen)
- ACC-050: Guidelines analysieren
- ACC-051: Code-Style Anpassung
- ACC-052: Version Kompatibilität
- ACC-053: PR vorbereiten

**Velocity:** ~15 SP

---

### Sprint 7: Polish (2 Wochen)
- ACC-060: Performance
- ACC-061: Bundle Size
- ACC-062: Error Handling
- ACC-063: README
- ACC-064: Release Notes

**Velocity:** ~17 SP

---

## Gesamt-Übersicht

**Geschätzte Gesamtdauer:** 20 Wochen (5 Monate)
**Geschätzte Story Points:** 131 SP (~65 Personentage)
**Team-Größe:** 1 Person (Vollzeit)

**Meilensteine:**
- [ ] M1: Foundation Complete (Woche 3)
- [ ] M2: Core Implementation Complete (Woche 7)
- [ ] M3: Integration Complete (Woche 10)
- [ ] M4: Validation Complete (Woche 13)
- [ ] M5: Documentation Complete (Woche 16)
- [ ] M6: Upstream-Ready (Woche 18)
- [ ] M7: Release v1.0.0 (Woche 20)

---

**Version:** 1.0.0
**Status:** ✅ Core-Features implementiert und in AccNotes integriert (Februar 2026)
**Fork-Repository:** `../jsPDF-UA/`
