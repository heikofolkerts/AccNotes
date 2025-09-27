# 🧪 AccNotes Test-Dateien für Barriere-Erkennung

Diese Test-Dateien ermöglichen es, die automatische Barriere-Erkennung (Item #4, Phase 1) systematisch zu testen.

## 📁 Test-Dateien

| Datei | Testet | BITV-Referenz |
|-------|--------|---------------|
| `test-alt-text.html` | Fehlende Alt-Texte bei Bildern | BITV 1.1.1 - Nicht-Text-Inhalte |
| `test-button-labels.html` | Buttons ohne zugängliche Namen | BITV 2.4.6 - Überschriften und Beschriftungen |
| `test-form-labels.html` | Formularfelder ohne Labels | BITV 3.3.2 - Beschriftungen oder Anweisungen |
| `test-contrast.html` | Schlechte Farbkontraste | BITV 1.4.3 - Kontrast (Minimum) |
| `test-headings.html` | Fehlerhafte Überschriften-Struktur | BITV 1.3.1 - Info und Beziehungen |

## 🔍 Wie testen?

### 1. Extension laden
- Öffne Chrome/Firefox
- Lade die AccNotes Extension (Developer Mode)

### 2. Test-Dateien öffnen
```bash
# Im Browser öffnen:
file:///[PFAD]/AccNotes/docs/test/test-alt-text.html
file:///[PFAD]/AccNotes/docs/test/test-button-labels.html
# ... usw.
```

### 3. Barrieren testen
1. **Rechtsklick** auf Elemente im ❌ **PROBLEME**-Bereich
2. Wähle **"Note zu diesem Element hinzufügen"**
3. Prüfe, ob automatisch Probleme erkannt werden
4. Teste auch ✅ **KORREKT**-Bereich (sollte KEINE Probleme finden)

## ✅ Erwartete Erkennungen

### Alt-Text-Probleme
- ❌ Bilder ohne `alt`-Attribut
- ❌ Funktionale Bilder mit leerem `alt`
- ❌ Image-Buttons ohne zugänglichen Namen
- ✅ Korrekte Alt-Texte ignorieren
- ✅ Dekorative Bilder (leeres `alt` + `role="presentation"`) ignorieren

### Button-Label-Probleme
- ❌ Icon-Buttons nur mit Unicode-Symbolen
- ❌ Buttons mit nur CSS-Icons
- ❌ Leere Buttons
- ✅ Buttons mit Text ignorieren
- ✅ Buttons mit `aria-label` ignorieren

### Formular-Label-Probleme
- ❌ Input-Felder ohne `<label>`
- ❌ Select/Textarea ohne Labels
- ❌ Checkboxes/Radio-Buttons ohne Labels
- ✅ Korrekte `for`-Zuordnungen ignorieren
- ✅ `aria-label`/`aria-labelledby` ignorieren

### Kontrast-Probleme
- ❌ Text-Hintergrund-Kombinationen < 4.5:1 (normal)
- ❌ Großer Text < 3:1
- ✅ Ausreichende Kontraste ignorieren

### Überschriften-Struktur-Probleme
- ❌ Übersprungene Heading-Level (H2 → H4)
- ❌ Mehrere H1 auf einer Seite
- ❌ Rückwärts-Sprünge (H6 → H2)
- ✅ Korrekte Hierarchie ignorieren

## 🐛 Problem-Reporting

Falls die Erkennung nicht funktioniert:

1. **Browser-Konsole** öffnen (F12)
2. **Fehlermeldungen** dokumentieren
3. **Element inspizieren** (Rechtsklick → "Untersuchen")
4. **Erwartetes vs. Tatsächliches Verhalten** notieren

## 📊 Test-Matrix

| Test-Szenario | Chrome | Firefox | Edge | Notizen |
|---------------|--------|---------|------|---------|
| Alt-Text-Erkennung | ⏳ | ⏳ | ⏳ | |
| Button-Label-Erkennung | ⏳ | ⏳ | ⏳ | |
| Form-Label-Erkennung | ⏳ | ⏳ | ⏳ | |
| Kontrast-Checker | ⏳ | ⏳ | ⏳ | |
| Überschriften-Struktur | ⏳ | ⏳ | ⏳ | |

**Legende:** ✅ Funktioniert | ❌ Fehler | ⏳ Noch nicht getestet

---

*Diese Test-Dateien entsprechen den 5 Erkennungsalgorithmen aus `scripts/barrier-detector.js`*