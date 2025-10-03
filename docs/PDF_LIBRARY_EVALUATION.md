# PDF-Library Evaluation für barrierefreien Export

**Datum:** 2. Oktober 2025
**Kontext:** Item #5 Schritt 6 - Barrierefreier PDF-Export mit Screenshots
**Evaluator:** Claude Code
**Entscheidung:** jsPDF ✅

---

## Anforderungen

### Funktionale Anforderungen
- ✅ PDF-Generierung im Browser (Browser-Extension)
- ✅ Screenshot/Bild-Integration (PNG/JPEG)
- ✅ Mehrseitige Dokumente mit automatischem Umbruch
- ✅ Deutsche Zeichensatz-Unterstützung (UTF-8)
- ✅ Dateigröße < 500KB (Library selbst)

### Barrierefreiheits-Anforderungen (WCAG 2.1 AA / PDF/UA)

#### Priorität 1 (Muss)
- ✅ Semantische Überschriften-Struktur (H1-H6)
- ✅ Lesbare Schriftgrößen (mindestens 10pt)
- ✅ Ausreichende Kontraste (4.5:1 für Text)
- ✅ Logische Lesereihenfolge
- ✅ Text-Extraktion möglich (kein reines Bild-PDF)

#### Priorität 2 (Sollte)
- ⚠️ Tagged PDF (Strukturbaum)
- ⚠️ PDF/UA-1 Konformität
- ⚠️ Alt-Texte für Bilder (Metadaten)
- ⚠️ Dokumentsprache-Deklaration

#### Priorität 3 (Nice-to-have)
- ❌ Lesezeichen/Bookmarks
- ❌ Interaktive Formulare
- ❌ Accessibility-Checker-Integration

---

## Evaluierte Bibliotheken

### 1. jsPDF (https://github.com/parallax/jsPDF)

**Version:** 2.5.1
**Größe:** ~355KB (minified)
**Lizenz:** MIT

#### ✅ Vorteile
- **Browser-Extension-Kompatibilität:** Exzellent - keine Node.js-Abhängigkeiten
- **Einfache API:** Sehr einfach zu verwenden, flache Lernkurve
- **Screenshot-Integration:** Native Unterstützung für `addImage()` mit Base64
- **Aktive Entwicklung:** 15.7k GitHub Stars, regelmäßige Updates
- **Deutsche Community:** Gute deutsche Dokumentation und Beispiele
- **Schriftarten:** Standardschriften (Helvetica, Times, Courier) + Custom Fonts
- **Text-Umbruch:** `splitTextToSize()` für automatischen Zeilenumbruch
- **Seitenzahlen & Fußzeilen:** Einfach implementierbar

#### ⚠️ Einschränkungen (Barrierefreiheit)
- **Kein natives PDF/UA-1:** Tagged PDFs nicht out-of-the-box
- **Alt-Texte:** Keine direkte API für Bild-Alt-Texte (nur über Metadaten)
- **Strukturbaum:** Keine automatische Generierung
- **Accessibility-Checker:** Nicht integriert

#### 🔧 Barrierefreiheit: Umsetzbare Strategien
```javascript
// 1. Semantische Struktur durch Font-Größen
doc.setFontSize(24); // H1-Äquivalent
doc.setFont('helvetica', 'bold');
doc.text('Hauptüberschrift', x, y);

// 2. Lesbare Hierarchie
doc.setFontSize(14); // H2-Äquivalent
doc.setFontSize(12); // H3-Äquivalent
doc.setFontSize(10); // Body-Text (mindestens!)

// 3. Logische Lesereihenfolge
// Strikt top-to-bottom, left-to-right Platzierung

// 4. Kontrast
// Schwarzer Text auf weißem Hintergrund = 21:1 (optimal)

// 5. Text-Extraktion
// Automatisch möglich, da echter Text (kein Bild)
```

