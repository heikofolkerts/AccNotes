// Content Script zur Extraktion von Element-Informationen für Barrierefreiheitstests
let lastClickedElement = null;
let contentScriptReady = false;

// Vereinfachte Initialisierung
function initializeContentScript() {
    console.log('🚀 Content Script initializing...');

    // Warte kurz auf BarrierDetector (wird parallel geladen)
    setTimeout(() => {
        const barrierDetectorLoaded = typeof window.BarrierDetector !== 'undefined';
        console.log('✅ Content Script ready, BarrierDetector available:', barrierDetectorLoaded);
        contentScriptReady = true;
    }, 50);
}

// Initialisiere sofort
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContentScript);
} else {
    initializeContentScript();
}

// Speichere das zuletzt geklickte Element und Element-Informationen
document.addEventListener('contextmenu', function(event) {
    lastClickedElement = event.target;
    console.log('🎯 Right-clicked element:', event.target, 'Tag:', event.target.tagName);

    // Sammle Element-Informationen sofort für direkte Verwendung
    try {
        const elementInfo = getElementAccessibilityInfo(event.target);

        // Speichere für direkte Verwendung (ohne Background Script)
        window.lastElementInfo = cleanElementInfoForStorage(elementInfo);

        // Zusätzlich auch im Storage speichern für Background Script
        const cleanElementInfo = cleanElementInfoForStorage(elementInfo);
        const storageData = {
            'temp_elementInfo': cleanElementInfo,
            'temp_timestamp': Date.now()
        };

        // Speichere Element-Informationen im Storage
        browserAPI.storage.local.set(storageData, () => {
            if (browserAPI.runtime.lastError) {
                console.error('❌ Failed to store element info:', browserAPI.runtime.lastError);
            } else {
                // DYNAMISCHES KONTEXTMENÜ: Informiere Background Script über erkannte Probleme
                updateDynamicContextMenu(cleanElementInfo);
            }
        });
    } catch (error) {
        console.error('❌ Error during element info collection:', error);
        window.lastElementInfo = null;
    }
}, true);

// Funktion zum Aktualisieren des dynamischen Kontextmenüs
function updateDynamicContextMenu(elementInfo) {
    try {
        // Sende Element-Info an Background Script für dynamisches Kontextmenü
        browserAPI.runtime.sendMessage({
            action: 'updateContextMenu',
            elementInfo: elementInfo
        }, (response) => {
            if (browserAPI.runtime.lastError) {
                console.error('❌ Content: Error updating context menu:', browserAPI.runtime.lastError);
            } else if (response?.success) {
                console.log('✅ Content: Dynamic context menu updated');

                // Log für Debugging
                const problemCount = elementInfo?.detectedProblems?.length || 0;
                if (problemCount > 0) {
                    console.log(`🚨 Content: ${problemCount} problems detected, context menu shows problem-specific options`);
                    elementInfo.detectedProblems.forEach((problem, index) => {
                        console.log(`   ${index + 1}. ${problem.title}`);
                    });
                } else {
                    console.log('✅ Content: No problems detected, context menu shows standard options');
                }
            }
        });
    } catch (error) {
        console.error('❌ Content: Error in updateDynamicContextMenu:', error);
    }
}

