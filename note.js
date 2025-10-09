// URL-Parameter auslesen
const urlParams = new URLSearchParams(window.location.search);
const contextDataStr = urlParams.get('contextData');
const editNoteId = urlParams.get('id'); // Zum Bearbeiten einer bestehenden Notiz

let contextData = {};
let existingNote = null; // Speichert die zu bearbeitende Notiz

try {
    contextData = JSON.parse(contextDataStr) || {};
} catch (e) {
    console.error('Fehler beim Parsen der Kontextdaten:', e);
}

// Modus-Verwaltung: Simplified vs. Detailed
let currentMode = 'detailed'; // default

// Prüfe reportType aus contextData
if (contextData.reportType === 'quick-citizen' || contextData.reportType === 'quick-problem') {
    currentMode = 'simplified';
}

// Funktion zum sicheren Setzen von Werten
function setValue(elementId, value, defaultValue = '-') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || defaultValue;
    }
}

// Screenshot vom ursprünglichen Tab anfordern
async function requestScreenshotFromTab(tabId, selector) {
    return new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, {
            action: 'captureElementScreenshot',
            selector: selector,
            options: {
                highlight: true,
                padding: 20,
                maxWidth: 800,
                maxHeight: 600
            }
        }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Screenshot request failed:', chrome.runtime.lastError);
                resolve({
                    success: false,
                    error: chrome.runtime.lastError.message
                });
            } else {
                resolve(response || { success: false, error: 'No response from tab' });
            }
        });
    });
}

// Seiten-Informationen
setValue('page-url', contextData.url);
setValue('page-title', contextData.pageTitle);
setValue('selected-text', contextData.selectedText);

// Element-Informationen
setValue('element-type', contextData.elementType);
setValue('tag-name', contextData.tagName);
setValue('element-text', contextData.text);
setValue('element-id', contextData.id);
setValue('element-class', contextData.className);

// Barrierefreiheit (ARIA)
setValue('accessible-name', contextData.accessibleName);
setValue('accessible-description', contextData.accessibleDescription);
setValue('aria-label', contextData.ariaLabel);
setValue('aria-role', contextData.ariaRole);
setValue('aria-hidden', contextData.ariaHidden);
setValue('aria-expanded', contextData.ariaExpanded);
setValue('aria-pressed', contextData.ariaPressed);
setValue('aria-checked', contextData.ariaChecked);
setValue('aria-disabled', contextData.ariaDisabled);
setValue('aria-required', contextData.ariaRequired);

// Interaktion & Fokus
setValue('is-interactive', contextData.isInteractive ? 'Ja' : 'Nein');
setValue('is-focusable', contextData.isFocusable ? 'Ja' : 'Nein');
setValue('tab-index', contextData.tabIndex);
setValue('disabled', contextData.disabled ? 'Ja' : 'Nein');

// Link-Informationen
setValue('link-url', contextData.href);
setValue('link-target', contextData.target);

// Formular-Informationen
setValue('form-name', contextData.name);
setValue('form-type', contextData.type);
setValue('form-value', contextData.value);
setValue('placeholder', contextData.placeholder);
setValue('required', contextData.required ? 'Ja' : 'Nein');

// Technische Details
setValue('css-selector', contextData.selector);
setValue('xpath', contextData.xpath);

// Vorgefüllte Notiz mit Kontext-Informationen
const noteContent = document.getElementById('note-content');
let prefillText = `Barrierefreiheits-Notiz vom ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE')}\n\n`;

prefillText += `=== ELEMENT-INFORMATIONEN ===\n`;
prefillText += `Seite: ${contextData.pageTitle || 'Unbekannt'}\n`;
prefillText += `URL: ${contextData.url || 'Unbekannt'}\n`;
prefillText += `Element: ${contextData.elementType || 'Unbekannt'} (${contextData.tagName || 'unbekannt'})\n`;

if (contextData.text) {
    prefillText += `Text/Inhalt: "${contextData.text}"\n`;
}

if (contextData.accessibleName) {
    prefillText += `Zugänglicher Name: "${contextData.accessibleName}"\n`;
}

if (contextData.id) {
    prefillText += `ID: ${contextData.id}\n`;
}

if (contextData.ariaRole) {
    prefillText += `ARIA-Role: ${contextData.ariaRole}\n`;
}

if (contextData.ariaLabel) {
    prefillText += `ARIA-Label: "${contextData.ariaLabel}"\n`;
}

prefillText += `Interaktiv: ${contextData.isInteractive ? 'Ja' : 'Nein'}\n`;
prefillText += `Fokussierbar: ${contextData.isFocusable ? 'Ja' : 'Nein'}\n`;

if (contextData.selectedText) {
    prefillText += `Ausgewählter Text: "${contextData.selectedText}"\n`;
}

// Automatisch erkannte Probleme hinzufügen
if (contextData.detectedProblems && contextData.detectedProblems.length > 0) {
    prefillText += `\n=== AUTOMATISCH ERKANNTE PROBLEME ===\n`;
    contextData.detectedProblems.forEach((problem, index) => {
        prefillText += `${index + 1}. ${problem.title}\n`;
        prefillText += `   Problem: ${problem.description}\n`;
        if (problem.solution) {
            prefillText += `   Empfehlung: ${problem.solution}\n`;
        }
        if (problem.bitvReference) {
            prefillText += `   BITV-Bezug: ${problem.bitvReference}\n`;
        }
        prefillText += `   Schweregrad: ${problem.severity}\n\n`;
    });
}

