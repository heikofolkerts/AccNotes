// Cross-Browser-API
const browserAPI = (typeof chrome !== 'undefined' && chrome.runtime) ? chrome : browser;

// URL-Parameter auslesen
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const problemsParam = urlParams.get('problems');
const elementInfoParam = urlParams.get('elementInfo');

console.log('🆘 Help page loaded with mode:', mode);

// Problemspezifische Erklärungen oder Behebungsanleitungen laden
if (mode === 'explain' && problemsParam) {
    try {
        const problems = JSON.parse(problemsParam);
        console.log('📋 Explaining problems:', problems);
        displayProblemExplanations(problems);
    } catch (error) {
        console.error('❌ Error parsing problems:', error);
        showGeneralHelp();
    }
} else if (mode === 'fix') {
    try {
        const problems = problemsParam ? JSON.parse(problemsParam) : null;
        const elementInfo = elementInfoParam ? JSON.parse(elementInfoParam) : null;
        console.log('🔧 Showing fix instructions for:', problems);
        displayFixInstructions(problems, elementInfo);
    } catch (error) {
        console.error('❌ Error parsing fix data:', error);
        showGeneralHelp();
    }
} else {
    showGeneralHelp();
}

function displayProblemExplanations(problems) {
    const container = document.getElementById('problem-explanations');

    if (!problems || problems.length === 0) {
        container.innerHTML = `
            <div class="no-problems">
                <h3>ℹ️ Keine spezifischen Probleme erkannt</h3>
                <p>Für dieses Element wurden keine automatischen Barrierefreiheits-Probleme erkannt.</p>
                <p>Das bedeutet nicht, dass das Element perfekt ist - es könnte andere Probleme geben, die unsere Algorithmen nicht erkennen.</p>
            </div>
        `;
        return;
    }

    // Header für problemspezifische Hilfe
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #ff5722, #ff7043); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2>🔍 Erkannte Probleme - Detaillierte Erklärung</h2>
            <p>Hier finden Sie ausführliche Erklärungen zu den ${problems.length} erkannten Problem${problems.length > 1 ? 'en' : ''}:</p>
        </div>
    `;

    problems.forEach((problem, index) => {
        const problemHtml = createProblemExplanation(problem, index + 1);
        container.innerHTML += problemHtml;
    });
}

function createProblemExplanation(problem, index) {
    const severityClass = problem.severity || 'major';
    const severityText = getSeverityText(severityClass);

    return `
        <div class="problem-section">
            <div class="problem-header">
                <h2>
                    <span class="icon">${index}.</span>
                    ${problem.title || 'Unbekanntes Problem'}
                </h2>
            </div>
            <div class="problem-content">
                <div class="problem-description">
                    <h4>🔍 Was ist das Problem?</h4>
                    <p>${problem.description || 'Keine Beschreibung verfügbar.'}</p>
                </div>

                <div class="problem-why">
                    <h4>❗ Warum ist das problematisch?</h4>
                    <p>${getProblemImpactExplanation(problem.type)}</p>
                </div>

                <div class="problem-solution">
                    <h4>✅ Wie kann das behoben werden?</h4>
                    <p><strong>Empfehlung:</strong> ${problem.recommendation || problem.solution || 'Siehe BITV-Dokumentation für spezifische Anleitungen.'}</p>
                    ${getTechnicalSolution(problem.type)}
                </div>

                <div class="bitv-reference">
                    <h4>📜 Rechtliche Grundlage</h4>
                    <p><strong>BITV-Referenz:</strong> ${problem.bitvReference || 'Allgemeine Barrierefreiheitsanforderungen'}</p>
                    <p>Diese Anforderung ist verpflichtend für alle öffentlichen Stellen in Deutschland.</p>
                </div>

                <div class="severity ${severityClass}">${severityText}</div>
            </div>
        </div>
    `;
}

function getSeverityText(severity) {
    const severityMap = {
        'critical': '🚨 Kritisch - Blockiert wichtige Funktionen',
        'major': '⚠️ Schwerwiegend - Beeinträchtigt Nutzung erheblich',
        'minor': '⚡ Geringfügig - Leichte Beeinträchtigung',
        'cosmetic': '💄 Kosmetisch - Verbesserung der Nutzererfahrung'
    };
    return severityMap[severity] || '⚠️ Unbekannter Schweregrad';
}

function getProblemImpactExplanation(problemType) {
    const impactMap = {
        'missing_alt_text': `
            Menschen, die Screenreader verwenden, können nicht verstehen, was auf dem Bild zu sehen ist.
            Das Bild wird entweder ignoriert oder nur als "Bild" oder "Grafik" angekündigt, ohne den Inhalt zu beschreiben.
        `,
        'missing_button_label': `
            Screenreader-Nutzer können nicht verstehen, was dieser Button tut.
            Er wird möglicherweise nur als "Button" angekündigt, ohne Hinweis auf seine Funktion.
        `,
        'missing_form_label': `
            Menschen mit Sehbehinderungen wissen nicht, welche Informationen in dieses Feld eingegeben werden sollen.
            Screenreader können das Feld nicht richtig beschreiben.
        `,
        'poor_contrast': `
            Menschen mit Sehbehinderungen oder in ungünstigen Lichtverhältnissen können den Text möglicherweise nicht lesen.
            Dies betrifft auch Menschen mit Farbenblindheit.
        `,
        'heading_structure': `
            Screenreader-Nutzer verwenden Überschriften zur Navigation. Eine falsche Hierarchie macht es schwer,
            die Struktur der Seite zu verstehen und effizient zu navigieren.
        `
    };

    return impactMap[problemType] || `
        Dieses Problem kann die Zugänglichkeit der Website für Menschen mit Behinderungen beeinträchtigen.
        Besonders Nutzer von Screenreadern oder anderen Hilfstechnologien könnten Schwierigkeiten haben.
    `;
}

function getTechnicalSolution(problemType) {
    const solutionMap = {
        'missing_alt_text': `
            <p><strong>Technische Lösung:</strong></p>
            <code>&lt;img src="bild.jpg" alt="Beschreibung des Bildinhalts"&gt;</code>
        `,
        'missing_button_label': `
            <p><strong>Technische Lösungen:</strong></p>
            <code>&lt;button aria-label="Beschreibung der Aktion"&gt;Icon&lt;/button&gt;</code><br>
            <code>&lt;button&gt;Sichtbarer Text&lt;/button&gt;</code>
        `,
        'missing_form_label': `
            <p><strong>Technische Lösungen:</strong></p>
            <code>&lt;label for="email"&gt;E-Mail-Adresse:&lt;/label&gt;&lt;input id="email" type="email"&gt;</code><br>
            <code>&lt;input aria-label="E-Mail-Adresse" type="email"&gt;</code>
        `,
        'poor_contrast': `
            <p><strong>Technische Lösung:</strong></p>
            <p>Kontrastminimum von 4.5:1 für normalen Text und 3:1 für großen Text einhalten.</p>
        `,
        'heading_structure': `
            <p><strong>Technische Lösung:</strong></p>
            <p>Überschriften hierarchisch verwenden: H1 → H2 → H3, keine Level überspringen.</p>
        `
    };

    return solutionMap[problemType] || '';
}

function showGeneralHelp() {
    const generalHelp = document.getElementById('general-help');
    generalHelp.style.display = 'block';

    // Problemspezifische Sektion verstecken
    const problemExplanations = document.getElementById('problem-explanations');
    problemExplanations.style.display = 'none';
}

function openNotesOverview() {
    const notesOverviewUrl = browserAPI.runtime.getURL('notes-overview.html');
    browserAPI.tabs.create({ url: notesOverviewUrl });
    window.close();
}

function displayFixInstructions(problems, elementInfo) {
    const container = document.getElementById('problem-explanations');

    if (!problems || problems.length === 0) {
        // Allgemeine Behebungsanweisungen
        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h2>🔧 Allgemeine Behebungsanweisungen</h2>
                <p>Hier finden Sie grundlegende Anleitungen zur Verbesserung der Barrierefreiheit Ihrer Website:</p>
            </div>
            <div class="general-fix-instructions">
                ${createGeneralFixInstructions()}
            </div>
        `;
        return;
    }

    // Header für problemspezifische Behebungsanleitungen
    container.innerHTML = `
        <div style="background: linear-gradient(135deg, #4caf50, #66bb6a); color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2>🔧 Schritt-für-Schritt Behebungsanleitung</h2>
            <p>So beheben Sie die ${problems.length} erkannten Problem${problems.length > 1 ? 'e' : ''} konkret:</p>
        </div>
    `;

    problems.forEach((problem, index) => {
        const fixHtml = createFixInstructionCard(problem, index + 1, elementInfo);
        container.innerHTML += fixHtml;
    });
}