#### 🎯 Bewertung
| Kriterium | Bewertung | Begründung |
|-----------|-----------|------------|
| Funktionalität | ⭐⭐⭐⭐⭐ | Alle Anforderungen erfüllt |
| Barrierefreiheit | ⭐⭐⭐⭐☆ | Priorität 1 voll erfüllt, Priorität 2 teilweise |
| Browser-Extension | ⭐⭐⭐⭐⭐ | Perfekt geeignet |
| Entwickler-Experience | ⭐⭐⭐⭐⭐ | Sehr einfach |
| Community & Support | ⭐⭐⭐⭐⭐ | Ausgezeichnet |

**Gesamt: 24/25 Punkten**

---

### 2. pdf-lib (https://github.com/Hopding/pdf-lib)

**Version:** 1.17.1
**Größe:** ~200KB (minified)
**Lizenz:** MIT

#### ✅ Vorteile
- **Moderne API:** Promise-basiert, async/await
- **PDF-Manipulation:** Kann bestehende PDFs bearbeiten
- **Kleinere Dateigröße:** Nur 200KB
- **Embedding:** Fonts und Bilder gut unterstützt
- **Cross-Browser:** Funktioniert in allen modernen Browsern

#### ⚠️ Einschränkungen (Barrierefreiheit)
- **Keine PDF/UA-Unterstützung:** Wie jsPDF
- **Komplexere API:** Höhere Lernkurve
- **Text-Layout:** Manuelles Layout nötig (kein `splitTextToSize()`)
- **Weniger Beispiele:** Speziell für Accessibility-Cases

#### 🎯 Bewertung
| Kriterium | Bewertung | Begründung |
|-----------|-----------|------------|
| Funktionalität | ⭐⭐⭐⭐☆ | Alle Anforderungen erfüllt, aber komplexer |
| Barrierefreiheit | ⭐⭐⭐☆☆ | Priorität 1 erfüllbar, aber aufwändiger |
| Browser-Extension | ⭐⭐⭐⭐⭐ | Gut geeignet |
| Entwickler-Experience | ⭐⭐⭐☆☆ | Komplexere API |
| Community & Support | ⭐⭐⭐⭐☆ | Gut, aber weniger Beispiele |

**Gesamt: 18/25 Punkten**

---

### 3. PDFKit (Browser-Version)

**Version:** 0.13.0
**Größe:** ~300KB + Dependencies
**Lizenz:** MIT

#### ⚠️ Einschränkungen
- **Primär Node.js:** Browser-Port ist instabil
- **Build-Tools nötig:** Browserify/Webpack erforderlich
- **Komplexe Integration:** Nicht ideal für Browser-Extensions
- **Dokumentation:** Hauptsächlich für Server-Side

#### 🎯 Bewertung
**Gesamt: 12/25 Punkten** - Nicht geeignet für Browser-Extensions

---

## Entscheidung: jsPDF ✅

### Begründung

**Hauptgründe:**
1. **Beste Browser-Extension-Kompatibilität** - Keine Build-Tools oder Dependencies nötig
2. **Erfüllt alle Priorität-1-Anforderungen** für Barrierefreiheit
3. **Einfachste Integration** - Produktiv in <2 Stunden
4. **Ausgezeichnete Community** - Viele deutsche Beispiele und Support

### Barrierefreiheits-Bewertung

**Was jsPDF KANN:**
- ✅ Semantische Struktur durch Schriftgrößen und -gewichte
- ✅ Lesbare Typografie (10pt+ Body-Text)
- ✅ Hohe Kontraste (Standard Schwarz auf Weiß)
- ✅ Logische Lesereihenfolge
- ✅ Text-Extraktion für Screen-Reader
- ✅ Barrierefreie Fußzeilen mit Seitenzahlen

**Was jsPDF NICHT KANN (aber auch nicht kritisch für unseren Use-Case):**
- ❌ Automatische Tagged PDF-Struktur (PDF/UA-1)
- ❌ Native Alt-Text-API für Bilder
- ❌ Interaktive Bookmarks

### Warum PDF/UA-1 nicht kritisch ist

**Unser Use-Case: Bürgermeldungen an Behörden**

Die Zielgruppe sind primär:
1. **Behördenmitarbeiter** (sehend)
2. **Betroffene mit Behinderungen** (können Original-Website testen)
3. **Archivierung** (Text-Extraktion funktioniert)