prefillText += `\n=== BARRIEREFREIHEITS-NOTIZ ===\n`;

// Bei erkannten Problemen automatisch das erste Problem als Basis nehmen
if (contextData.detectedProblems && contextData.detectedProblems.length > 0) {
    const firstProblem = contextData.detectedProblems[0];
    prefillText += `Problem/Beobachtung:\n${firstProblem.description}\n\n`;
    prefillText += `Empfehlung:\n${firstProblem.solution || 'Siehe automatisch erkanntes Problem oben'}\n\n`;
    prefillText += `BITV-Kriterium:\n${firstProblem.bitvReference || 'Siehe automatisch erkanntes Problem oben'}\n\n`;
} else {
    prefillText += `Problem/Beobachtung:\n\n`;
    prefillText += `Empfehlung:\n\n`;
    prefillText += `WCAG-Kriterium:\n\n`;
}

// Setze Inhalt basierend auf Modus
if (currentMode === 'simplified') {
    // Vereinfachter Modus: Kürze die Vor-Ausfüllung
    prefillSimplifiedMode();
} else {
    // Detaillierter Modus: Vollständige Vor-Ausfüllung
    noteContent.value = prefillText;
    noteContent.focus();
    noteContent.setSelectionRange(prefillText.length, prefillText.length);
}

// BITV integration
let currentBitvStep = null;
let currentEvaluation = null;

// Funktion für vereinfachten Modus
function prefillSimplifiedMode() {
    console.log('🚀 Activating simplified citizen report mode...');

    // Zeige vereinfachte Sektion, verstecke BITV-Sektion
    document.getElementById('simplified-mode-section').style.display = 'block';
    document.getElementById('bitv-mode-section').style.display = 'none';

    // Fülle Problem-Informationen aus
    // WICHTIG: Manuelle Berichte sollen NICHT vorausgefüllt werden
    if (contextData.manualReport) {
        // Manueller Bericht: Zeige nur Platzhalter, keine Vor-Ausfüllung
        document.getElementById('detected-problem-title').textContent = 'Anderes Problem melden';
        document.getElementById('detected-problem-description').textContent =
            'Beschreiben Sie bitte das Problem, das Sie gefunden haben, in Ihren eigenen Worten.';

        document.getElementById('note-title').value = '';  // LEER für manuelle Eingabe
        noteContent.value = '';  // LEER für manuelle Eingabe

    } else if (contextData.detectedProblems && contextData.detectedProblems.length > 0) {
        const firstProblem = contextData.detectedProblems[0];

        document.getElementById('detected-problem-title').textContent = firstProblem.title || 'Barrierefreiheits-Problem';
        document.getElementById('detected-problem-description').textContent =
            firstProblem.description || 'Es wurde ein Problem mit der Barrierefreiheit erkannt.';

        // Setze einfachen Titel
        document.getElementById('note-title').value = firstProblem.title || 'Problem gemeldet';

        // Setze einfache Beschreibung
        const simpleContent = `Problem: ${firstProblem.title}\n\n` +
                             `Beschreibung:\n${firstProblem.description}\n\n` +
                             `Empfehlung:\n${firstProblem.solution || 'Bitte beheben Sie dieses Problem.'}\n`;
        noteContent.value = simpleContent;

    } else if (contextData.primaryProblem) {
        // Verwende primaryProblem wenn vorhanden (von quick-problem-report)
        const problem = contextData.primaryProblem;

        document.getElementById('detected-problem-title').textContent = problem.title || 'Barrierefreiheits-Problem';
        document.getElementById('detected-problem-description').textContent =
            problem.description || 'Es wurde ein Problem mit der Barrierefreiheit erkannt.';

        document.getElementById('note-title').value = problem.title || 'Problem gemeldet';

        const simpleContent = `Problem: ${problem.title}\n\n` +
                             `Beschreibung:\n${problem.description}\n\n` +
                             `Empfehlung:\n${problem.recommendation || problem.solution || 'Bitte beheben Sie dieses Problem.'}\n`;
        noteContent.value = simpleContent;
    } else {
        // Kein Problem erkannt - generische Meldung
        document.getElementById('detected-problem-title').textContent = 'Barrierefreiheits-Problem';
        document.getElementById('detected-problem-description').textContent =
            'Beschreiben Sie bitte das Problem in Ihren eigenen Worten im Textfeld unten.';

        document.getElementById('note-title').value = 'Barrierefreiheits-Problem gemeldet';
        noteContent.value = 'Problem:\n\n\nWas sollte verbessert werden:\n\n';
    }

    // Fülle Standort-Informationen aus
    document.getElementById('simple-page-url').textContent = contextData.url || 'Unbekannt';
    document.getElementById('simple-page-title').textContent = contextData.pageTitle || 'Unbekannt';
    document.getElementById('simple-element-type').textContent = contextData.elementType || 'Unbekannt';

    // Fokussiere Textarea
    noteContent.focus();
}

// Funktion zum Wechsel zwischen Modi
function switchToDetailedMode() {
    console.log('📋 Switching to detailed BITV mode...');
    currentMode = 'detailed';

    document.getElementById('simplified-mode-section').style.display = 'none';
    document.getElementById('bitv-mode-section').style.display = 'block';

    // Initialisiere BITV UI falls noch nicht geschehen
    if (!currentBitvStep) {
        initializeBitvUI();
    }
}