// Direktes Kontextmenü erstellen (da Background Script nicht funktioniert)
function createDirectContextMenu(event) {
    // Prüfe ob schon ein Menü existiert
    const existingMenu = document.getElementById('accnotes-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.id = 'accnotes-context-menu';
    menu.style.cssText = `
        position: fixed;
        z-index: 10000;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        border-radius: 4px;
        font-family: Arial, sans-serif;
        font-size: 13px;
        min-width: 200px;
        cursor: pointer;
    `;

    const hasProblems = window.lastElementInfo?.detectedProblems?.length > 0;
    const problemText = hasProblems ? ` (${window.lastElementInfo.detectedProblems.length} Problem${window.lastElementInfo.detectedProblems.length > 1 ? 'e' : ''} erkannt)` : '';

    menu.innerHTML = `
        <div style="padding: 8px 12px; border-bottom: 1px solid #eee;">
            <strong>AccNotes</strong>
        </div>
        <div id="accnotes-add-note" style="padding: 8px 12px; hover:background-color: #f0f0f0;">
            📝 Notiz hinzufügen${problemText}
        </div>
        <div id="accnotes-view-notes" style="padding: 8px 12px; hover:background-color: #f0f0f0;">
            📄 Alle Notizen anzeigen
        </div>
    `;

    // Position bei Mauszeiger
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';

    document.body.appendChild(menu);

    // Event Listener für Menü-Aktionen
    document.getElementById('accnotes-add-note').addEventListener('click', function() {
        createNoteFromCurrentElement();
        menu.remove();
    });

    document.getElementById('accnotes-view-notes').addEventListener('click', function() {
        const notesOverviewUrl = browserAPI.runtime.getURL('notes-overview.html');
        window.open(notesOverviewUrl, '_blank');
        menu.remove();
    });

    // Klick außerhalb schließt Menü
    setTimeout(() => {
        document.addEventListener('click', function closeMenu() {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        }, true);
    }, 100);
}

// Keyboard Shortcut für direkte Notiz-Erstellung
document.addEventListener('keydown', function(event) {
    // Ctrl+Shift+N für Notiz hinzufügen
    if (event.ctrlKey && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        if (lastClickedElement && window.lastElementInfo) {
            createNoteFromCurrentElement();
        } else {
            console.warn('⚠️ Kein Element ausgewählt für Notiz-Erstellung');
        }
    }

    // Ctrl+Shift+M für direktes Menü
    if (event.ctrlKey && event.shiftKey && event.key === 'M') {
        event.preventDefault();
        createDirectContextMenu({ pageX: window.innerWidth / 2, pageY: window.innerHeight / 2 });
    }

    // Ctrl+Shift+E für Screen-Reader Element-Erfassung (TEST)
    if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        captureCurrentFocusedElement();
    }
});

// Funktion zur Erfassung des aktuell fokussierten Elements (für Screen-Reader Testing)
function captureCurrentFocusedElement() {
    console.log('🔍 === SCREEN-READER ELEMENT DETECTION TEST (Ctrl+Shift+E) ===');

    let selectedElement = null;
    let detectionMethod = 'none';

    // PRIORITY METHOD: Text Selection (für Screen-Reader)
    const selection = window.getSelection();
    console.log('📍 1. TEXT SELECTION ANALYSIS:');
    console.log('   Selection exists:', selection && selection.rangeCount > 0);

    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString().trim();

        console.log('   Selected text:', selectedText.substring(0, 100));
        console.log('   Selection range:', range);

        if (selectedText.length > 0) {
            // Finde das umschließende Element
            let container = range.commonAncestorContainer;

            // Wenn es ein Text-Node ist, nimm das Parent-Element
            if (container.nodeType === Node.TEXT_NODE) {
                container = container.parentElement;
            }

            // Gehe hoch im DOM-Tree bis zu einem semantisch relevanten Element
            let targetElement = container;
            let attempts = 0;
            const maxAttempts = 5;

            while (targetElement && attempts < maxAttempts) {
                const tag = targetElement.tagName?.toLowerCase();

                // Stoppe bei semantisch relevanten Elementen
                if (tag && !['span', 'font'].includes(tag)) {
                    break;
                }

                // Oder bei Elementen mit wichtigen Eigenschaften
                if (targetElement.className || targetElement.id ||
                    targetElement.style?.color || targetElement.style?.backgroundColor) {
                    break;
                }

                targetElement = targetElement.parentElement;
                attempts++;
            }

            if (targetElement && targetElement !== document.body) {
                selectedElement = targetElement;
                detectionMethod = 'text-selection';

                console.log('✅ ELEMENT FROM TEXT SELECTION:', selectedElement);
                console.log('   Tag:', selectedElement.tagName);
                console.log('   ID:', selectedElement.id || '(none)');
                console.log('   Classes:', selectedElement.className || '(none)');
                console.log('   Selected text:', selectedText.substring(0, 50));

                // Analysiere Styling für Kontrast-Probleme
                const computedStyle = window.getComputedStyle(selectedElement);
                console.log('   🎨 Styling Analysis:');
                console.log('      Color:', computedStyle.color);
                console.log('      Background:', computedStyle.backgroundColor);
                console.log('      Font family:', computedStyle.fontFamily);
                console.log('      Font size:', computedStyle.fontSize);
                console.log('      Font weight:', computedStyle.fontWeight);
            }
        }
    }

    // FALLBACK: Standard Focus Detection
    if (!selectedElement) {
        console.log('📍 2. FALLBACK - Standard focus detection:');
        const activeElement = document.activeElement;
        console.log('   document.activeElement:', activeElement?.tagName);
        console.log('   Is body?:', activeElement === document.body);

        if (activeElement && activeElement !== document.body) {
            selectedElement = activeElement;
            detectionMethod = 'focus';
        }
    }

    // Element-Analyse und Speicherung
    if (selectedElement) {
        console.log(`✅ SELECTED ELEMENT (${detectionMethod.toUpperCase()}):`, selectedElement);

        try {
            const elementInfo = getElementAccessibilityInfo(selectedElement);
            console.log('📋 Element Info:', {
                tagName: elementInfo.tagName,
                elementType: elementInfo.elementType,
                text: elementInfo.text,
                accessibleName: elementInfo.accessibleName,
                ariaLabel: elementInfo.ariaLabel,
                detectedProblems: elementInfo.detectedProblems?.length || 0
            });

            // Setze als lastClickedElement für weitere Tests
            lastClickedElement = selectedElement;
            window.lastElementInfo = cleanElementInfoForStorage(elementInfo);

            console.log('💾 Element stored as lastClickedElement for testing');
            console.log('💡 You can now use Ctrl+Shift+N to create a note for this element');

        } catch (error) {
            console.error('❌ Error analyzing element:', error);
        }
    } else {
        console.log('❌ NO ELEMENT DETECTED');
        console.log('💡 TIPS:');
        console.log('   1. SELECT TEXT with Shift+Arrow keys, then press Ctrl+Shift+E');
        console.log('   2. Or navigate to focusable element with Tab, then press Ctrl+Shift+E');
    }

    console.log('🔍 === END SCREEN-READER ELEMENT DETECTION TEST ===');
}

