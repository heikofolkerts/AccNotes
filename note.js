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

prefillText += `\n=== BARRIEREFREIHEITS-NOTIZ ===\n`;
prefillText += `Problem/Beobachtung:\n\n`;
prefillText += `Empfehlung:\n\n`;
prefillText += `WCAG-Kriterium:\n\n`;

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
}

// Enhanced form handling with accessibility
document.addEventListener('DOMContentLoaded', function() {
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

    function saveNote() {
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

            // Save to localStorage for overview with enhanced structure
            noteData.fileName = fileName;
            localStorage.setItem('note_' + noteData.id, JSON.stringify(noteData));

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