function switchToSimplifiedMode() {
    console.log('🚀 Switching to simplified citizen mode...');
    currentMode = 'simplified';

    document.getElementById('simplified-mode-section').style.display = 'block';
    document.getElementById('bitv-mode-section').style.display = 'none';
}

// Initialize BITV UI
function initializeBitvUI() {
    const categorySelect = document.getElementById('bitv-category');
    const stepSelect = document.getElementById('bitv-step');
    const stepDetails = document.getElementById('bitv-step-details');
    const evaluationGroup = document.getElementById('evaluation-group');

    // Populate categories
    const categories = BitvCatalog.getCategories();
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.title;
        categorySelect.appendChild(option);
    });

    // Category change handler
    categorySelect.addEventListener('change', function() {
        const categoryId = this.value;
        stepSelect.innerHTML = '<option value="">-- Prüfschritt wählen --</option>';
        stepSelect.disabled = !categoryId;
        stepDetails.style.display = 'none';
        evaluationGroup.style.display = 'none';
        currentBitvStep = null;

        if (categoryId) {
            const steps = BitvCatalog.getStepsByCategory(categoryId);
            steps.forEach(step => {
                const option = document.createElement('option');
                option.value = step.id;
                option.textContent = `${step.id} - ${step.title}`;
                stepSelect.appendChild(option);
            });
        }
    });

    // Step change handler
    stepSelect.addEventListener('change', function() {
        const stepId = this.value;

        if (stepId) {
            currentBitvStep = BitvCatalog.getStep(stepId);
            if (currentBitvStep) {
                // Show step details
                document.getElementById('step-title').textContent = currentBitvStep.title;
                document.getElementById('step-description').textContent = currentBitvStep.description;
                document.getElementById('step-level').textContent = `WCAG ${currentBitvStep.level}`;
                stepDetails.style.display = 'block';
                evaluationGroup.style.display = 'block';

                // Pre-fill note title if empty
                const noteTitle = document.getElementById('note-title');
                if (!noteTitle.value.trim()) {
                    noteTitle.value = `${stepId}: ${currentBitvStep.title}`;
                }
            }
        } else {
            stepDetails.style.display = 'none';
            evaluationGroup.style.display = 'none';
            currentBitvStep = null;
        }
    });

    // Evaluation change handler
    const evaluationInputs = document.querySelectorAll('input[name="evaluation"]');
    evaluationInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                currentEvaluation = this.value;
            }
        });
    });

    // === PHASE 3: AUTOMATISCHE BITV-PRÜFSCHRITT-VORSCHLÄGE ===
    autoSuggestBitvStep();
}

// Funktion für automatische BITV-Prüfschritt-Vorschläge basierend auf erkannten Problemen
function autoSuggestBitvStep() {
    console.log('🤖 Phase 3: Analyzing problems for BITV step suggestions...');

    if (!contextData.detectedProblems || contextData.detectedProblems.length === 0) {
        console.log('📋 No detected problems - using manual BITV selection');
        return;
    }

    // Debug: Zeige verfügbare Problem-Types
    console.log('🔍 Phase 3: Available problem types:', contextData.detectedProblems.map(p => p.type));

    // Problem-zu-BITV-Mapping für automatische Vorschläge
    // WICHTIG: Verwende die korrekten Problem-Types aus barrier-detector.js
    const problemToBitvMapping = {
        'MISSING_ALT_TEXT': {
            categoryId: 'wahrnehmbarkeit',
            stepId: '1.1.1',
            title: 'Nicht-Text-Inhalte',
            confidence: 'high'
        },
        'MISSING_BUTTON_LABEL': {
            categoryId: 'bedienbarkeit',
            stepId: '2.4.4',
            title: 'Linkzweck (im Kontext)',
            confidence: 'high'
        },
        'MISSING_FORM_LABEL': {
            categoryId: 'verständlichkeit',
            stepId: '3.3.2',
            title: 'Beschriftungen oder Anweisungen',
            confidence: 'high'
        },
        'POOR_CONTRAST': {
            categoryId: 'wahrnehmbarkeit',
            stepId: '1.4.3',
            title: 'Kontrast (Minimum)',
            confidence: 'high'
        },
        'HEADING_STRUCTURE_ISSUE': {
            categoryId: 'wahrnehmbarkeit',
            stepId: '1.3.1',
            title: 'Info und Beziehungen',
            confidence: 'medium'
        }
    };

    // Finde das erste Problem mit hoher Konfidenz
    let suggestedStep = null;
    let problemUsed = null;

    for (const problem of contextData.detectedProblems) {
        const mapping = problemToBitvMapping[problem.type];
        if (mapping && mapping.confidence === 'high') {
            suggestedStep = mapping;
            problemUsed = problem;
            break;
        }
    }

    // Fallback: Verwende erstes verfügbares Mapping
    if (!suggestedStep) {
        for (const problem of contextData.detectedProblems) {
            const mapping = problemToBitvMapping[problem.type];
            if (mapping) {
                suggestedStep = mapping;
                problemUsed = problem;
                break;
            }
        }
    }

    if (suggestedStep) {
        console.log(`✅ Phase 3: Auto-suggesting BITV step ${suggestedStep.stepId} for problem: ${problemUsed.title}`);

        // Automatisch BITV-Kategorie und Prüfschritt setzen
        const categorySelect = document.getElementById('bitv-category');
        const stepSelect = document.getElementById('bitv-step');

        // Setze Kategorie
        categorySelect.value = suggestedStep.categoryId;
        categorySelect.dispatchEvent(new Event('change'));

        // Warte kurz und setze dann Prüfschritt
        setTimeout(() => {
            stepSelect.value = suggestedStep.stepId;
            stepSelect.dispatchEvent(new Event('change'));

            // Auto-Population für spezielle Report-Types
            autoPopulateFieldsBasedOnReportType(problemUsed, suggestedStep);

            console.log(`🎯 Phase 3: BITV step ${suggestedStep.stepId} automatically selected`);
        }, 100);

        // Visual indicator für automatische Auswahl
        showAutoSuggestionIndicator(suggestedStep, problemUsed);
    } else {
        console.log('⚠️ Phase 3: No BITV mapping found for detected problems');
    }
}