function createFixInstructionCard(problem, index, elementInfo) {
    if (typeof window.BarrierDetector !== 'undefined') {
        // Verwende erweiterte Lösungsvorschläge aus BarrierDetector
        const buttonType = problem.context?.buttonType || null;
        const enhancedSolution = BarrierDetector.generateFixSuggestion(problem.type, buttonType, null);

        return `
            <div class="fix-instruction-card">
                <h3>🔧 Problem ${index}: ${problem.title}</h3>
                <div class="element-context">
                    <p><strong>Element:</strong> ${elementInfo?.tagName || 'Unbekannt'} ${elementInfo?.elementType ? `(${elementInfo.elementType})` : ''}</p>
                    ${elementInfo?.className ? `<p><strong>CSS-Klassen:</strong> <code>${elementInfo.className}</code></p>` : ''}
                    ${problem.context?.buttonType ? `<p><strong>Button-Typ:</strong> ${problem.context.buttonType}</p>` : ''}
                </div>

                <div class="current-code">
                    <h4>❌ Aktueller Code (Problematisch):</h4>
                    <pre><code>${generateCurrentCode(problem, elementInfo)}</code></pre>
                </div>

                <div class="fixed-code">
                    <h4>✅ Korrigierter Code:</h4>
                    <pre><code>${generateFixedCode(problem, elementInfo)}</code></pre>
                </div>

                <div class="detailed-explanation">
                    <h4>📋 Detaillierte Anleitung:</h4>
                    <div class="solution-steps">
                        ${enhancedSolution.split('\\n').map(line => line.trim() ? `<p>${line}</p>` : '').join('')}
                    </div>
                </div>

                <div class="testing-instructions">
                    <h4>🧪 Testen der Lösung:</h4>
                    ${generateTestingInstructions(problem.type)}
                </div>
            </div>
        `;
    }

    // Fallback ohne BarrierDetector
    return `
        <div class="fix-instruction-card">
            <h3>🔧 Problem ${index}: ${problem.title}</h3>
            <p><strong>Lösung:</strong> ${problem.solution || 'Keine spezifische Lösung verfügbar'}</p>
        </div>
    `;
}