// Funktion zum Bereinigen der Element-Informationen für Storage
function cleanElementInfoForStorage(elementInfo) {
    if (!elementInfo) return {};

    // Erstelle eine tiefe Kopie ohne DOM-Referenzen
    const cleanInfo = JSON.parse(JSON.stringify(elementInfo, (key, value) => {
        // Entferne DOM-Element-Referenzen
        if (value && typeof value === 'object' && value.nodeType) {
            return undefined; // DOM-Elemente entfernen
        }
        return value;
    }));

    // Bereinige detectedProblems Array - entferne 'element' Referenzen
    if (cleanInfo.detectedProblems && Array.isArray(cleanInfo.detectedProblems)) {
        cleanInfo.detectedProblems = cleanInfo.detectedProblems.map(problem => {
            const cleanProblem = { ...problem };
            // Entferne DOM-Element-Referenz, aber behalte andere Daten
            delete cleanProblem.element;
            return cleanProblem;
        });
    }

    return cleanInfo;
}

// Funktion zur Extraktion umfassender Element-Informationen
function getElementAccessibilityInfo(element) {
    if (!element) {
        return { tagName: 'UNKNOWN', elementType: 'Unbekannt', detectedProblems: [] };
    }

    const elementType = getElementType(element);

    const info = {
        // Basis-Informationen (KRITISCH - müssen immer vorhanden sein)
        tagName: element.tagName || 'UNKNOWN',
        elementType: elementType || 'Unbekannt',
        text: getElementText(element) || '',

        // Accessibility-Attribute
        ariaLabel: element.getAttribute('aria-label') || '',
        ariaLabelledBy: element.getAttribute('aria-labelledby') || '',
        ariaDescribedBy: element.getAttribute('aria-describedby') || '',
        ariaRole: element.getAttribute('role') || '',
        ariaHidden: element.getAttribute('aria-hidden') || '',
        ariaExpanded: element.getAttribute('aria-expanded') || '',
        ariaPressed: element.getAttribute('aria-pressed') || '',
        ariaChecked: element.getAttribute('aria-checked') || '',
        ariaDisabled: element.getAttribute('aria-disabled') || '',
        ariaRequired: element.getAttribute('aria-required') || '',

        // Standard HTML-Attribute
        id: element.id || '',
        className: element.className || '',
        title: element.title || '',
        alt: element.alt || '',
        placeholder: element.placeholder || '',
        value: element.value || '',
        type: element.type || '',
        disabled: element.disabled ? 'true' : '',
        required: element.required ? 'true' : '',
        readonly: element.readOnly ? 'true' : '',

        // Link-spezifische Informationen
        href: element.href || '',
        target: element.target || '',

        // Formular-spezifische Informationen
        name: element.name || '',

        // Berechnung der zugänglichen Namen/Beschreibungen
        accessibleName: getAccessibleName(element),
        accessibleDescription: getAccessibleDescription(element),

        // Strukturelle Informationen
        tabIndex: element.tabIndex !== undefined ? element.tabIndex.toString() : '',
        isInteractive: isInteractiveElement(element),
        isFocusable: isFocusableElement(element),

        // DOM-Position für bessere Identifikation
        xpath: getXPath(element),
        selector: generateSelector(element),

        // Automatische Barriere-Erkennung
        detectedProblems: []
    };

    // Führe automatische Barriere-Erkennung durch (falls verfügbar)
    if (typeof window.BarrierDetector !== 'undefined') {
        try {
            const analysisResult = window.BarrierDetector.analyzeElement(element);

            if (analysisResult && analysisResult.hasProblems && analysisResult.problems && analysisResult.problems.length > 0) {
                info.detectedProblems = analysisResult.problems;
            } else {
                info.detectedProblems = [];
            }
        } catch (error) {
            console.error('❌ Error during barrier detection:', error);
            info.detectedProblems = []; // Fehlerfall: leeres Array
        }
    } else {
        console.warn('⚠️ BarrierDetector not available - proceeding without barrier detection');
        info.detectedProblems = []; // Nicht verfügbar: leeres Array
    }


    return info;
}

