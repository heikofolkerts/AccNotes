// Notes Overview JavaScript
let allNotes = [];
let bitvCategories = [];

// Lade alle Notizen beim Seitenstart
document.addEventListener('DOMContentLoaded', function() {
    // Initialize BITV categories if BitvCatalog is available
    if (typeof BitvCatalog !== 'undefined') {
        bitvCategories = BitvCatalog.getCategories();
        initializeBitvFilters();
    }
    loadNotes();
});

function loadNotes() {
    allNotes = [];

    // Durchlaufe alle localStorage Items
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('note_')) {
            try {
                const noteData = JSON.parse(localStorage.getItem(key));
                noteData.id = key;
                allNotes.push(noteData);
            } catch (e) {
                // Fallback für alte Notizen (nur String-Inhalt)
                const content = localStorage.getItem(key);
                if (content && typeof content === 'string' && !content.startsWith('{')) {
                    const noteData = {
                        id: key,
                        content: content,
                        timestamp: new Date(parseInt(key.replace('note_', ''))).toISOString(),
                        url: 'Unbekannt',
                        title: 'Alte Notiz',
                        elementType: 'Unbekannt',
                        fileName: 'legacy-note.txt'
                    };
                    allNotes.push(noteData);
                }
            }
        }
    }

    updateStats();
    displayNotes();
}

function updateStats() {
    const totalNotes = allNotes.length;
    const today = new Date().toDateString();
    const notesToday = allNotes.filter(note =>
        new Date(note.timestamp).toDateString() === today
    ).length;

    const uniquePages = new Set(allNotes.map(note => note.url)).size;

    // BITV-specific stats
    const bitvNotes = allNotes.filter(note => note.bitvTest).length;
    const failedTests = allNotes.filter(note =>
        note.bitvTest && note.bitvTest.evaluation === 'failed'
    ).length;

    document.getElementById('total-notes').textContent = totalNotes;
    document.getElementById('notes-today').textContent = notesToday;
    document.getElementById('unique-pages').textContent = uniquePages;
    document.getElementById('bitv-notes').textContent = bitvNotes;
    document.getElementById('failed-tests').textContent = failedTests;

    // Update BITV dashboard
    updateBitvDashboard();
}

function displayNotes() {
    const container = document.getElementById('notes-container');

    if (allNotes.length === 0) {
        container.innerHTML = '<div class="no-notes">Keine Notizen gefunden. Erstellen Sie Ihre erste Notiz über das Kontextmenü!</div>';
        return;
    }

    const sortedNotes = getSortedNotes();
    const filteredNotes = getFilteredNotes(sortedNotes);

    if (filteredNotes.length === 0) {
        container.innerHTML = '<div class="no-notes">Keine Notizen entsprechen den Suchkriterien.</div>';
        return;
    }

    container.innerHTML = filteredNotes.map(note => createNoteHTML(note)).join('');
}

function createNoteHTML(note) {
    const date = new Date(note.timestamp);
    const formattedDate = date.toLocaleDateString('de-DE') + ' ' + date.toLocaleTimeString('de-DE');

    // BITV-specific styling and info
    const isBitvNote = note.bitvTest;
    const bitvClass = isBitvNote ? `note-item--bitv note-item--${note.bitvTest.evaluation || 'needs_review'}` : '';

    let bitvInfo = '';
    if (isBitvNote) {
        const evaluationTexts = {
            passed: '✅ Bestanden',
            failed: '❌ Nicht bestanden',
            partial: '⚠️ Teilweise bestanden',
            needs_review: '📝 Zu überprüfen'
        };

        bitvInfo = `
            <div class="bitv-note-info">
                <span class="bitv-step-badge">
                    📋 ${note.bitvTest.stepId} - ${note.bitvTest.stepTitle}
                </span>
                <span class="bitv-evaluation-badge bitv-evaluation-badge--${note.bitvTest.evaluation}">
                    ${evaluationTexts[note.bitvTest.evaluation] || evaluationTexts.needs_review}
                </span>
            </div>
        `;
    }

    return `
        <div class="note-item ${bitvClass}">
            <div class="note-header">
                <div class="note-info">
                    <div class="note-title">${note.title || note.pageTitle || 'Unbekannte Seite'}</div>
                    <div class="note-url">${note.url || 'Keine URL'}</div>
                    <div class="note-meta">📅 ${formattedDate} | 🎯 ${note.element?.type || note.elementType || 'Element'}</div>
                    ${bitvInfo}
                </div>
                <div class="note-actions">
                    <button onclick="downloadNote('${note.id}')">📥 Download</button>
                    <button onclick="deleteNote('${note.id}')" class="delete">🗑️ Löschen</button>
                </div>
            </div>
            <div class="note-content">${escapeHtml(note.content || 'Kein Inhalt')}</div>
        </div>
    `;
}