// Auto-Population basierend auf Report-Type und Problem
function autoPopulateFieldsBasedOnReportType(problem, bitvStep) {
    console.log('📝 Phase 3: Auto-populating fields based on report type:', contextData.reportType);

    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');

    // Template-basierte Befüllung je nach Report-Type
    if (contextData.reportType === 'quick-problem') {
        // Unterscheidung zwischen automatisch erkannten und manuellen Problemen
        if (contextData.manualReport) {
            // Manueller Problem-Report ohne automatische Erkennung
            if (!noteTitle.value.trim()) {
                noteTitle.value = `Manuell gemeldetes Problem: ${contextData.elementType}`;
            }

            const manualTemplate = generateManualProblemTemplate(bitvStep);
            if (noteContent.value.includes('=== BARRIEREFREIHEITS-NOTIZ ===')) {
                const sections = noteContent.value.split('=== BARRIEREFREIHEITS-NOTIZ ===');
                noteContent.value = sections[0] + '=== PROBLEM-MELDUNG ===\n' + manualTemplate;
            }
        } else {
            // Automatisch erkanntes Problem
            if (!noteTitle.value.trim()) {
                noteTitle.value = `Barriere gemeldet: ${problem.title}`;
            }

            // Vereinfachte Notiz-Vorlage
            const quickTemplate = generateQuickProblemTemplate(problem, bitvStep);
            if (noteContent.value.includes('=== BARRIEREFREIHEITS-NOTIZ ===')) {
                // Ersetze nur den Notiz-Teil
                const sections = noteContent.value.split('=== BARRIEREFREIHEITS-NOTIZ ===');
                noteContent.value = sections[0] + '=== BARRIEREFREIHEITS-NOTIZ ===\n' + quickTemplate;
            }

            // Automatische Bewertung setzen (Problem erkannt = nicht bestanden)
            setTimeout(() => {
                const failedRadio = document.querySelector('input[name="evaluation"][value="failed"]');
                if (failedRadio) {
                    failedRadio.checked = true;
                    failedRadio.dispatchEvent(new Event('change'));
                }
            }, 200);
        }

    } else if (contextData.reportType === 'quick-citizen') {
        // Bürgermeldung: Vereinfacht, verständlich
        if (!noteTitle.value.trim()) {
            noteTitle.value = `Bürgermeldung: Problem mit ${contextData.elementType}`;
        }

        const citizenTemplate = generateCitizenReportTemplate(problem, bitvStep);
        if (noteContent.value.includes('=== BARRIEREFREIHEITS-NOTIZ ===')) {
            const sections = noteContent.value.split('=== BARRIEREFREIHEITS-NOTIZ ===');
            noteContent.value = sections[0] + '=== BÜRGERMELDUNG ===\n' + citizenTemplate;
        }

    } else if (contextData.reportType === 'detailed-bitv') {
        // Detaillierte BITV-Dokumentation: Vollständig, technisch
        if (!noteTitle.value.trim()) {
            noteTitle.value = `BITV ${bitvStep.stepId}: ${bitvStep.title}`;
        }

        const detailedTemplate = generateDetailedBitvTemplate(problem, bitvStep);
        if (noteContent.value.includes('=== BARRIEREFREIHEITS-NOTIZ ===')) {
            const sections = noteContent.value.split('=== BARRIEREFREIHEITS-NOTIZ ===');
            noteContent.value = sections[0] + '=== BITV-PRÜFBERICHT ===\n' + detailedTemplate;
        }
    }

    console.log('✅ Phase 3: Fields auto-populated based on report type');
}

// Template-Generatoren für verschiedene Report-Types
function generateQuickProblemTemplate(problem, bitvStep) {
    return `PROBLEM ERKANNT:
${problem.description}

EMPFOHLENE LÖSUNG:
${problem.recommendation || problem.solution || 'Siehe automatisch erkanntes Problem oben'}

RECHTLICHE GRUNDLAGE:
BITV ${bitvStep.stepId} - ${bitvStep.title}
${problem.bitvReference || ''}

SCHWEREGRAD: ${problem.severity || 'Mittel'}

NÄCHSTE SCHRITTE:
[ ] Problem an Website-Betreiber melden
[ ] Nachfassen nach angemessener Frist
[ ] Bei Bedarf Beschwerde bei zuständiger Stelle

`;
}

