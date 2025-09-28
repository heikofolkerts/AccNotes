// Cross-Browser-API
const browserAPI = (typeof chrome !== 'undefined' && chrome.runtime) ? chrome : browser;

// URL-Parameter auslesen
const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get('mode');
const problemsParam = urlParams.get('problems');

console.log('🆘 Help page loaded with mode:', mode);

// Problemspezifische Erklärungen laden
if (mode === 'explain' && problemsParam) {
    try {
        const problems = JSON.parse(problemsParam);
        console.log('📋 Explaining problems:', problems);
        displayProblemExplanations(problems);
    } catch (error) {
        console.error('❌ Error parsing problems:', error);
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

// Event Listener für Buttons
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Help page initialized');
});