function getSortedNotes() {
    const sortBy = document.getElementById('sort-select').value;
    const sorted = [...allNotes];

    switch (sortBy) {
        case 'newest':
            return sorted.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        case 'oldest':
            return sorted.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        case 'page':
            return sorted.sort((a, b) => (a.title || a.pageTitle || '').localeCompare(b.title || b.pageTitle || ''));
        case 'bitv-step':
            return sorted.sort((a, b) => {
                const aStep = a.bitvTest ? a.bitvTest.stepId : 'zzz';
                const bStep = b.bitvTest ? b.bitvTest.stepId : 'zzz';
                return aStep.localeCompare(bStep);
            });
        case 'evaluation':
            return sorted.sort((a, b) => {
                const evaluationOrder = { 'failed': 0, 'partial': 1, 'needs_review': 2, 'passed': 3 };
                const aEval = a.bitvTest ? evaluationOrder[a.bitvTest.evaluation] ?? 4 : 5;
                const bEval = b.bitvTest ? evaluationOrder[b.bitvTest.evaluation] ?? 4 : 5;
                return aEval - bEval;
            });
        default:
            return sorted;
    }
}

function getFilteredNotes(notes) {
    let filtered = notes;

    // Text search
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(note =>
            (note.content || '').toLowerCase().includes(searchTerm) ||
            (note.title || '').toLowerCase().includes(searchTerm) ||
            (note.pageTitle || '').toLowerCase().includes(searchTerm) ||
            (note.url || '').toLowerCase().includes(searchTerm) ||
            (note.elementType || '').toLowerCase().includes(searchTerm) ||
            (note.element?.type || '').toLowerCase().includes(searchTerm) ||
            (note.bitvTest?.stepTitle || '').toLowerCase().includes(searchTerm) ||
            (note.bitvTest?.stepId || '').toLowerCase().includes(searchTerm)
        );
    }

    // BITV Category filter
    const categoryFilter = document.getElementById('bitv-category-filter')?.value;
    if (categoryFilter) {
        filtered = filtered.filter(note =>
            note.bitvTest && note.bitvTest.category === categoryFilter
        );
    }

    // BITV Evaluation filter
    const evaluationFilter = document.getElementById('bitv-evaluation-filter')?.value;
    if (evaluationFilter) {
        filtered = filtered.filter(note =>
            note.bitvTest && note.bitvTest.evaluation === evaluationFilter
        );
    }

    // Notes type filter
    const typeFilter = document.getElementById('notes-type-filter')?.value;
    if (typeFilter === 'bitv') {
        filtered = filtered.filter(note => note.bitvTest);
    } else if (typeFilter === 'general') {
        filtered = filtered.filter(note => !note.bitvTest);
    }

    return filtered;
}

function sortNotes() {
    displayNotes();
}

function filterNotes() {
    displayNotes();
}

function refreshNotes() {
    loadNotes();
}

function deleteNote(noteId) {
    if (confirm('Möchten Sie diese Notiz wirklich löschen?')) {
        localStorage.removeItem(noteId);
        loadNotes();
    }
}