function generateCitizenReportTemplate(problem, bitvStep) {
    return `WAS IST DAS PROBLEM?
Ich habe ein Problem mit der Barrierefreiheit auf dieser Website entdeckt:
${problem.description}

WAS SOLLTE VERBESSERT WERDEN?
${problem.recommendation || problem.solution || 'Das Element sollte für Hilfstechnologien zugänglich gemacht werden.'}

WARUM IST DAS WICHTIG?
Dieses Problem erschwert Menschen mit Behinderungen die Nutzung der Website.

RECHTLICHE GRUNDLAGE:
Diese Website muss nach der Barrierefreie-Informationstechnik-Verordnung (BITV 2.0) zugänglich sein.
Betroffener Prüfpunkt: ${bitvStep.stepId} - ${bitvStep.title}

KONTAKT FÜR MELDUNG:
Website-Betreiber kontaktieren oder an zuständige Überwachungsstelle wenden.

`;
}

function generateManualProblemTemplate(bitvStep) {
    return `MANUELL GEMELDETES PROBLEM:

BESCHREIBUNG DES PROBLEMS:
[Bitte beschreiben Sie das Problem, das Sie festgestellt haben]

BETROFFENES ELEMENT:
Element-Typ: ${contextData.elementType || 'Unbekannt'}
${contextData.text ? `Text/Inhalt: "${contextData.text}"` : ''}
${contextData.accessibleName ? `Zugänglicher Name: "${contextData.accessibleName}"` : ''}

WARUM IST DAS EIN PROBLEM?
[Erklären Sie, warum dieses Element Probleme für Menschen mit Behinderungen verursacht]

EMPFOHLENE LÖSUNG:
[Beschreiben Sie, wie das Problem behoben werden könnte]

RECHTLICHE GRUNDLAGE:
${bitvStep ? `BITV ${bitvStep.stepId} - ${bitvStep.title}` : 'Bitte passenden BITV-Prüfschritt auswählen'}

SCHWEREGRAD:
[ ] Niedrig - Kosmetisches Problem
[ ] Mittel - Beeinträchtigt Nutzung
[ ] Hoch - Verhindert Nutzung
[ ] Kritisch - Blockiert wichtige Funktionen

NÄCHSTE SCHRITTE:
[ ] Problem dokumentiert und beschrieben
[ ] An Website-Betreiber melden
[ ] Nachfassen nach angemessener Frist
[ ] Bei Bedarf Beschwerde bei zuständiger Stelle

`;
}

function generateDetailedBitvTemplate(problem, bitvStep) {
    return `BITV-PRÜFSCHRITT: ${bitvStep.stepId} - ${bitvStep.title}

BEFUND:
❌ NICHT BESTANDEN
${problem.description}

TECHNICAL DETAILS:
Element: ${contextData.elementType} (${contextData.tagName})
${contextData.id ? `ID: ${contextData.id}` : ''}
${contextData.className ? `CSS-Klassen: ${contextData.className}` : ''}
Selector: ${contextData.selector || 'N/A'}

FEHLERBESCHREIBUNG:
${problem.title}
${problem.description}

LÖSUNGSEMPFEHLUNG:
${problem.recommendation || problem.solution || 'Siehe Prüfschritt-Dokumentation'}

BITV-REFERENZ:
${problem.bitvReference || bitvStep.stepId + ' - ' + bitvStep.title}

PRIORITÄT: ${problem.severity === 'critical' ? 'HOCH' : problem.severity === 'major' ? 'MITTEL' : 'NIEDRIG'}

GETESTET MIT:
- Browser: ${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Firefox'}
- Methode: Automatische Erkennung + manuelle Prüfung
- Datum: ${new Date().toLocaleDateString('de-DE')}

`;
}

// Visual Indicator für automatische Vorschläge
function showAutoSuggestionIndicator(bitvStep, problem) {
    const categorySelect = document.getElementById('bitv-category');
    const stepSelect = document.getElementById('bitv-step');

    // Füge visuelle Indikatoren hinzu
    const indicator = document.createElement('div');
    indicator.className = 'auto-suggestion-indicator';
    indicator.innerHTML = `
        <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 4px; padding: 8px; margin: 8px 0; font-size: 14px;">
            🤖 <strong>Automatisch vorgeschlagen:</strong> BITV ${bitvStep.stepId} basierend auf erkanntem Problem "${problem.title}"
            <button type="button" onclick="this.parentElement.parentElement.remove()" style="float: right; background: none; border: none; cursor: pointer;">✕</button>
        </div>
    `;

    // Füge Indikator nach BITV-Auswahl ein
    const bitvSection = document.querySelector('.bitv-section') || stepSelect.parentElement;
    if (bitvSection) {
        bitvSection.appendChild(indicator);
    }
}

