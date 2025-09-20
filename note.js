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

// Event Listener für den Save-Button
document.getElementById('save-button').addEventListener('click', function() {
    const note = document.getElementById('note-content').value;
    if (note.trim()) {
        // Erstelle Dateiname mit Zeitstempel
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `accessibility-note-${timestamp}.txt`;

        // Erstelle Download-Link
        const blob = new Blob([note], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Auch in localStorage für die Übersicht speichern
        const noteData = {
            content: note,
            timestamp: new Date().toISOString(),
            url: contextData.url || '',
            title: contextData.title || '',
            elementType: contextData.elementType || '',
            fileName: fileName
        };
        localStorage.setItem('note_' + Date.now(), JSON.stringify(noteData));

        alert('Notiz wurde als Datei gespeichert!');
        window.close();
    } else {
        alert('Bitte geben Sie eine Notiz ein.');
    }
});