function downloadNote(noteId) {
    const note = allNotes.find(n => n.id === noteId);
    if (!note) return;

    const blob = new Blob([note.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = note.fileName || `note-${noteId}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportAllNotes() {
    if (allNotes.length === 0) {
        alert('Keine Notizen zum Exportieren vorhanden.');
        return;
    }

    // Erstelle ZIP-ähnliche Struktur (als Text-Sammlung)
    let exportContent = `BARRIEREFREIHEITS-NOTIZEN EXPORT\n`;
    exportContent += `Erstellt am: ${new Date().toLocaleString('de-DE')}\n`;
    exportContent += `Anzahl Notizen: ${allNotes.length}\n`;
    exportContent += `${'='.repeat(50)}\n\n`;

    allNotes.forEach((note, index) => {
        exportContent += `NOTIZ ${index + 1}\n`;
        exportContent += `Datei: ${note.fileName || 'unbekannt'}\n`;
        exportContent += `Datum: ${new Date(note.timestamp).toLocaleString('de-DE')}\n`;
        exportContent += `Seite: ${note.title || 'Unbekannt'}\n`;
        exportContent += `URL: ${note.url || 'Unbekannt'}\n`;
        exportContent += `Element: ${note.elementType || 'Unbekannt'}\n`;
        exportContent += `-`.repeat(30) + '\n';
        exportContent += note.content || 'Kein Inhalt';
        exportContent += '\n\n' + '='.repeat(50) + '\n\n';
    });

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-notes-export-${new Date().toISOString().split('T')[0]}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportNotesAsCSV() {
    if (allNotes.length === 0) {
        alert('Keine Notizen zum Exportieren vorhanden.');
        return;
    }

    let csvContent = 'Datum,Zeit,Seite,URL,Element-Typ,Dateiname,Notiz-Inhalt\n';

    allNotes.forEach(note => {
        const date = new Date(note.timestamp);
        const dateStr = date.toLocaleDateString('de-DE');
        const timeStr = date.toLocaleTimeString('de-DE');

        // CSV-Escape für Anführungszeichen und Kommas
        const escapeCsv = (text) => {
            if (!text) return '';
            return '"' + text.replace(/"/g, '""') + '"';
        };

        csvContent += [
            dateStr,
            timeStr,
            escapeCsv(note.title || ''),
            escapeCsv(note.url || ''),
            escapeCsv(note.elementType || ''),
            escapeCsv(note.fileName || ''),
            escapeCsv(note.content || '')
        ].join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-notes-${new Date().toISOString().split('T')[0]}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearAllNotes() {
    if (confirm('Möchten Sie wirklich ALLE Notizen löschen? Diese Aktion kann nicht rückgängig gemacht werden!')) {
        // Lösche alle note_* Einträge
        const keysToDelete = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('note_')) {
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => localStorage.removeItem(key));
        loadNotes();
        alert('Alle Notizen wurden gelöscht.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// BITV-specific functions
function initializeBitvFilters() {
    const categoryFilter = document.getElementById('bitv-category-filter');
    if (categoryFilter && bitvCategories) {
        bitvCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.title;
            categoryFilter.appendChild(option);
        });
    }
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('bitv-category-filter').value = '';
    document.getElementById('bitv-evaluation-filter').value = '';
    document.getElementById('notes-type-filter').value = '';
    document.getElementById('sort-select').value = 'newest';
    displayNotes();
}

function updateBitvDashboard() {
    const bitvNotes = allNotes.filter(note => note.bitvTest);
    const dashboard = document.getElementById('bitv-dashboard');
    const container = document.getElementById('bitv-progress-container');

    if (bitvNotes.length === 0) {
        dashboard.style.display = 'none';
        return;
    }

    dashboard.style.display = 'block';

    // Group notes by category
    const categoryStats = {};
    bitvCategories.forEach(category => {
        categoryStats[category.id] = {
            title: category.title,
            total: 0,
            passed: 0,
            failed: 0,
            partial: 0,
            needs_review: 0
        };
    });

    bitvNotes.forEach(note => {
        const category = note.bitvTest.category;
        if (categoryStats[category]) {
            categoryStats[category].total++;
            const evaluation = note.bitvTest.evaluation || 'needs_review';
            categoryStats[category][evaluation]++;
        }
    });

    // Generate dashboard HTML
    let dashboardHTML = '<div class="bitv-progress">';

    Object.keys(categoryStats).forEach(categoryId => {
        const stats = categoryStats[categoryId];
        if (stats.total === 0) return;

        const passedPercentage = Math.round((stats.passed / stats.total) * 100);
        const failedPercentage = Math.round((stats.failed / stats.total) * 100);
        const partialPercentage = Math.round((stats.partial / stats.total) * 100);

        dashboardHTML += `
            <div class="bitv-category">
                <div class="bitv-category__title">${stats.title}</div>
                <div class="bitv-progress-bar">
                    <div class="bitv-progress-bar__info">
                        <div class="bitv-progress-bar__label">Fortschritt (${stats.total} Prüfschritte)</div>
                        <div class="bitv-progress-bar__track">
                            <div class="bitv-progress-bar__fill bitv-progress-bar__fill--passed" style="width: ${passedPercentage}%"></div>
                        </div>
                        <div class="bitv-progress-bar__stats">
                            <span>✅ ${stats.passed} bestanden</span>
                            <span>❌ ${stats.failed} nicht bestanden</span>
                            <span>⚠️ ${stats.partial} teilweise</span>
                            <span>📝 ${stats.needs_review} zu überprüfen</span>
                        </div>
                    </div>
                    <div class="bitv-progress-bar__percentage">${passedPercentage}%</div>
                </div>
            </div>
        `;
    });

    dashboardHTML += '</div>';
    container.innerHTML = dashboardHTML;
}

function exportBitvReport() {
    const bitvNotes = allNotes.filter(note => note.bitvTest);

    if (bitvNotes.length === 0) {
        alert('Keine BITV-Notizen zum Exportieren vorhanden.');
        return;
    }

    let reportContent = `BITV-SOFTWARETEST BERICHT\n`;
    reportContent += `Erstellt am: ${new Date().toLocaleString('de-DE')}\n`;
    reportContent += `Anzahl geprüfte Elemente: ${bitvNotes.length}\n`;
    reportContent += `${'='.repeat(60)}\n\n`;

    // Summary by category
    const categoryStats = {};
    bitvCategories.forEach(category => {
        categoryStats[category.id] = {
            title: category.title,
            notes: bitvNotes.filter(note => note.bitvTest.category === category.id)
        };
    });

    Object.keys(categoryStats).forEach(categoryId => {
        const category = categoryStats[categoryId];
        if (category.notes.length === 0) return;

        reportContent += `KATEGORIE: ${category.title.toUpperCase()}\n`;
        reportContent += `${'-'.repeat(40)}\n`;

        category.notes.forEach(note => {
            const evaluationTexts = {
                passed: '✅ BESTANDEN',
                failed: '❌ NICHT BESTANDEN',
                partial: '⚠️ TEILWEISE BESTANDEN',
                needs_review: '📝 ZU ÜBERPRÜFEN'
            };

            reportContent += `\nPrüfschritt: ${note.bitvTest.stepId} - ${note.bitvTest.stepTitle}\n`;
            reportContent += `Bewertung: ${evaluationTexts[note.bitvTest.evaluation] || evaluationTexts.needs_review}\n`;
            reportContent += `URL: ${note.url}\n`;
            reportContent += `Element: ${note.element?.type || note.elementType || 'Unbekannt'}\n`;
            reportContent += `Beschreibung: ${note.content}\n`;
            if (note.recommendation) {
                reportContent += `Empfehlung: ${note.recommendation}\n`;
            }
            reportContent += `-`.repeat(30) + '\n';
        });

        reportContent += '\n';
    });

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `bitv-softwaretest-bericht-${new Date().toISOString().split('T')[0]}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}