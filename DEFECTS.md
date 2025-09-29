# 🐛 AccNotes - Bekannte Defekte

Diese Datei dokumentiert bekannte Bugs und Probleme in der AccNotes Extension.

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

### DEF-002: Kontextmenü-Initialisierung beim ersten Aufruf (ursprünglich Bug #1 im Backlog)
**Beschreibung:** Beim ersten Rechtsklick auf ein Element mit erkannten Problemen werden die dynamischen Kontextmenü-Einträge manchmal nicht korrekt geladen. Das Problem kann zuverlässig mit den Testseiten nachgestellt werden.

**Reproduktion:**
1. Öffne `docs/test/test-button-labels.html` oder `docs/test/test-button-types.html`
2. Führe ersten Rechtsklick auf problematisches Element aus (z.B. 🔍 Button)
3. Kontextmenü zeigt möglicherweise nur Standard-Einträge statt problem-spezifische
4. Zweiter Rechtsklick funktioniert meist korrekt

**Vermutete Ursache:** Race-Condition zwischen Problem-Erkennung und Kontextmenü-Erstellung in `background.js:createDynamicContextMenu()`

**Betroffene Dateien:**
- `background.js` (createDynamicContextMenu Funktion)
- `content.js` (Element-Info-Übertragung)
- `scripts/barrier-detector.js` (Problem-Erkennung)

**Lösungsansätze:**
- Timing/Synchronisation in `background.js` verbessern
- Retry-Mechanismus für Element-Info-Abruf implementieren
- Loading-State für Kontextmenü-Erstellung hinzufügen
- Debug-Logging für Race-Condition-Analyse erweitern

**Priorität:** Medium (ursprünglich im Backlog als identifiziert)
**Erstmals gemeldet:** 28.09.2024 (Backlog)
**Aktualisiert:** 2025-09-29

---

## Status: Zur Bearbeitung vorgemerkt

Diese Defekte werden in einem späteren Sprint bearbeitet.

**Hinweis:** DEF-002 war ursprünglich als "Bug #1" im Product Backlog dokumentiert und wurde zur besseren Übersichtlichkeit hierher verschoben.

---

## Testumgebung

**Browser:** Chrome/Firefox/Edge
**Extension Version:** v0.5.0
**Test-Dateien:** `docs/test/`