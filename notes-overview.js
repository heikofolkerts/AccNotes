// Notes Overview JavaScript
let allNotes = [];
let bitvCategories = [];
let filteredNotesCache = null;
let lastFilterHash = '';

// Performance tracking
const PERFORMANCE_THRESHOLD = 200; // ms

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

    // Update website filter after loading notes
    initializeWebsiteFilter();
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
    const startTime = performance.now();
    const container = document.getElementById('notes-container');

    if (allNotes.length === 0) {
        container.innerHTML = '<div class="no-notes">Keine Notizen gefunden. Erstellen Sie Ihre erste Notiz über das Kontextmenü!</div>';
        return;
    }

    const sortedNotes = getSortedNotes();
    const filteredNotes = getFilteredNotesWithCache(sortedNotes);

    if (filteredNotes.length === 0) {
        container.innerHTML = '<div class="no-notes">Keine Notizen entsprechen den Suchkriterien.</div>';
        return;
    }

    // Virtualization for large datasets
    if (filteredNotes.length > 100) {
        renderNotesVirtualized(container, filteredNotes);
    } else {
        container.innerHTML = filteredNotes.map(note => createNoteHTML(note)).join('');
    }

    const endTime = performance.now();
    if (endTime - startTime > PERFORMANCE_THRESHOLD) {
        console.warn(`Performance warning: displayNotes took ${Math.round(endTime - startTime)}ms for ${filteredNotes.length} notes`);
    }
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

function getFilteredNotesWithCache(notes) {
    const currentFilterHash = generateFilterHash();

    // Return cached result if filters haven't changed
    if (filteredNotesCache !== null && lastFilterHash === currentFilterHash) {
        return filteredNotesCache;
    }

    // Compute new filtered results
    filteredNotesCache = getFilteredNotes(notes);
    lastFilterHash = currentFilterHash;

    return filteredNotesCache;
}

function generateFilterHash() {
    const searchTerm = document.getElementById('search-input').value;
    const categoryFilter = document.getElementById('bitv-category-filter')?.value || '';
    const evaluationFilter = document.getElementById('bitv-evaluation-filter')?.value || '';
    const typeFilter = document.getElementById('notes-type-filter')?.value || '';
    const websiteFilter = document.getElementById('website-filter')?.value || '';
    const sortBy = document.getElementById('sort-select').value;

    return `${searchTerm}|${categoryFilter}|${evaluationFilter}|${typeFilter}|${websiteFilter}|${sortBy}`;
}

function invalidateCache() {
    filteredNotesCache = null;
    lastFilterHash = '';
}

function renderNotesVirtualized(container, notes) {
    const ITEMS_PER_PAGE = 20;
    const currentPage = 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, notes.length);
    const visibleNotes = notes.slice(startIndex, endIndex);

    let html = `<div class="notes-virtualized">`;
    html += `<div class="notes-info">Zeige ${startIndex + 1}-${endIndex} von ${notes.length} Notizen</div>`;
    html += visibleNotes.map(note => createNoteHTML(note)).join('');

    // Add pagination if needed
    if (notes.length > ITEMS_PER_PAGE) {
        html += `<div class="notes-pagination">
            <button onclick="loadMoreNotes()" class="btn btn--secondary">
                Weitere ${Math.min(ITEMS_PER_PAGE, notes.length - endIndex)} Notizen laden
            </button>
        </div>`;
    }

    html += `</div>`;
    container.innerHTML = html;
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

    // Website filter
    const websiteFilter = document.getElementById('website-filter')?.value;
    if (websiteFilter) {
        filtered = filtered.filter(note => {
            if (!note.url) return false;
            try {
                return new URL(note.url).hostname === websiteFilter;
            } catch (e) {
                return note.url === websiteFilter;
            }
        });
    }

    return filtered;
}

function sortNotes() {
    invalidateCache();
    displayNotes();
}

function filterNotes() {
    invalidateCache();
    displayNotes();
}

function refreshNotes() {
    invalidateCache();
    loadNotes();
}