function getElementType(element) {
    const tag = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const type = element.type;

    // Erweiterte Button-Erkennung (gleiche Logik wie BarrierDetector)
    const isButton = tag === 'button' ||
                     (tag === 'input' && ['button', 'submit', 'reset', 'image'].includes(type)) ||
                     role === 'button' ||
                     (tag === 'a' && element.onclick);

    if (isButton) {
        // Detailliertere Button-Typ-Erkennung
        if (tag === 'button') {
            const textContent = element.textContent?.trim() || '';
            if (textContent === '' || /^[\u{1F000}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}🔍❤️⚙️]+$/u.test(textContent)) {
                return 'Icon-Button';
            }
            return 'Button';
        }
        if (tag === 'input' && type === 'submit') return 'Submit-Button';
        if (tag === 'input' && type === 'reset') return 'Reset-Button';
        if (tag === 'input' && type === 'image') return 'Bild-Button';
        if (tag === 'input' && type === 'button') return 'Input-Button';
        if (tag === 'a' && element.onclick) return 'Link-Button';
        if (role === 'button') return `${tag} (Button-Rolle)`;
    }

    // Andere Elementtypen
    if (role && !isButton) return `${tag} (role: ${role})`;
    if (tag === 'input' && type && !isButton) return `${tag} (type: ${type})`;
    if (tag === 'a') return 'Link';
    if (tag === 'img') return 'Bild';
    if (tag === 'form') return 'Formular';
    if (tag === 'select') return 'Auswahlliste';
    if (tag === 'textarea') return 'Textbereich';
    if (tag === 'label') return 'Label';
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) return `Überschrift (${tag})`;
    if (['div', 'span'].includes(tag) && element.onclick) return `${tag} (klickbar)`;

    return tag;
}

function getElementText(element) {
    // Verschiedene Textquellen prüfen
    const directText = element.textContent?.trim() || '';
    const valueText = element.value || '';
    const altText = element.alt || '';
    const titleText = element.title || '';
    const placeholderText = element.placeholder || '';
    const ariaLabel = element.getAttribute('aria-label') || '';

    // Prüfe ob es nur Unicode-Symbole sind
    const isOnlyUnicodeSymbols = directText && /^[\u{1F000}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}🔍❤️⚙️]+$/u.test(directText);

    // Priorisiere zugänglichen Text für Screen-Reader
    if (ariaLabel) return `ARIA-Label: ${ariaLabel}`;
    if (directText && directText.length < 200 && !isOnlyUnicodeSymbols) return directText;
    if (valueText) return `Wert: ${valueText}`;
    if (altText) return `Alt: ${altText}`;
    if (titleText) return `Titel: ${titleText}`;
    if (placeholderText) return `Placeholder: ${placeholderText}`;

    // Für Icon-Buttons: Zeige Unicode-Symbole, aber markiere sie als problematisch
    if (isOnlyUnicodeSymbols) return `Symbol: ${directText} (möglicherweise nicht zugänglich)`;

    return directText.substring(0, 100) + (directText.length > 100 ? '...' : '') || '(Kein Text)';
}

function getAccessibleName(element) {
    // Vereinfachte Berechnung des zugänglichen Namens
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;

    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
        const labelElement = document.getElementById(ariaLabelledBy);
        if (labelElement) return labelElement.textContent?.trim() || '';
    }

    // Label für Formularelemente
    if (element.id) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (label) return label.textContent?.trim() || '';
    }

    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent?.trim() || '';

    return element.textContent?.trim() || element.alt || element.title || '';
}

