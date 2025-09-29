// Automatische Barriere-Erkennung für Bürgermeldungen
// Erkennt die 5 häufigsten Accessibility-Probleme für Laien

// Verhindere doppelte Deklaration
if (typeof window.BarrierDetector === 'undefined') {
    window.BarrierDetector = {
    // Performance-Tracking
    SCAN_TIMEOUT: 10000, // 10 Sekund max für Seiten-Scan
    // Laienverständliche Problembeschreibungen
    PROBLEM_DESCRIPTIONS: {
        MISSING_ALT_TEXT: {
            title: "Alt-Text fehlt",
            description: "Dieses Bild hat keinen Alternativtext - blinde Nutzer wissen nicht, was darauf zu sehen ist.",
            solution: "Fügen Sie eine Bildbeschreibung hinzu (alt-Attribut).",
            bitvReference: "1.1.1 - Nicht-Text-Inhalte",
            severity: "high"
        },
        MISSING_BUTTON_LABEL: {
            title: "Button-Beschriftung fehlt",
            description: "Dieser Button hat keine Beschriftung - Nutzer von Screen-Readern wissen nicht, was er tut.",
            solution: "Fügen Sie eine Beschriftung hinzu (aria-label oder sichtbaren Text).",
            bitvReference: "2.5.3 - Label in Name",
            severity: "high"
        },
        MISSING_FORM_LABEL: {
            title: "Formularfeld ohne Label",
            description: "Dieses Eingabefeld hat keine Beschriftung - Nutzer wissen nicht, was eingegeben werden soll.",
            solution: "Verknüpfen Sie das Feld mit einem Label-Element.",
            bitvReference: "3.3.2 - Beschriftungen oder Anweisungen",
            severity: "high"
        },
        POOR_CONTRAST: {
            title: "Schlechter Farbkontrast",
            description: "Der Text ist zu schwach zu lesen - Menschen mit Sehbehinderungen können ihn nicht erkennen.",
            solution: "Verwenden Sie dunklere Schrift oder helleren Hintergrund.",
            bitvReference: "1.4.3 - Kontrast (Minimum)",
            severity: "medium"
        },
        HEADING_STRUCTURE_ISSUE: {
            title: "Überschriften-Problem",
            description: "Die Überschriften-Struktur ist nicht logisch - Screen-Reader-Nutzer verlieren die Orientierung.",
            solution: "Verwenden Sie Überschriften in der richtigen Reihenfolge (H1, H2, H3...).",
            bitvReference: "1.3.1 - Info und Beziehungen",
            severity: "medium"
        }
    },

    // Haupt-Analyse-Funktion für ein Element
    analyzeElement(element) {
        const problems = [];
        const startTime = performance.now();

        try {
            // 1. Alt-Text-Prüfung
            const altTextProblem = this.checkMissingAltText(element);
            if (altTextProblem) problems.push(altTextProblem);

            // 2. Button-Label-Prüfung
            const buttonLabelProblem = this.checkButtonLabels(element);
            if (buttonLabelProblem) problems.push(buttonLabelProblem);

            // 3. Formular-Label-Prüfung
            const formLabelProblem = this.checkFormLabels(element);
            if (formLabelProblem) problems.push(formLabelProblem);

            // 4. Kontrast-Prüfung (nur für Text-Elemente)
            const contrastProblem = this.checkContrast(element);
            if (contrastProblem) problems.push(contrastProblem);

            // 5. Überschriften-Struktur-Prüfung (nur für Überschriften)
            const headingProblem = this.checkElementHeadingStructure(element);
            if (headingProblem) problems.push(headingProblem);

            const endTime = performance.now();
            if (endTime - startTime > 50) {
                console.warn(`BarrierDetector: Element analysis took ${Math.round(endTime - startTime)}ms`);
            }

            return {
                hasProblems: problems.length > 0,
                problems: problems,
                analysisTime: Math.round(endTime - startTime)
            };

        } catch (error) {
            console.error('BarrierDetector: Error analyzing element:', error);
            return { hasProblems: false, problems: [], error: error.message };
        }
    },

    // Seiten-weite Analyse (für Überschriften-Struktur)
    analyzePage() {
        const startTime = performance.now();
        const problems = [];

        try {
            // Überschriften-Struktur prüfen
            const headingProblem = this.checkHeadingStructure();
            if (headingProblem) problems.push(headingProblem);

            const endTime = performance.now();

            return {
                hasProblems: problems.length > 0,
                problems: problems,
                analysisTime: Math.round(endTime - startTime)
            };

        } catch (error) {
            console.error('BarrierDetector: Error analyzing page:', error);
            return { hasProblems: false, problems: [], error: error.message };
        }
    },

    // 1. Erkennung fehlender Alt-Texte
    checkMissingAltText(element) {
        if (!element) return null;

        // Prüfe Bilder
        if (element.tagName === 'IMG') {
            const hasAlt = element.hasAttribute('alt');
            const altText = element.getAttribute('alt') || '';
            const hasAriaLabel = element.getAttribute('aria-label');
            const hasAriaLabelledBy = element.getAttribute('aria-labelledby');

            // Dekorative Bilder (alt="") sind OK
            if (hasAlt && altText === '') return null;

            // Problematisch: Kein Alt-Attribut oder leerer Alt ohne aria-label
            if (!hasAlt || (altText.trim() === '' && !hasAriaLabel && !hasAriaLabelledBy)) {
                return {
                    type: 'MISSING_ALT_TEXT',
                    element: element,
                    title: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.title,
                    description: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.description,
                    solution: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.solution,
                    bitvReference: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.bitvReference,
                    severity: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.severity,
                    context: {
                        tagName: element.tagName,
                        src: element.src || 'Unknown',
                        hasAlt: hasAlt,
                        altText: altText,
                        isDecorative: hasAlt && altText === ''
                    }
                };
            }
        }

        // Prüfe Image-Buttons
        if (element.tagName === 'INPUT' && element.type === 'image') {
            const hasAlt = element.hasAttribute('alt');
            const altText = element.getAttribute('alt') || '';

            if (!hasAlt || altText.trim() === '') {
                return {
                    type: 'MISSING_ALT_TEXT',
                    element: element,
                    title: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.title,
                    description: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.description,
                    solution: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.solution,
                    bitvReference: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.bitvReference,
                    severity: this.PROBLEM_DESCRIPTIONS.MISSING_ALT_TEXT.severity,
                    context: {
                        tagName: 'INPUT (type=image)',
                        src: element.src || 'Unknown',
                        hasAlt: hasAlt,
                        altText: altText,
                        isButton: true
                    }
                };
            }
        }

        return null;
    },

    // 2. Erkennung fehlender Button-Labels
    checkButtonLabels(element) {
        if (!element) return null;

        // Check if it's a CSS-Background-Image-Button first (store result to avoid double-checking)
        const isCSSBackgroundButton = this.isCSSBackgroundImageButton(element);

        // Alle Button-ähnlichen Elemente inklusive CSS-Background-Image-Buttons
        const isButton = element.tagName === 'BUTTON' ||
                         (element.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes(element.type)) ||
                         element.getAttribute('role') === 'button' ||
                         (element.tagName === 'A' && element.onclick) ||
                         isCSSBackgroundButton;

        if (!isButton) return null;

        // Verschiedene Quellen für zugänglichen Namen prüfen
        const textContent = element.textContent?.trim() || '';
        const ariaLabel = element.getAttribute('aria-label')?.trim() || '';
        const ariaLabelledBy = element.getAttribute('aria-labelledby');
        const title = element.title?.trim() || '';
        const altText = element.alt?.trim() || ''; // für Image-Buttons

        // Prüfe ob textContent nur Unicode-Symbole enthält (problematisch für Screen-Reader)
        const isOnlyUnicodeSymbols = textContent && /^[\u{1F000}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}🔍❤️⚙️]+$/u.test(textContent);

        // Prüfe aria-labelledby
        let labelledByText = '';
        if (ariaLabelledBy) {
            const labelElement = document.getElementById(ariaLabelledBy);
            labelledByText = labelElement?.textContent?.trim() || '';
        }

        // Hat der Button einen zugänglichen Namen?
        // Unicode-Symbole allein gelten NICHT als zugänglicher Name
        const hasProperAccessibleName = (textContent && !isOnlyUnicodeSymbols) || ariaLabel || labelledByText || title || altText;

        if (!hasProperAccessibleName) {
            // Erweiterte Erkennung für häufige Button-Typen und Muster
            let buttonType = this.identifyButtonType(element, textContent, isOnlyUnicodeSymbols, isCSSBackgroundButton);

            return {
                type: 'MISSING_BUTTON_LABEL',
                element: element,
                title: this.PROBLEM_DESCRIPTIONS.MISSING_BUTTON_LABEL.title,
                description: this.PROBLEM_DESCRIPTIONS.MISSING_BUTTON_LABEL.description,
                solution: this.PROBLEM_DESCRIPTIONS.MISSING_BUTTON_LABEL.solution,
                bitvReference: this.PROBLEM_DESCRIPTIONS.MISSING_BUTTON_LABEL.bitvReference,
                severity: this.PROBLEM_DESCRIPTIONS.MISSING_BUTTON_LABEL.severity,
                context: {
                    tagName: element.tagName,
                    type: element.type || 'button',
                    buttonType: buttonType,
                    hasTextContent: !!textContent,
                    hasAriaLabel: !!ariaLabel,
                    hasTitle: !!title,
                    innerHTML: element.innerHTML.substring(0, 100) + '...'
                }
            };
        }

        return null;
    },

    // 3. Erkennung fehlender Formular-Labels
    checkFormLabels(element) {
        if (!element) return null;

        // Nur Formular-Eingabeelemente
        const isFormInput = element.tagName === 'INPUT' ||
                           element.tagName === 'SELECT' ||
                           element.tagName === 'TEXTAREA';

        if (!isFormInput) return null;

        // Ausnahmen: Hidden inputs, buttons
        if (element.type === 'hidden' ||
            ['button', 'submit', 'reset', 'image'].includes(element.type)) {
            return null;
        }

        // Verschiedene Label-Quellen prüfen
        const ariaLabel = element.getAttribute('aria-label')?.trim() || '';
        const ariaLabelledBy = element.getAttribute('aria-labelledby');
        const placeholder = element.placeholder?.trim() || '';
        const title = element.title?.trim() || '';

        // Prüfe aria-labelledby
        let labelledByText = '';
        if (ariaLabelledBy) {
            const labelElement = document.getElementById(ariaLabelledBy);
            labelledByText = labelElement?.textContent?.trim() || '';
        }

        // Prüfe <label>-Element
        let hasLabel = false;
        let labelText = '';

        // 1. Label mit for-Attribut
        if (element.id) {
            const labelElement = document.querySelector(`label[for="${element.id}"]`);
            if (labelElement) {
                hasLabel = true;
                labelText = labelElement.textContent?.trim() || '';
            }
        }

        // 2. Umschließendes Label
        if (!hasLabel) {
            const parentLabel = element.closest('label');
            if (parentLabel) {
                hasLabel = true;
                labelText = parentLabel.textContent?.trim() || '';
            }
        }

        // Hat das Feld einen zugänglichen Namen?
        const hasAccessibleName = hasLabel || ariaLabel || labelledByText || title;

        // Placeholder allein reicht nicht!
        if (!hasAccessibleName) {
            let fieldType = element.type || element.tagName.toLowerCase();
            if (element.tagName === 'SELECT') fieldType = 'Auswahlliste';
            if (element.tagName === 'TEXTAREA') fieldType = 'Textbereich';

            return {
                type: 'MISSING_FORM_LABEL',
                element: element,
                title: this.PROBLEM_DESCRIPTIONS.MISSING_FORM_LABEL.title,
                description: this.PROBLEM_DESCRIPTIONS.MISSING_FORM_LABEL.description,
                solution: this.PROBLEM_DESCRIPTIONS.MISSING_FORM_LABEL.solution,
                bitvReference: this.PROBLEM_DESCRIPTIONS.MISSING_FORM_LABEL.bitvReference,
                severity: this.PROBLEM_DESCRIPTIONS.MISSING_FORM_LABEL.severity,
                context: {
                    tagName: element.tagName,
                    type: element.type || 'text',
                    fieldType: fieldType,
                    hasLabel: hasLabel,
                    hasAriaLabel: !!ariaLabel,
                    hasPlaceholder: !!placeholder,
                    placeholderText: placeholder,
                    name: element.name || 'unnamed'
                }
            };
        }

        return null;
    },

    // 4. Einfacher Kontrast-Check
    checkContrast(element) {
        if (!element) return null;

        // Nur für Text-Elemente
        const hasText = element.textContent && element.textContent.trim().length > 0;
        if (!hasText) return null;

        try {
            const computedStyle = window.getComputedStyle(element);
            const color = computedStyle.color;
            const backgroundColor = computedStyle.backgroundColor;

            // Einfache Prüfung: sehr helle Texte auf hellen Hintergründen
            if (color && backgroundColor) {
                const colorValues = this.parseColor(color);
                const bgColorValues = this.parseColor(backgroundColor);

                if (colorValues && bgColorValues) {
                    const contrast = this.calculateContrast(colorValues, bgColorValues);

                    // WCAG AA Standard: 4.5:1 für normalen Text
                    if (contrast < 4.5) {
                        const fontSize = parseFloat(computedStyle.fontSize);
                        const fontWeight = computedStyle.fontWeight;
                        const isLargeText = fontSize >= 18 || (fontSize >= 14 && parseInt(fontWeight) >= 700);

                        // Großer Text: 3:1 Minimum
                        const requiredContrast = isLargeText ? 3.0 : 4.5;

                        if (contrast < requiredContrast) {
                            return {
                                type: 'POOR_CONTRAST',
                                element: element,
                                title: this.PROBLEM_DESCRIPTIONS.POOR_CONTRAST.title,
                                description: this.PROBLEM_DESCRIPTIONS.POOR_CONTRAST.description,
                                solution: this.PROBLEM_DESCRIPTIONS.POOR_CONTRAST.solution,
                                bitvReference: this.PROBLEM_DESCRIPTIONS.POOR_CONTRAST.bitvReference,
                                severity: this.PROBLEM_DESCRIPTIONS.POOR_CONTRAST.severity,
                                context: {
                                    actualContrast: Math.round(contrast * 100) / 100,
                                    requiredContrast: requiredContrast,
                                    textColor: color,
                                    backgroundColor: backgroundColor,
                                    fontSize: fontSize,
                                    isLargeText: isLargeText,
                                    textSample: element.textContent.substring(0, 50) + '...'
                                }
                            };
                        }
                    }
                }
            }
        } catch (error) {
            console.warn('BarrierDetector: Contrast check failed:', error);
        }

        return null;
    },

    // 5. Überschriften-Struktur prüfen (Seiten-weit)
    checkHeadingStructure() {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

        if (headings.length === 0) return null;

        const levels = headings.map(h => parseInt(h.tagName.charAt(1)));

        // Prüfe auf häufige Probleme
        const problems = [];

        // 1. Keine H1 vorhanden
        if (!levels.includes(1)) {
            problems.push("Keine Haupt-Überschrift (H1) gefunden");
        }

        // 2. Überschriften-Ebenen übersprungen
        for (let i = 1; i < levels.length; i++) {
            const currentLevel = levels[i];
            const previousLevel = levels[i - 1];

            if (currentLevel > previousLevel + 1) {
                problems.push(`Überschriften-Ebene übersprungen: von H${previousLevel} zu H${currentLevel}`);
                break; // Nur ersten Fehler melden
            }
        }

        if (problems.length > 0) {
            return {
                type: 'HEADING_STRUCTURE_ISSUE',
                element: headings[0], // Erste Überschrift als Referenz
                title: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.title,
                description: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.description,
                solution: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.solution,
                bitvReference: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.bitvReference,
                severity: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.severity,
                context: {
                    totalHeadings: headings.length,
                    headingLevels: levels,
                    problems: problems,
                    firstProblemHeading: headings.find((h, i) => levels[i] > (levels[i-1] || 0) + 1)
                }
            };
        }

        return null;
    },

    // Hilfsfunktionen für Kontrast-Berechnung
    parseColor(colorStr) {
        if (!colorStr) return null;

        // RGB-Format parsen
        const rgbMatch = colorStr.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])];
        }

        // RGBA-Format parsen
        const rgbaMatch = colorStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (rgbaMatch) {
            const alpha = parseFloat(rgbaMatch[4]);
            if (alpha === 0) return null; // Transparenter Text
            return [parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])];
        }

        return null;
    },

    calculateContrast(color1, color2) {
        const getLuminance = (rgb) => {
            const [r, g, b] = rgb.map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        const lum1 = getLuminance(color1);
        const lum2 = getLuminance(color2);

        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);

        return (brightest + 0.05) / (darkest + 0.05);
    },

    // 6. Überschriften-Struktur für einzelne Elemente prüfen
    checkElementHeadingStructure(element) {
        if (!element) return null;

        // Nur für Überschriften-Elemente
        const headingMatch = element.tagName.match(/^H([1-6])$/);
        if (!headingMatch) return null;

        const currentLevel = parseInt(headingMatch[1]);

        // Sammle alle Überschriften der Seite bis zu diesem Element
        const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const currentIndex = allHeadings.indexOf(element);

        if (currentIndex === -1) return null;

        // Analysiere Kontext um diese Überschrift
        const headingsUpTo = allHeadings.slice(0, currentIndex + 1);
        const levels = headingsUpTo.map(h => parseInt(h.tagName.charAt(1)));

        // Prüfungen nur für dieses spezifische Element
        const problems = [];

        // 1. Ist es eine zweite/dritte H1?
        if (currentLevel === 1 && currentIndex > 0) {
            const h1Count = levels.filter(l => l === 1).length;
            if (h1Count > 1) {
                problems.push("Mehrere H1-Überschriften auf der Seite (nur eine empfohlen)");
            }
        }

        // 2. Überschriften-Ebene übersprungen?
        if (currentIndex > 0) {
            const previousLevel = levels[currentIndex - 1];
            if (currentLevel > previousLevel + 1) {
                problems.push(`Überschriften-Ebene übersprungen: von H${previousLevel} zu H${currentLevel}`);
            }
        }

        // 3. Erste Überschrift ist nicht H1?
        if (currentIndex === 0 && currentLevel !== 1) {
            problems.push("Erste Überschrift ist nicht H1 (empfohlen für Seitenstruktur)");
        }

        if (problems.length > 0) {
            return {
                type: 'HEADING_STRUCTURE_ISSUE',
                element: element,
                title: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.title,
                description: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.description,
                solution: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.solution,
                bitvReference: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.bitvReference,
                severity: this.PROBLEM_DESCRIPTIONS.HEADING_STRUCTURE_ISSUE.severity,
                context: {
                    currentLevel: currentLevel,
                    currentIndex: currentIndex,
                    totalHeadings: allHeadings.length,
                    problems: problems,
                    headingLevelsUpTo: levels
                }
            };
        }

        return null;
    },

    // Generiere Zusammenfassung für Kontextmenü
    generateMenuText(problems) {
        if (!problems || problems.length === 0) return null;

        // Nutze das erste/wichtigste Problem
        const primaryProblem = problems.sort((a, b) => {
            const severityOrder = { high: 0, medium: 1, low: 2 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        })[0];

        return `🚨 ${primaryProblem.title}`;
    },

    // Neue Hilfsfunktion: CSS-Background-Image-Button Erkennung
    isCSSBackgroundImageButton(element) {
        if (!element) return false;

        try {
            console.log('🎨 BarrierDetector: Checking CSS-Background-Image-Button for:', element.tagName, element.className);

            // Prüfe typische Button-artige Elemente mit CSS-Background-Images
            const hasOnClick = !!element.onclick;
            const hasStyleCursor = element.style.cursor === 'pointer';
            const computedStyle = window.getComputedStyle(element);
            const hasComputedCursor = computedStyle.cursor === 'pointer';
            const hasTabIndex = element.tabIndex >= 0;

            const isClickable = hasOnClick || hasStyleCursor || hasComputedCursor || hasTabIndex;

            console.log('🎨 BarrierDetector: Clickability check:', {
                hasOnClick,
                hasStyleCursor,
                hasComputedCursor,
                hasTabIndex,
                isClickable
            });

            if (!isClickable) {
                console.log('🎨 BarrierDetector: Element not clickable, skipping');
                return false;
            }

            // Prüfe CSS-Background-Image
            const hasBackgroundImage = computedStyle.backgroundImage &&
                                      computedStyle.backgroundImage !== 'none';

            console.log('🎨 BarrierDetector: Background image check:', {
                backgroundImage: computedStyle.backgroundImage,
                hasBackgroundImage
            });

            if (!hasBackgroundImage) {
                console.log('🎨 BarrierDetector: No background image found');
                return false;
            }

            // Zusätzliche Indikatoren für Button-ähnliches Verhalten
            const hasButtonClass = element.className &&
                                   /btn|button|icon|action|control|search|menu|close/i.test(element.className);

            const hasButtonStyles = (computedStyle.padding && computedStyle.padding !== '0px') ||
                                   (computedStyle.border && computedStyle.border !== '0px none') ||
                                   (computedStyle.borderRadius && computedStyle.borderRadius !== '0px');

            console.log('🎨 BarrierDetector: Button-like indicators:', {
                className: element.className,
                hasButtonClass,
                padding: computedStyle.padding,
                border: computedStyle.border,
                borderRadius: computedStyle.borderRadius,
                hasButtonStyles
            });

            // Element ist wahrscheinlich ein CSS-Background-Image-Button wenn:
            // 1. Es clickbar ist UND
            // 2. Es ein Background-Image hat UND
            // 3. Es Button-ähnliche CSS-Klassen oder Styles hat
            const result = hasBackgroundImage && (hasButtonClass || hasButtonStyles);

            console.log('🎨 BarrierDetector: Final CSS-Background-Image-Button result:', result);
            return result;

        } catch (error) {
            console.error('❌ CSS-Background-Image-Button detection failed:', error);
            return false;
        }
    },

    // Neue Hilfsfunktion: Erweiterte Button-Typ-Identifikation
    identifyButtonType(element, textContent, isOnlyUnicodeSymbols, isCSSBackgroundButton = false) {
        // CSS-Background-Image-Button (highest priority, passed from caller to avoid double-checking)
        if (isCSSBackgroundButton) {
            console.log('🎯 Button type identified: CSS-Background-Image-Button');
            return 'CSS-Background-Image-Button';
        }

        // Basis-Klassifikation für spezifische Input-Typen
        if (element.tagName === 'INPUT' && element.type === 'submit') return 'Submit-Button';
        if (isOnlyUnicodeSymbols) return 'Unicode-Symbol-Button';
        if (textContent === '' && element.innerHTML.includes('<')) return 'Icon-Button';

        // Erweiterte Muster-Erkennung basierend auf CSS-Klassen
        const className = element.className.toLowerCase();
        const buttonPatterns = {
            'close': /close|dismiss|cancel|exit|×|✕/i,
            'menu': /menu|hamburger|nav|toggle|☰/i,
            'search': /search|find|suche|magnify|🔍/i,
            'cart': /cart|basket|warenkorb|shopping|🛒/i,
            'login': /login|signin|anmeld|auth|👤/i,
            'share': /share|social|teil|facebook|twitter|📤/i,
            'edit': /edit|modify|change|bearbeit|✏️|📝/i,
            'delete': /delete|remove|trash|lösch|🗑️|❌/i,
            'save': /save|speich|disk|💾/i,
            'download': /download|load|herunterlad|💾|⬇️/i,
            'upload': /upload|hochlad|⬆️|📁/i,
            'play': /play|start|abspielen|▶️/i,
            'pause': /pause|stop|⏸️|⏹️/i,
            'settings': /settings|config|einstellung|⚙️|🔧/i,
            'help': /help|info|hilfe|support|❓|ℹ️/i,
            'notification': /notification|alert|benachrich|🔔/i
        };

        // Prüfe CSS-Klassen gegen Muster
        for (const [type, pattern] of Object.entries(buttonPatterns)) {
            if (pattern.test(className)) {
                return `${type.charAt(0).toUpperCase()}${type.slice(1)}-Button`;
            }
        }

        // Prüfe Element-Inhalt gegen Muster (für Unicode-Symbole)
        const contentText = textContent + element.innerHTML;
        for (const [type, pattern] of Object.entries(buttonPatterns)) {
            if (pattern.test(contentText)) {
                return `${type.charAt(0).toUpperCase()}${type.slice(1)}-Button`;
            }
        }

        // Prüfe Parent-Element-Kontext (PRIORITÄT vor Submit-Button)
        const parentClass = element.parentElement?.className?.toLowerCase() || '';
        if (parentClass.includes('header')) return 'Header-Navigation-Button';
        if (parentClass.includes('footer')) return 'Footer-Button';
        if (parentClass.includes('sidebar')) return 'Sidebar-Button';
        if (parentClass.includes('modal')) return 'Modal-Button';
        if (parentClass.includes('dropdown')) return 'Dropdown-Button';

        // Submit-Button-Erkennung für <button> Elemente (nur wenn in Formular-Kontext)
        if (element.tagName === 'BUTTON' && element.type === 'submit') {
            // Prüfe, ob es in einem Formular steht oder Submit-Text hat
            const isInForm = element.closest('form') !== null;
            const hasSubmitText = /submit|send|senden|absenden|save|speichern/i.test(textContent);
            if (isInForm || hasSubmitText) {
                return 'Submit-Button';
            }
        }

        // Fallback
        if (className) return 'CSS-Klassen-Button';
        return 'Unbekannter Button';
    },

    // Erweiterte Lösungsvorschläge basierend auf Button-Typ
    generateFixSuggestion(problemType, buttonType, element) {
        const baseSuggestions = {
            'MISSING_BUTTON_LABEL': 'Fügen Sie eine Beschriftung hinzu (aria-label oder sichtbaren Text).',
            'MISSING_ALT_TEXT': 'Fügen Sie eine Bildbeschreibung hinzu (alt-Attribut).',
            'MISSING_FORM_LABEL': 'Verknüpfen Sie das Feld mit einem Label-Element.',
            'POOR_CONTRAST': 'Verwenden Sie dunklere Schrift oder helleren Hintergrund.',
            'HEADING_STRUCTURE_ISSUE': 'Verwenden Sie Überschriften in der richtigen Reihenfolge (H1, H2, H3...).'
        };

        let suggestion = baseSuggestions[problemType] || 'Überprüfen Sie die Barrierefreiheit dieses Elements.';

        // Spezifische Vorschläge für Button-Typen
        if (problemType === 'MISSING_BUTTON_LABEL' && buttonType) {
            const specificSuggestions = {
                'Close-Button': 'Beispiel: <button aria-label="Dialog schließen">×</button>',
                'Menu-Button': 'Beispiel: <button aria-label="Hauptmenü öffnen">☰</button>',
                'Search-Button': 'Beispiel: <button aria-label="Suche starten">🔍</button>',
                'CSS-Background-Image-Button': 'Beispiel: <div role="button" aria-label="Aktion ausführen" style="background-image: url(icon.png)">',
                'Submit-Button': 'Beispiel: <button type="submit">Formular absenden</button>',
                'Unicode-Symbol-Button': 'Ersetzen Sie Unicode-Symbole durch beschreibenden Text oder aria-label.'
            };

            if (specificSuggestions[buttonType]) {
                suggestion += `\n\n💡 Für ${buttonType}:\n${specificSuggestions[buttonType]}`;
            }
        }

        return suggestion;
    }
    }; // Ende der BarrierDetector Definition

    console.log('✅ BarrierDetector successfully defined');
} else {
    console.log('ℹ️ BarrierDetector already exists, skipping redefinition');
}