function loadMoreNotes() {
    // This would be implemented for real pagination
    // For now, show more items
    displayNotes();
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
    const filteredNotes = getFilteredNotes(getSortedNotes());

    if (filteredNotes.length === 0) {
        alert('Keine Notizen entsprechen den aktuellen Filterkriterien.');
        return;
    }

    let csvContent = 'Datum,Zeit,Seite,URL,Element-Typ,BITV-Prüfschritt,BITV-Bewertung,Dateiname,Notiz-Inhalt\n';

    filteredNotes.forEach(note => {
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
            escapeCsv(note.bitvTest ? `${note.bitvTest.stepId} - ${note.bitvTest.stepTitle}` : ''),
            escapeCsv(note.bitvTest ? note.bitvTest.evaluation || '' : ''),
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
    initializeWebsiteFilter();
}

function initializeWebsiteFilter() {
    const websiteFilter = document.getElementById('website-filter');
    if (!websiteFilter) return;

    // Clear existing options except the first "All websites"
    while (websiteFilter.children.length > 1) {
        websiteFilter.removeChild(websiteFilter.lastChild);
    }

    // Get unique websites from all notes
    const websites = new Set();
    allNotes.forEach(note => {
        if (note.url) {
            try {
                const hostname = new URL(note.url).hostname;
                websites.add(hostname);
            } catch (e) {
                websites.add(note.url); // fallback for invalid URLs
            }
        }
    });

    // Sort websites alphabetically
    const sortedWebsites = Array.from(websites).sort();

    sortedWebsites.forEach(website => {
        const option = document.createElement('option');
        option.value = website;
        option.textContent = website;
        websiteFilter.appendChild(option);
    });
}

function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('bitv-category-filter').value = '';
    document.getElementById('bitv-evaluation-filter').value = '';
    document.getElementById('notes-type-filter').value = '';
    document.getElementById('website-filter').value = '';
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

    // Group notes by category and website
    const categoryStats = {};
    const websiteStats = {};
    const overallStats = { passed: 0, failed: 0, partial: 0, needs_review: 0, total: 0 };

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
        const evaluation = note.bitvTest.evaluation || 'needs_review';
        const url = new URL(note.url || 'https://unknown.com').hostname;

        // Category stats
        if (categoryStats[category]) {
            categoryStats[category].total++;
            categoryStats[category][evaluation]++;
        }

        // Website stats
        if (!websiteStats[url]) {
            websiteStats[url] = { passed: 0, failed: 0, partial: 0, needs_review: 0, total: 0 };
        }
        websiteStats[url][evaluation]++;
        websiteStats[url].total++;

        // Overall stats
        overallStats[evaluation]++;
        overallStats.total++;
    });

    // Generate dashboard HTML
    let dashboardHTML = '<div class="bitv-progress">';

    // Overall compliance score
    const overallPassedPercentage = overallStats.total > 0 ? Math.round((overallStats.passed / overallStats.total) * 100) : 0;
    const complianceScore = Math.round(((overallStats.passed + overallStats.partial * 0.5) / overallStats.total) * 100);

    dashboardHTML += `
        <div class="bitv-overall-stats">
            <div class="bitv-overall__title">🎯 Gesamtfortschritt (${overallStats.total} Prüfschritte)</div>
            <div class="bitv-overall__score">
                <div class="bitv-score-circle">
                    <div class="bitv-score-circle__text">${complianceScore}%</div>
                    <div class="bitv-score-circle__label">BITV-Compliance</div>
                </div>
                <div class="bitv-overall__breakdown">
                    <div class="bitv-stat">✅ ${overallStats.passed} bestanden (${Math.round((overallStats.passed / overallStats.total) * 100)}%)</div>
                    <div class="bitv-stat">❌ ${overallStats.failed} nicht bestanden (${Math.round((overallStats.failed / overallStats.total) * 100)}%)</div>
                    <div class="bitv-stat">⚠️ ${overallStats.partial} teilweise (${Math.round((overallStats.partial / overallStats.total) * 100)}%)</div>
                    <div class="bitv-stat">📝 ${overallStats.needs_review} zu überprüfen (${Math.round((overallStats.needs_review / overallStats.total) * 100)}%)</div>
                </div>
            </div>
        </div>
    `;

    // Top problematic websites
    const problemWebsites = Object.entries(websiteStats)
        .map(([url, stats]) => ({
            url,
            failureRate: Math.round((stats.failed / stats.total) * 100),
            total: stats.total,
            failed: stats.failed
        }))
        .filter(site => site.failed > 0)
        .sort((a, b) => b.failureRate - a.failureRate)
        .slice(0, 5);

    if (problemWebsites.length > 0) {
        dashboardHTML += `
            <div class="bitv-problem-sites">
                <div class="bitv-problem-sites__title">🚨 Websites mit den meisten Problemen</div>
                <div class="bitv-problem-sites__list">
        `;

        problemWebsites.forEach(site => {
            dashboardHTML += `
                <div class="bitv-problem-site">
                    <span class="bitv-problem-site__url">${site.url}</span>
                    <span class="bitv-problem-site__stats">${site.failed}/${site.total} nicht bestanden (${site.failureRate}%)</span>
                </div>
            `;
        });

        dashboardHTML += `
                </div>
            </div>
        `;
    }

    // Category breakdown
    Object.keys(categoryStats).forEach(categoryId => {
        const stats = categoryStats[categoryId];
        if (stats.total === 0) return;

        const passedPercentage = Math.round((stats.passed / stats.total) * 100);
        const categoryCompliance = Math.round(((stats.passed + stats.partial * 0.5) / stats.total) * 100);

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
                    <div class="bitv-progress-bar__percentage">${categoryCompliance}%</div>
                </div>
            </div>
        `;
    });

    dashboardHTML += '</div>';
    container.innerHTML = dashboardHTML;
}

function exportBitvReport() {
    // Export filtered notes instead of all BITV notes
    const filteredNotes = getFilteredNotes(getSortedNotes());
    const bitvNotes = filteredNotes.filter(note => note.bitvTest);

    if (bitvNotes.length === 0) {
        alert('Keine BITV-Notizen entsprechen den aktuellen Filterkriterien.');
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

function exportFilteredNotes() {
    const filteredNotes = getFilteredNotes(getSortedNotes());

    if (filteredNotes.length === 0) {
        alert('Keine Notizen entsprechen den aktuellen Filterkriterien.');
        return;
    }

    let exportContent = `GEFILTERTE BARRIEREFREIHEITS-NOTIZEN EXPORT\n`;
    exportContent += `Erstellt am: ${new Date().toLocaleString('de-DE')}\n`;
    exportContent += `Anzahl Notizen: ${filteredNotes.length} (von ${allNotes.length} gesamt)\n`;

    const activeFilters = getActiveFilters();
    if (activeFilters.length > 0) {
        exportContent += `Aktive Filter: ${activeFilters.join(', ')}\n`;
    }

    exportContent += `${'='.repeat(50)}\n\n`;

    filteredNotes.forEach((note, index) => {
        exportContent += `NOTIZ ${index + 1}\n`;
        exportContent += `Datei: ${note.fileName || 'unbekannt'}\n`;
        exportContent += `Datum: ${new Date(note.timestamp).toLocaleString('de-DE')}\n`;
        exportContent += `Seite: ${note.title || 'Unbekannt'}\n`;
        exportContent += `URL: ${note.url || 'Unbekannt'}\n`;
        exportContent += `Element: ${note.elementType || 'Unbekannt'}\n`;

        if (note.bitvTest) {
            const evaluationTexts = {
                passed: '✅ Bestanden',
                failed: '❌ Nicht bestanden',
                partial: '⚠️ Teilweise bestanden',
                needs_review: '📝 Zu überprüfen'
            };
            exportContent += `BITV-Prüfschritt: ${note.bitvTest.stepId} - ${note.bitvTest.stepTitle}\n`;
            exportContent += `Bewertung: ${evaluationTexts[note.bitvTest.evaluation] || evaluationTexts.needs_review}\n`;
            exportContent += `Kategorie: ${note.bitvTest.category}\n`;
        }

        exportContent += `-`.repeat(30) + '\n';
        exportContent += note.content || 'Kein Inhalt';
        exportContent += '\n\n' + '='.repeat(50) + '\n\n';
    });

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `filtered-accessibility-notes-${new Date().toISOString().split('T')[0]}.txt`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function getActiveFilters() {
    const filters = [];

    const searchTerm = document.getElementById('search-input').value;
    if (searchTerm) filters.push(`Suche: "${searchTerm}"`);

    const categoryFilter = document.getElementById('bitv-category-filter')?.value;
    if (categoryFilter) {
        const category = bitvCategories.find(cat => cat.id === categoryFilter);
        filters.push(`Kategorie: ${category ? category.title : categoryFilter}`);
    }

    const evaluationFilter = document.getElementById('bitv-evaluation-filter')?.value;
    if (evaluationFilter) {
        const evaluationTexts = {
            passed: 'Bestanden',
            failed: 'Nicht bestanden',
            partial: 'Teilweise bestanden',
            needs_review: 'Zu überprüfen'
        };
        filters.push(`Bewertung: ${evaluationTexts[evaluationFilter] || evaluationFilter}`);
    }

    const typeFilter = document.getElementById('notes-type-filter')?.value;
    if (typeFilter) {
        const typeTexts = { bitv: 'Nur BITV-Tests', general: 'Nur allgemeine Notizen' };
        filters.push(`Typ: ${typeTexts[typeFilter] || typeFilter}`);
    }

    const sortBy = document.getElementById('sort-select').value;
    if (sortBy !== 'newest') {
        const sortTexts = {
            oldest: 'Älteste zuerst',
            page: 'Nach Seite',
            'bitv-step': 'Nach BITV-Prüfschritt',
            evaluation: 'Nach Bewertung'
        };
        filters.push(`Sortierung: ${sortTexts[sortBy] || sortBy}`);
    }

    return filters;
}

function bulkDeleteFiltered() {
    const filteredNotes = getFilteredNotes(getSortedNotes());

    if (filteredNotes.length === 0) {
        alert('Keine Notizen entsprechen den aktuellen Filterkriterien.');
        return;
    }

    const activeFilters = getActiveFilters();
    let message = `Möchten Sie wirklich ${filteredNotes.length} gefilterte Notizen löschen?\n\n`;

    if (activeFilters.length > 0) {
        message += `Aktive Filter:\n${activeFilters.join('\n')}\n\n`;
    }

    message += 'Diese Aktion kann nicht rückgängig gemacht werden!';

    if (confirm(message)) {
        filteredNotes.forEach(note => {
            localStorage.removeItem(note.id);
        });
        loadNotes();
        alert(`${filteredNotes.length} Notizen wurden gelöscht.`);
    }
}