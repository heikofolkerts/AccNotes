// URL-Parameter auslesen
const urlParams = new URLSearchParams(window.location.search);
const contextDataStr = urlParams.get('contextData');

let contextData = {};
try {
    contextData = JSON.parse(contextDataStr) || {};
} catch (e) {
    console.error('Fehler beim Parsen der Kontextdaten:', e);
}

// Funktion zum sicheren Setzen von Werten
function setValue(elementId, value, defaultValue = '-') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || defaultValue;
    }
}

// Seiten-Informationen
setValue('page-url', contextData.url);
setValue('page-title', contextData.title);
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
prefillText += `Seite: ${contextData.title || 'Unbekannt'}\n`;
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

noteContent.value = prefillText;
noteContent.focus();
noteContent.setSelectionRange(prefillText.length, prefillText.length);

// BITV integration
let currentBitvStep = null;
let currentEvaluation = null;

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

// Enhanced form handling with accessibility
document.addEventListener('DOMContentLoaded', function() {
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
            window.close();
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
            // Create enhanced note data structure
            const noteData = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                title: title,
                content: note,
                recommendation: recommendation,
                url: contextData.url || '',
                pageTitle: contextData.title || '',
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
            outputText += `Seite: ${contextData.title || 'Unbekannt'}\n`;
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

            // Screenshot erstellen wenn gewünscht
            const includeScreenshot = document.getElementById('include-screenshot');
            if (includeScreenshot && includeScreenshot.checked) {
                try {
                    console.log('📷 Creating screenshot for note...');

                    // Element aus contextData rekonstruieren (falls möglich)
                    let targetElement = null;
                    if (window.lastClickedElement) {
                        targetElement = window.lastClickedElement;
                    } else if (contextData.cssSelector) {
                        try {
                            targetElement = document.querySelector(contextData.cssSelector);
                        } catch (e) {
                            console.warn('Could not find element by CSS selector:', contextData.cssSelector);
                        }
                    }

                    if (targetElement && typeof ScreenshotHelper !== 'undefined') {
                        const screenshotResult = await ScreenshotHelper.captureElementScreenshot(targetElement, {
                            highlight: true,
                            padding: 20,
                            maxWidth: 800,
                            maxHeight: 600
                        });

                        if (screenshotResult.success) {
                            noteData.screenshot = ScreenshotHelper.prepareScreenshotForStorage(screenshotResult, noteData);
                            console.log('✅ Screenshot successfully attached to note');

                            // Screenshot-Vorschau anzeigen
                            ScreenshotHelper.showScreenshotPreview(screenshotResult);
                        } else {
                            console.warn('Screenshot creation failed:', screenshotResult.error);
                            showNotification('Screenshot konnte nicht erstellt werden: ' + screenshotResult.error, 'warning');
                        }
                    } else {
                        console.warn('Screenshot requested but no target element available or ScreenshotHelper not loaded');
                        showNotification('Screenshot konnte nicht erstellt werden - Element nicht verfügbar', 'warning');
                    }
                } catch (screenshotError) {
                    console.error('Screenshot error:', screenshotError);
                    showNotification('Fehler beim Screenshot erstellen: ' + screenshotError.message, 'warning');
                }
            }

            // Save to persistent storage for overview with enhanced structure
            noteData.fileName = fileName;

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

            const successMessage = currentBitvStep
                ? `BITV-Notiz für Prüfschritt ${currentBitvStep.id} wurde erfolgreich gespeichert!`
                : 'Notiz wurde erfolgreich gespeichert!';
            showNotification(successMessage, 'success');

            // Close window after short delay
            setTimeout(() => {
                window.close();
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
});