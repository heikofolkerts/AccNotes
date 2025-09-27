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

        // Alle Button-ähnlichen Elemente
        const isButton = element.tagName === 'BUTTON' ||
                         (element.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes(element.type)) ||
                         element.getAttribute('role') === 'button' ||
                         (element.tagName === 'A' && element.onclick);

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
            // Spezielle Erkennung für häufige Button-Typen
            let buttonType = 'Unbekannt';
            if (element.className.toLowerCase().includes('close')) buttonType = 'Schließen-Button';
            else if (element.className.toLowerCase().includes('menu')) buttonType = 'Menü-Button';
            else if (element.type === 'submit') buttonType = 'Submit-Button';
            else if (textContent === '' && element.innerHTML.includes('<')) buttonType = 'Icon-Button';
            else if (isOnlyUnicodeSymbols) buttonType = 'Unicode-Symbol-Button';

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
    }
    }; // Ende der BarrierDetector Definition

    console.log('✅ BarrierDetector successfully defined');
} else {
    console.log('ℹ️ BarrierDetector already exists, skipping redefinition');
}