// Funktion zum Laden einer bestehenden Notiz
async function loadExistingNote(noteId) {
    try {
        // Lade Notiz aus Storage
        let note = null;
        if (typeof StorageHelper !== 'undefined') {
            // StorageHelper.loadNote() macht selbst den Präfix-Check
            note = await StorageHelper.loadNote(noteId);
        } else {
            // Fallback zu localStorage - hier müssen wir selbst das Präfix prüfen
            const key = noteId.startsWith('note_') ? noteId : `note_${noteId}`;
            const noteData = localStorage.getItem(key);
            if (noteData) {
                note = JSON.parse(noteData);
                note.id = key;
            }
        }

        if (!note) {
            console.error('Notiz konnte nicht geladen werden. ID:', noteId);
            alert('Notiz konnte nicht geladen werden.');
            return;
        }

        existingNote = note;

        // Fülle die Formularfelder
        const noteTitle = document.getElementById('note-title');
        const noteContent = document.getElementById('note-content');
        const recommendation = document.getElementById('recommendation');
        const noteStatus = document.getElementById('note-status');

        if (noteTitle) noteTitle.value = note.title || '';
        if (noteContent) noteContent.value = note.content || '';
        if (recommendation) recommendation.value = note.recommendation || '';
        if (noteStatus) noteStatus.value = note.status || 'draft';

        // Setze Context-Daten aus der Notiz
        contextData = {
            url: note.url,
            pageTitle: note.pageTitle || note.title,
            elementType: note.element?.type || note.elementType,
            tagName: note.element?.tagName,
            text: note.element?.text,
            id: note.element?.id,
            className: note.element?.className,
            selector: note.element?.selector,
            accessibleName: note.element?.accessibleName,
            ariaRole: note.element?.ariaRole
        };

        // Aktualisiere Seiten-Informationen im UI
        setValue('page-url', note.url);
        setValue('page-title', note.pageTitle || note.title);
        setValue('element-type', note.element?.type || note.elementType);
        setValue('tag-name', note.element?.tagName);
        setValue('element-text', note.element?.text);

        // BITV-Test wiederherstellen
        if (note.bitvTest) {
            // Suche den entsprechenden BITV-Schritt
            if (typeof BitvCatalog !== 'undefined') {
                const step = BitvCatalog.getStepById(note.bitvTest.stepId);
                if (step) {
                    selectBitvStep(step);
                    if (note.bitvTest.evaluation) {
                        selectEvaluation(note.bitvTest.evaluation);
                    }
                }
            }
        }

        // Screenshot wiederherstellen, falls vorhanden
        const screenshotCheckbox = document.getElementById('include-screenshot');
        if (note.screenshotDataUrl) {
            if (screenshotCheckbox) {
                screenshotCheckbox.checked = true;

                // Zeige Screenshot-Vorschau
                if (typeof ScreenshotHelper !== 'undefined') {
                    ScreenshotHelper.displayScreenshotPreview(note.screenshotDataUrl);
                }
            }
        } else {
            // Keine Screenshot-Daten vorhanden: Checkbox deaktivieren
            if (screenshotCheckbox) {
                screenshotCheckbox.disabled = true;
                screenshotCheckbox.checked = false;

                // Füge Hinweis hinzu
                const previewContainer = document.getElementById('screenshot-preview');
                if (previewContainer) {
                    const info = document.getElementById('screenshot-info');
                    if (info) {
                        info.textContent = 'Screenshot nur bei neuen Notizen verfügbar (kein Zugriff auf ursprüngliche Seite)';
                        info.style.color = 'var(--text-secondary, #666)';
                    }
                }
            }
        }

        // Ändere Button-Text zu "Aktualisieren"
        const saveButton = document.getElementById('save-button');
        if (saveButton) {
            saveButton.textContent = '💾 Aktualisieren';
        }

        // Ändere Seitentitel
        document.title = `Notiz bearbeiten - ${note.title}`;

    } catch (error) {
        console.error('Fehler beim Laden der Notiz:', error);
        alert('Fehler beim Laden der Notiz: ' + error.message);
    }
}