function generateCurrentCode(problem, elementInfo) {
    const tagName = elementInfo?.tagName?.toLowerCase() || 'div';
    const className = elementInfo?.className ? ` class="${elementInfo.className}"` : '';

    switch (problem.type) {
        case 'MISSING_BUTTON_LABEL':
            if (problem.context?.buttonType === 'CSS-Background-Image-Button') {
                return `<${tagName}${className} style="background-image: url(icon.png); cursor: pointer;">
    <!-- Kein zugänglicher Name! -->
</${tagName}>`;
            }
            return `<${tagName}${className}>
    🔍 <!-- Nur Unicode-Symbol, kein Text -->
</${tagName}>`;

        case 'MISSING_ALT_TEXT':
            return `<img src="wichtiges-bild.jpg"${className}>
<!-- Fehlt: alt-Attribut -->`;

        case 'MISSING_FORM_LABEL':
            return `<input type="email"${className} placeholder="E-Mail eingeben...">
<!-- Fehlt: Label-Verknüpfung -->`;

        default:
            return `<${tagName}${className}>
    ${elementInfo?.text || 'Element-Inhalt'}
</${tagName}>`;
    }
}

function generateFixedCode(problem, elementInfo) {
    const tagName = elementInfo?.tagName?.toLowerCase() || 'div';
    const className = elementInfo?.className ? ` class="${elementInfo.className}"` : '';

    switch (problem.type) {
        case 'MISSING_BUTTON_LABEL':
            if (problem.context?.buttonType === 'CSS-Background-Image-Button') {
                return `<${tagName}${className} role="button" aria-label="Suche starten" tabindex="0" style="background-image: url(icon.png); cursor: pointer;">
    <!-- Zugänglicher Name via aria-label -->
</${tagName}>`;
            }
            return `<button${className} aria-label="Suche starten">
    🔍 <!-- Mit zugänglichem Namen -->
</button>`;

        case 'MISSING_ALT_TEXT':
            return `<img src="wichtiges-bild.jpg"${className} alt="Diagramm zeigt Verkaufszahlen Q1 2024">
<!-- Alt-Text beschreibt Bildinhalt -->`;

        case 'MISSING_FORM_LABEL':
            return `<label for="email-input">E-Mail-Adresse:</label>
<input type="email" id="email-input"${className} placeholder="beispiel@domain.de">
<!-- Label mit for-Attribut verknüpft -->`;

        default:
            return `<${tagName}${className} aria-label="Beschreibender Text">
    ${elementInfo?.text || 'Element-Inhalt'}
</${tagName}>`;
    }
}