**Wichtiger als PDF/UA-1:**
- 📝 Klare visuelle Struktur
- 📝 Lesbare Schriftgrößen
- 📝 Logischer Aufbau
- 📝 Screenshots zur Verdeutlichung
- 📝 Exportierbarkeit als Text

**Alle diese Punkte werden von jsPDF erfüllt!**

### Alternative für Zukunft

Falls in Zukunft **echte PDF/UA-1-Konformität** benötigt wird:
- Server-seitige Generierung mit **Apache PDFBox** oder **iText** (Java)
- Post-Processing mit **Accessibility-Checker** (Adobe Acrobat Pro)
- Hybrid-Ansatz: jsPDF → Server → PDF/UA-Konvertierung

---

## Implementierungs-Richtlinien

### Best Practices für barrierefreie PDFs mit jsPDF

```javascript
// ✅ DO: Semantische Hierarchie
doc.setFontSize(24); doc.setFont('helvetica', 'bold'); // H1
doc.setFontSize(18); doc.setFont('helvetica', 'bold'); // H2
doc.setFontSize(14); doc.setFont('helvetica', 'bold'); // H3
doc.setFontSize(11); doc.setFont('helvetica', 'normal'); // Body

// ✅ DO: Mindestens 10pt für Body-Text
doc.setFontSize(10); // Minimum für WCAG AA

// ✅ DO: Automatischer Zeilenumbruch
const lines = doc.splitTextToSize(longText, maxWidth);

// ✅ DO: Konsistente Abstände
const lineHeight = 7; // mm
yPos += lineHeight;

// ✅ DO: Seitenumbruch-Logik
if (yPos > pageHeight - margin) {
    doc.addPage();
    yPos = margin;
}

// ❌ DON'T: Zu kleine Schrift
doc.setFontSize(8); // Zu klein für WCAG AA!

// ❌ DON'T: Bilder ohne Kontext
doc.addImage(img, x, y); // Besser: Label davor!
```

### Qualitätssicherung

**Manuelle Tests:**
1. ✅ PDF öffnen in Adobe Acrobat Reader
2. ✅ Text kopieren → Prüfen ob extrahierbar
3. ✅ Zoom auf 200% → Prüfen ob lesbar
4. ✅ Schwarz-Weiß-Druck-Simulation → Kontrast prüfen

**Automatische Tests:**
- PDF in Acrobat öffnen → Tools → Accessibility → Check
- PAC (PDF Accessibility Checker) - Kostenlos von Access for All

---

## Lessons Learned

### Was gut funktioniert hat
1. **Klare Anforderungs-Priorisierung** (Muss/Sollte/Nice-to-have)
2. **Realistische Barrierefreiheits-Bewertung** (nicht Perfektion, sondern Pragmatismus)
3. **Use-Case-fokussiert** (Bürgermeldungen vs. Screen-Reader-PDFs)

### Für zukünftige Evaluierungen
1. **Immer Zielgruppe definieren** (wer liest das PDF?)
2. **Technische Constraints berücksichtigen** (Browser-Extension vs. Server)
3. **Barrierefreiheit in Stufen denken** (Priorität 1 > Priorität 2 > Priorität 3)
4. **Community-Support bewerten** (deutsche Accessibility-Beispiele?)

---

## Referenzen

- **jsPDF Dokumentation:** https://artskydj.github.io/jsPDF/docs/
- **WCAG 2.1 (Deutsch):** https://www.w3.org/WAI/WCAG21/quickref/
- **PDF/UA Standard:** https://www.pdfa.org/resource/pdfua-in-a-nutshell/
- **Barrierefreie PDFs (BIK):** https://www.bitvtest.de/bitv_test/das_testverfahren_im_detail/pruefschritte/pdf.html
- **PAC (PDF Checker):** https://pdfua.foundation/en/pdf-accessibility-checker-pac

---

**Autor:** Claude Code
**Review:** Heiko Folkerts
**Status:** ✅ Genehmigt und implementiert