// Enhanced form handling with accessibility
document.addEventListener('DOMContentLoaded', async function() {
    // Lade bestehende Notiz, wenn ID vorhanden
    if (editNoteId) {
        await loadExistingNote(editNoteId);
    }

    // Initialize Screenshot Helper
    if (typeof window.ScreenshotHelper !== 'undefined') {
        ScreenshotHelper.init();
    }

    // Initialize BITV UI
    initializeBitvUI();

    const form = document.getElementById('note-form');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    const noteContent = document.getElementById('note-content');
    const noteTitle = document.getElementById('note-title');

    // Form submission handling
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveNote();
    });

    // Save button click (redundant but for backward compatibility)
    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        saveNote();
    });

    // Cancel button handling
    cancelButton.addEventListener('click', function() {
        if (confirm('Möchten Sie wirklich abbrechen? Nicht gespeicherte Änderungen gehen verloren.')) {
            if (existingNote) {
                // Beim Bearbeiten: Zurück zur Übersicht
                window.location.href = 'notes-overview.html';
            } else {
                // Bei neuer Notiz: Fenster schließen
                window.close();
            }
        }
    });

    // Auto-save draft functionality
    let autoSaveTimer;
    noteContent.addEventListener('input', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(saveDraft, 2000); // Save draft after 2 seconds of inactivity
    });

    // Screenshot checkbox handler
    const screenshotCheckbox = document.getElementById('include-screenshot');
    if (screenshotCheckbox) {
        screenshotCheckbox.addEventListener('change', function() {
            const previewContainer = document.getElementById('screenshot-preview');
            if (this.checked) {
                console.log('📷 Screenshot option enabled');
                if (previewContainer) {
                    previewContainer.style.display = 'block';
                    const info = document.getElementById('screenshot-info');
                    if (info) {
                        info.textContent = 'Screenshot wird beim Speichern erstellt...';
                        info.style.color = 'var(--text-secondary, #666)';
                    }
                }
            } else {
                console.log('📷 Screenshot option disabled');
                if (previewContainer) {
                    previewContainer.style.display = 'none';
                }
                if (typeof ScreenshotHelper !== 'undefined') {
                    ScreenshotHelper.hideScreenshotPreview();
                }
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+S or Cmd+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            saveNote();
        }
        // Escape to cancel
        if (e.key === 'Escape') {
            cancelButton.click();
        }
    });

    async function saveNote() {
        const title = noteTitle.value.trim();
        const note = noteContent.value.trim();
        const recommendation = document.getElementById('recommendation').value.trim();
        const status = document.getElementById('note-status')?.value || 'draft';

        if (!title) {
            noteTitle.focus();
            showNotification('Bitte geben Sie einen Titel ein.', 'error');
            return;
        }

        if (!note) {
            noteContent.focus();
            showNotification('Bitte geben Sie eine Beschreibung ein.', 'error');
            return;
        }

        try {
            // Bestimme ID: Entweder bestehende ID oder neue ID
            const noteId = existingNote ? existingNote.id : Date.now();

            // Create enhanced note data structure
            const noteData = {
                id: noteId,
                timestamp: existingNote ? existingNote.timestamp : new Date().toISOString(),
                lastModified: new Date().toISOString(),
                title: title,
                content: note,
                recommendation: recommendation,
                url: contextData.url || '',
                pageTitle: contextData.pageTitle || '',
                reportMode: currentMode, // 'simplified' or 'detailed'
                // Status-Tracking für Meldungs-Workflow
                status: status,
                reportedDate: status === 'reported' ? new Date().toISOString() : null,
                resolvedDate: status === 'resolved' ? new Date().toISOString() : null,
                element: {
                    type: contextData.elementType || '',
                    tagName: contextData.tagName || '',
                    text: contextData.text || '',
                    id: contextData.id || '',
                    className: contextData.className || '',
                    selector: contextData.selector || '',
                    accessibleName: contextData.accessibleName || '',
                    ariaRole: contextData.ariaRole || ''
                },
                bitvTest: currentBitvStep ? {
                    category: currentBitvStep.category,
                    stepId: currentBitvStep.id,
                    stepTitle: currentBitvStep.title,
                    stepDescription: currentBitvStep.description,
                    level: currentBitvStep.level,
                    evaluation: currentEvaluation || 'needs_review'
                } : null,
                // Für vereinfachte Meldungen
                citizenReport: currentMode === 'simplified' ? {
                    simplifiedDescription: note,
                    userFriendlyRecommendation: recommendation,
                    detectedProblem: contextData.detectedProblems?.[0] || contextData.primaryProblem || null
                } : null
            };

            // Create detailed text output for download
            let outputText = `=== BITV-SOFTWARETEST NOTIZ ===\n`;
            outputText += `Erstellt: ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE')}\n`;
            outputText += `Titel: ${title}\n\n`;

            if (currentBitvStep) {
                outputText += `=== BITV-PRÜFSCHRITT ===\n`;
                outputText += `Kategorie: ${BitvCatalog.getCategories().find(c => c.id === currentBitvStep.category)?.title || currentBitvStep.category}\n`;
                outputText += `Prüfschritt: ${currentBitvStep.id} - ${currentBitvStep.title}\n`;
                outputText += `Level: WCAG ${currentBitvStep.level}\n`;
                outputText += `Beschreibung: ${currentBitvStep.description}\n`;

                const evaluationTexts = {
                    passed: '✅ Bestanden',
                    failed: '❌ Nicht bestanden',
                    partial: '⚠️ Teilweise bestanden',
                    needs_review: '📝 Zu überprüfen'
                };
                outputText += `Bewertung: ${evaluationTexts[currentEvaluation] || evaluationTexts.needs_review}\n\n`;
            }

            outputText += `=== KONTEXT ===\n`;
            outputText += `Seite: ${contextData.pageTitle || 'Unbekannt'}\n`;
            outputText += `URL: ${contextData.url || 'Unbekannt'}\n`;
            outputText += `Element: ${contextData.elementType || 'Unbekannt'} (${contextData.tagName || 'unbekannt'})\n`;

            if (contextData.text) {
                outputText += `Elementtext: "${contextData.text}"\n`;
            }
            if (contextData.accessibleName) {
                outputText += `Zugänglicher Name: "${contextData.accessibleName}"\n`;
            }
            if (contextData.ariaRole) {
                outputText += `ARIA-Role: ${contextData.ariaRole}\n`;
            }

            outputText += `\n=== BESCHREIBUNG ===\n${note}\n`;

            if (recommendation) {
                outputText += `\n=== EMPFEHLUNG ===\n${recommendation}\n`;
            }

            // Create filename with BITV step reference
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const stepPrefix = currentBitvStep ? `${currentBitvStep.id}_` : '';
            const fileName = `bitv-note-${stepPrefix}${timestamp}.txt`;

            // Screenshot ZUERST erstellen (BEVOR Text-Download und Speichern)
            // Behalte existierenden Screenshot, falls vorhanden
            if (existingNote && existingNote.screenshotDataUrl) {
                noteData.screenshotDataUrl = existingNote.screenshotDataUrl;
            }

            const includeScreenshot = document.getElementById('include-screenshot');
            if (includeScreenshot && includeScreenshot.checked) {
                try {
                    console.log('📷 Creating screenshot for note...');
                    console.log('📷 contextData.tabId:', contextData.tabId);
                    console.log('📷 contextData.selector:', contextData.selector);
                    console.log('📷 Full contextData:', contextData);

                    // Screenshot muss vom ursprünglichen Tab erstellt werden
                    // note.html läuft in separatem Fenster und hat keinen Zugriff auf die Original-Seite
                    if (contextData.tabId && contextData.selector) {
                        const screenshotResult = await requestScreenshotFromTab(
                            contextData.tabId,
                            contextData.selector
                        );

                        if (screenshotResult.success) {
                            noteData.screenshotDataUrl = screenshotResult.dataUrl;
                            console.log('✅ Screenshot successfully attached to note');
                            showNotification('Screenshot wurde hinzugefügt', 'success');
                        } else {
                            console.warn('Screenshot creation failed:', screenshotResult.error);
                            showNotification('Screenshot konnte nicht erstellt werden: ' + screenshotResult.error, 'warning');
                        }
                    } else {
                        console.warn('Screenshot requested but tab ID or selector missing');
                        console.warn('Missing: tabId=' + (contextData.tabId ? 'OK' : 'MISSING') + ', selector=' + (contextData.selector ? 'OK' : 'MISSING'));
                        showNotification('Screenshot konnte nicht erstellt werden - Element-Information fehlt', 'warning');
                    }
                } catch (screenshotError) {
                    console.error('Screenshot error:', screenshotError);
                    showNotification('Fehler beim Screenshot erstellen: ' + screenshotError.message, 'warning');
                }
            }

            // Download nur bei neuen Notizen, nicht bei Bearbeitung
            if (!existingNote) {
                // Create download link
                const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            // Save to persistent storage for overview with enhanced structure
            noteData.fileName = existingNote ? existingNote.fileName : fileName;

            try {
                if (typeof StorageHelper !== 'undefined') {
                    await StorageHelper.saveNote('note_' + noteData.id, noteData);
                } else {
                    // Fallback: localStorage
                    localStorage.setItem('note_' + noteData.id, JSON.stringify(noteData));
                }
            } catch (error) {
                console.error('Fehler beim Speichern der Notiz:', error);
                alert('Fehler beim Speichern der Notiz. Bitte versuchen Sie es erneut.');
                return;
            }

            // Clear draft
            clearDraft();

            // Passende Erfolgsmeldung je nach Modus (Erstellen vs. Bearbeiten)
            let successMessage;
            if (existingNote) {
                successMessage = currentBitvStep
                    ? `BITV-Notiz für Prüfschritt ${currentBitvStep.id} wurde erfolgreich aktualisiert!`
                    : 'Notiz wurde erfolgreich aktualisiert!';
            } else {
                successMessage = currentBitvStep
                    ? `BITV-Notiz für Prüfschritt ${currentBitvStep.id} wurde erfolgreich gespeichert!`
                    : 'Notiz wurde erfolgreich gespeichert!';
            }
            showNotification(successMessage, 'success');

            // Close window or navigate back after delay
            setTimeout(() => {
                if (existingNote) {
                    // Beim Bearbeiten: Zurück zur Übersicht
                    console.log('🚪 Navigating back to overview...');
                    window.location.href = 'notes-overview.html';
                } else {
                    // Bei neuer Notiz: Fenster schließen
                    console.log('🚪 Closing window now...');
                    window.close();
                }
            }, 1500);

        } catch (error) {
            console.error('Error saving note:', error);
            showNotification('Fehler beim Speichern der Notiz.', 'error');
        }
    }

    function saveDraft() {
        const note = noteContent.value.trim();
        if (note) {
            try {
                localStorage.setItem('accnotes_draft', note);
            } catch (e) {
                console.warn('Could not save draft to localStorage');
            }
        }
    }

    function loadDraft() {
        try {
            const draft = localStorage.getItem('accnotes_draft');
            if (draft && !noteContent.value.includes('=== BARRIEREFREIHEITS-NOTIZ ===')) {
                const confirmLoad = confirm('Es wurde ein Entwurf gefunden. Möchten Sie ihn laden?');
                if (confirmLoad) {
                    noteContent.value = draft;
                    noteContent.focus();
                    noteContent.setSelectionRange(draft.length, draft.length);
                }
            }
        } catch (e) {
            console.warn('Could not load draft from localStorage');
        }
    }

    function clearDraft() {
        try {
            localStorage.removeItem('accnotes_draft');
        } catch (e) {
            console.warn('Could not clear draft from localStorage');
        }
    }

    function showNotification(message, type = 'info') {
        // Create accessible notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');
        notification.textContent = message;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            backgroundColor: type === 'error' ? '#c62828' : type === 'success' ? '#2e7d32' : '#1565c0'
        });

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }

    // Load draft on page load
    loadDraft();

    // Event Listener für Modus-Wechsel
    const switchToDetailedBtn = document.getElementById('switch-to-detailed-mode');
    if (switchToDetailedBtn) {
        switchToDetailedBtn.addEventListener('click', switchToDetailedMode);
    }
});