function generateTestingInstructions(problemType) {
    const testingMap = {
        'MISSING_BUTTON_LABEL': `
            <ul>
                <li>🎧 <strong>Screenreader-Test:</strong> Aktivieren Sie einen Screenreader (z.B. NVDA) und navigieren Sie zum Button</li>
                <li>⌨️ <strong>Tastatur-Test:</strong> Drücken Sie Tab, um zum Button zu navigieren - er sollte beschrieben werden</li>
                <li>🔍 <strong>Accessibility-Tree:</strong> Prüfen Sie in den Browser-Entwicklertools den "Accessibility"-Tab</li>
            </ul>
        `,
        'MISSING_ALT_TEXT': `
            <ul>
                <li>🎧 <strong>Screenreader-Test:</strong> Screenreader sollte den Alt-Text vorlesen, nicht nur "Bild"</li>
                <li>📱 <strong>Offline-Test:</strong> Deaktivieren Sie Bilder - Alt-Text sollte als Ersatz angezeigt werden</li>
                <li>🔍 <strong>HTML-Validierung:</strong> Prüfen Sie, dass das alt-Attribut vorhanden und ausgefüllt ist</li>
            </ul>
        `,
        'MISSING_FORM_LABEL': `
            <ul>
                <li>🎧 <strong>Screenreader-Test:</strong> Fokus auf Eingabefeld - Label-Text sollte vorgelesen werden</li>
                <li>🖱️ <strong>Klick-Test:</strong> Klick auf Label sollte Eingabefeld fokussieren</li>
                <li>⌨️ <strong>Tab-Navigation:</strong> Feld sollte klar beschrieben werden bei Tab-Navigation</li>
            </ul>
        `,
        'POOR_CONTRAST': `
            <ul>
                <li>🎨 <strong>Kontrast-Tools:</strong> Verwenden Sie einen Kontrastprüfer (z.B. WebAIM Color Contrast Checker)</li>
                <li>☀️ <strong>Sonnenlicht-Test:</strong> Prüfen Sie Lesbarkeit bei hellem Licht</li>
                <li>👓 <strong>Simulation:</strong> Testen Sie mit Farbblindheits-Simulatoren</li>
            </ul>
        `
    };

    return testingMap[problemType] || `
        <ul>
            <li>🧪 <strong>Allgemeiner Test:</strong> Verwenden Sie Accessibility-Tools wie axe oder WAVE</li>
            <li>🎧 <strong>Screenreader:</strong> Testen Sie mit einem kostenlosen Screenreader wie NVDA</li>
        </ul>
    `;
}

function createGeneralFixInstructions() {
    return `
        <div class="general-instruction">
            <h3>🎯 Die wichtigsten Regeln für barrierefreie Websites</h3>

            <div class="rule-card">
                <h4>1. 🖼️ Bilder brauchen Alternativtexte</h4>
                <p>Jedes Bild, das Informationen vermittelt, benötigt ein <code>alt</code>-Attribut.</p>
                <pre><code>&lt;img src="chart.png" alt="Umsatzsteigerung um 15% in Q1 2024"&gt;</code></pre>
            </div>

            <div class="rule-card">
                <h4>2. 🔘 Buttons brauchen verständliche Namen</h4>
                <p>Jeder Button muss für Screenreader-Nutzer verständlich sein.</p>
                <pre><code>&lt;button aria-label="Menü öffnen"&gt;☰&lt;/button&gt;</code></pre>
            </div>

            <div class="rule-card">
                <h4>3. 📝 Formularfelder brauchen Labels</h4>
                <p>Jedes Eingabefeld muss mit einem Label verknüpft sein.</p>
                <pre><code>&lt;label for="email"&gt;E-Mail:&lt;/label&gt;
&lt;input type="email" id="email"&gt;</code></pre>
            </div>

            <div class="rule-card">
                <h4>4. 📖 Überschriften strukturiert verwenden</h4>
                <p>H1 → H2 → H3 in logischer Reihenfolge, keine Level überspringen.</p>
                <pre><code>&lt;h1&gt;Haupttitel&lt;/h1&gt;
&lt;h2&gt;Abschnitt&lt;/h2&gt;
&lt;h3&gt;Unterabschnitt&lt;/h3&gt;</code></pre>
            </div>

            <div class="rule-card">
                <h4>5. 🎨 Ausreichend Kontrast verwenden</h4>
                <p>Mindestens 4.5:1 Kontrast zwischen Text und Hintergrund.</p>
                <p><strong>Gut:</strong> Schwarzer Text auf weißem Hintergrund<br>
                <strong>Schlecht:</strong> Hellgrauer Text auf weißem Hintergrund</p>
            </div>
        </div>
    `;
}

// Event Listener für Buttons
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Help page initialized');
});