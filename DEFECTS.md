# 🐛 AccNotes - Bekannte Defekte

Diese Datei dokumentiert bekannte Bugs und Probleme in der AccNotes Extension.

## Status: Geschlossen

### DEF-002: Kontextmenü-Initialisierung beim ersten Aufruf ✅ BEHOBEN
**Beschreibung:** Beim ersten Rechtsklick auf ein Element mit erkannten Problemen wurden die dynamischen Kontextmenü-Einträge manchmal nicht korrekt geladen. Das Problem konnte zuverlässig mit den Testseiten nachgestellt werden.

**Reproduktion:**
1. Öffne `docs/test/test-button-labels.html` oder `docs/test/test-button-types.html`
2. Führe ersten Rechtsklick auf problematisches Element aus (z.B. 🔍 Button)
3. Kontextmenü zeigt möglicherweise nur Standard-Einträge statt problem-spezifische
4. Zweiter Rechtsklick funktioniert meist korrekt

**Root Cause:** Race-Condition zwischen Problem-Erkennung und Kontextmenü-Erstellung. Das Kontextmenü wurde vom Browser gerendert, bevor die asynchrone `removeAll()` Operation und neue Menü-Item-Erstellung abgeschlossen waren.

**Betroffene Dateien:**
- `background.js` (createDynamicContextMenu Funktion)
- `content.js` (Element-Info-Übertragung)
- `scripts/barrier-detector.js` (Problem-Erkennung)

**Implementierte Lösung:**
- ✅ Proaktive Menü-Vorbereitung bei `mouseover` Events (throttled 300ms)
- ✅ Proaktive Menü-Vorbereitung bei `focusin` Events (wichtig für Tastatur-Navigation)
- ✅ Element-Analyse-Cache (`lastAnalyzedElement`, `lastAnalysisResult`)
- ✅ Menü-State-Cache in `background.js` zur Vermeidung unnötiger `removeAll()` Aufrufe
- ✅ Inkrementelles Menü-Update nur bei Zustandsänderung

**Geänderte Dateien:**
- `content.js`: Zeilen 4-5, 27-69, 72-130 (Cache + proaktive Vorbereitung)
- `background.js`: Zeilen 10, 44-59 (Menü-State-Cache)

**Priorität:** Medium (ursprünglich im Backlog als identifiziert)
**Erstmals gemeldet:** 28.09.2024 (Backlog)
**Behoben:** 2025-09-30
**Verifiziert:** Manueller Test mit `test-button-types.html` erfolgreich

---

## Status: Offen

### DEF-001: Button-Typ-Erkennung instabil in test-button-types.html
**Beschreibung:** In der Datei `docs/test/test-button-types.html` werden Button-Typen nicht korrekt erkannt, oder die Navigation per Tab und Screenreader funktioniert nicht stabil.

**Reproduktion:**
1. Öffne `docs/test/test-button-types.html`
2. Navigiere mit Tab durch die Buttons
3. Verwende Screenreader für Zugänglichkeit
4. Beobachte instabile Button-Typ-Klassifikation

**Betroffene Dateien:**
- `docs/test/test-button-types.html`
- `scripts/barrier-detector.js` (identifyButtonType Funktion)
- `content.js` (getElementType Funktion)

**Priorität:** Medium
**Erstellt:** 2025-09-29

---

## Status: Zur Bearbeitung vorgemerkt

Diese Defekte werden in einem späteren Sprint bearbeitet.

---

## Testumgebung

**Browser:** Chrome/Firefox/Edge
**Extension Version:** v0.5.0
**Test-Dateien:** `docs/test/`