// Content Script zur Extraktion von Element-Informationen für Barrierefreiheitstests
let lastClickedElement = null;

// Speichere das zuletzt geklickte Element
document.addEventListener('contextmenu', function(event) {
    lastClickedElement = event.target;
}, true);

// Funktion zur Extraktion umfassender Element-Informationen
function getElementAccessibilityInfo(element) {
    if (!element) return {};

    const info = {
        // Basis-Informationen
        tagName: element.tagName,
        elementType: getElementType(element),
        text: getElementText(element),

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
        selector: generateSelector(element)
    };

    return info;
}

function getElementType(element) {
    const tag = element.tagName.toLowerCase();
    const role = element.getAttribute('role');
    const type = element.type;

    if (role) return `${tag} (role: ${role})`;
    if (tag === 'input' && type) return `${tag} (type: ${type})`;
    if (tag === 'button') return 'Button';
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

    // Priorisiere sichtbaren Text
    if (directText && directText.length < 200) return directText;
    if (valueText) return `Wert: ${valueText}`;
    if (altText) return `Alt: ${altText}`;
    if (titleText) return `Titel: ${titleText}`;
    if (placeholderText) return `Placeholder: ${placeholderText}`;

    return directText.substring(0, 100) + (directText.length > 100 ? '...' : '');
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

// Höre auf Nachrichten vom Background Script
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getElementInfo') {
        const elementInfo = getElementAccessibilityInfo(lastClickedElement);
        sendResponse(elementInfo);
    }
});