function getAccessibleDescription(element) {
    const ariaDescribedBy = element.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
        const descElement = document.getElementById(ariaDescribedBy);
        if (descElement) return descElement.textContent?.trim() || '';
    }
    return element.title || '';
}

function isInteractiveElement(element) {
    const interactiveTags = ['a', 'button', 'input', 'select', 'textarea', 'details', 'summary'];
    const role = element.getAttribute('role');
    const interactiveRoles = ['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'textbox'];

    return interactiveTags.includes(element.tagName.toLowerCase()) ||
           (role && interactiveRoles.includes(role)) ||
           element.onclick !== null ||
           element.tabIndex >= 0;
}

function isFocusableElement(element) {
    if (element.tabIndex < 0) return false;
    if (element.disabled || element.getAttribute('aria-hidden') === 'true') return false;

    const focusableTags = ['a', 'button', 'input', 'select', 'textarea', 'iframe'];
    return focusableTags.includes(element.tagName.toLowerCase()) || element.tabIndex >= 0;
}

function getXPath(element) {
    if (element.id) return `//*[@id="${element.id}"]`;

    const parts = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        let nbOfPreviousSiblings = 0;
        let hasNextSiblings = false;
        let sibling = element.previousSibling;
        while (sibling) {
            if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === element.nodeName) {
                nbOfPreviousSiblings++;
            }
            sibling = sibling.previousSibling;
        }
        sibling = element.nextSibling;
        while (sibling) {
            if (sibling.nodeName === element.nodeName) {
                hasNextSiblings = true;
                break;
            }
            sibling = sibling.nextSibling;
        }
        const prefix = element.nodeName.toLowerCase();
        const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : '';
        parts.push(prefix + nth);
        element = element.parentNode;
    }
    return parts.length ? '/' + parts.reverse().join('/') : '';
}

function generateSelector(element) {
    if (element.id) return `#${element.id}`;

    const path = [];
    while (element && element.nodeType === Node.ELEMENT_NODE) {
        let selector = element.nodeName.toLowerCase();
        if (element.className) {
            selector += '.' + element.className.trim().split(/\s+/).join('.');
        }
        path.unshift(selector);
        if (element.id) {
            path[0] = `#${element.id}`;
            break;
        }
        element = element.parentNode;
    }
    return path.join(' > ');
}

// Cross-Browser-API
const browserAPI = (typeof chrome !== 'undefined' && chrome.runtime) ? chrome : browser;

// Backup: Direct context menu handling in content script
document.addEventListener('keydown', function(event) {
    // Ctrl+Shift+N für Notiz hinzufügen (Fallback)
    if (event.ctrlKey && event.shiftKey && event.key === 'N') {
        event.preventDefault();
        createNoteFromCurrentElement();
    }
});

// Alternative: Direktes Öffnen der Notiz-Seite
function createNoteFromCurrentElement() {
    if (!lastClickedElement || !window.lastElementInfo) {
        console.warn('❌ No element or element info available for note creation');
        return;
    }

    try {
        // Sammle Kontext-Informationen
        const contextData = {
            url: window.location.href,
            title: document.title,
            selectedText: window.getSelection().toString(),
            ...window.lastElementInfo
        };

        // Erstelle URL-Parameter und öffne Notiz-Seite
        const params = new URLSearchParams();
        params.set('contextData', JSON.stringify(contextData));
        const notePageUrl = browserAPI.runtime.getURL('note.html') + '?' + params.toString();
        window.open(notePageUrl, '_blank');

    } catch (error) {
        console.error('❌ Error creating note:', error);
    }
}

// Höre auf Nachrichten vom Background Script (Cross-Browser kompatibel)
browserAPI.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getElementInfo') {
        try {
            const elementInfo = getElementAccessibilityInfo(lastClickedElement);
            sendResponse(elementInfo);
        } catch (error) {
            console.error('❌ Error in getElementInfo:', error);
            sendResponse({
                tagName: 'ERROR',
                elementType: 'Fehler',
                detectedProblems: [],
                error: error.message
            });
        }
        return true;
    }

    if (request.action === 'createNote') {
        createNoteFromCurrentElement();
        sendResponse({ success: true });
        return true;
    }

    if (request.action === 'prepareElementInfo') {
        if (lastClickedElement && window.lastElementInfo) {
            browserAPI.storage.local.set({
                'temp_elementInfo': window.lastElementInfo,
                'temp_timestamp': Date.now()
            }).then(() => {
                sendResponse({ success: true, hasElementInfo: true });
            }).catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        } else {
            sendResponse({ success: false, hasElementInfo: false });
        }
        return true;
    }

    return false;
});