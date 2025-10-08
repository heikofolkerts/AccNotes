// Notes Overview JavaScript
let allNotes = [];
let bitvCategories = [];
let filteredNotesCache = null;
let lastFilterHash = '';
let selectedNotes = new Set(); // IDs der ausgewählten Notizen

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
    initializeBulkSelection();
    initializeEmailTemplate();
    initializeEventListeners();
});

async function loadNotes() {
    allNotes = [];

    try {
        // Erste Migration von localStorage, falls vorhanden
        if (typeof StorageHelper !== 'undefined') {
            await StorageHelper.migrateFromLocalStorage();

            // Lade alle Notizen aus chrome.storage
            allNotes = await StorageHelper.loadAllNotes();
        } else {
            // Fallback zu localStorage (Development/Fallback)
            console.warn('StorageHelper nicht verfügbar, verwende localStorage als Fallback');
            loadNotesFromLocalStorage();
        }

        console.log(`${allNotes.length} Notizen geladen`);

        // Update website filter after loading notes
        initializeWebsiteFilter();
        updateStats();
        updateStorageStats();
        displayNotes();
    } catch (error) {
        console.error('Fehler beim Laden der Notizen:', error);

        // Fallback zu localStorage bei Fehlern
        loadNotesFromLocalStorage();
    }
}

// Fallback-Funktion für localStorage (Backward-Kompatibilität)
function loadNotesFromLocalStorage() {
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

    // Update UI
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
        updateBulkActionButton();
        return;
    }

    const sortedNotes = getSortedNotes();
    const filteredNotes = getFilteredNotesWithCache(sortedNotes);

    if (filteredNotes.length === 0) {
        container.innerHTML = '<div class="no-notes">Keine Notizen entsprechen den Suchkriterien.</div>';
        updateBulkActionButton();
        return;
    }

    // Virtualization for large datasets
    if (filteredNotes.length > 100) {
        renderNotesVirtualized(container, filteredNotes);
    } else {
        container.innerHTML = filteredNotes.map(note => createNoteHTML(note)).join('');
    }

    // Update bulk selection UI (NACH dem DOM-Update!)
    updateCheckboxStates();  // Individuelle Checkboxen synchronisieren
    updateSelectAllCheckbox();  // "Alle auswählen" Checkbox aktualisieren
    updateBulkActionButton();

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

    // Status-Badge
    const statusTexts = {
        draft: '📝 Entwurf',
        reported: '📧 Gemeldet',
        in_arbitration: '⚖️ In Schlichtung',
        resolved: '✅ Behoben'
    };
    const statusBadge = note.status ? `<span class="status-badge status-badge--${note.status}">${statusTexts[note.status] || statusTexts.draft}</span>` : '';

    // Checkbox für Bulk-Selection
    const isSelected = selectedNotes.has(note.id);
    const checkboxHtml = `
        <div class="note-checkbox">
            <label class="checkbox-label">
                <input type="checkbox"
                       class="checkbox-input note-checkbox-input"
                       data-note-id="${note.id}"
                       ${isSelected ? 'checked' : ''}
                       aria-label="Notiz auswählen: ${note.title || note.pageTitle || 'Unbekannte Seite'}">
                <span class="checkbox-indicator" aria-hidden="true"></span>
            </label>
        </div>
    `;

    return `
        <div class="note-item ${bitvClass}" data-note-id="${note.id}">
            ${checkboxHtml}
            <div class="note-item-content">
                <div class="note-header">
                    <div class="note-info">
                        <div class="note-title">${note.title || note.pageTitle || 'Unbekannte Seite'} ${statusBadge} ${note.screenshotDataUrl ? '<span role="img" aria-label="Mit Screenshot">📷</span>' : ''}</div>
                        <div class="note-url">${note.url || 'Keine URL'}</div>
                        <div class="note-meta">📅 ${formattedDate} | 🎯 ${note.element?.type || note.elementType || 'Element'} ${note.screenshotDataUrl ? '| 📷 Screenshot vorhanden' : ''}</div>
                        ${bitvInfo}
                    </div>
                    <div class="note-actions">
                        <button onclick="downloadNote('${note.id}')">📥 Download</button>
                        <button onclick="deleteNote('${note.id}')" class="delete">🗑️ Löschen</button>
                    </div>
                </div>
                <div class="note-content">${escapeHtml(note.content || 'Kein Inhalt')}</div>
            </div>
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
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const sortBy = document.getElementById('sort-select').value;

    return `${searchTerm}|${categoryFilter}|${evaluationFilter}|${typeFilter}|${websiteFilter}|${statusFilter}|${sortBy}`;
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

    // Status filter
    const statusFilter = document.getElementById('status-filter')?.value;
    if (statusFilter) {
        if (statusFilter === 'unreported') {
            // "Nicht gemeldete" = Entwürfe + Behobene (alles außer "reported")
            filtered = filtered.filter(note =>
                note.status !== 'reported'
            );
        } else {
            // Spezifischer Status (draft, reported, resolved)
            filtered = filtered.filter(note =>
                note.status === statusFilter
            );
        }
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

async function deleteNote(noteId) {
    if (confirm('Möchten Sie diese Notiz wirklich löschen?')) {
        try {
            if (typeof StorageHelper !== 'undefined') {
                await StorageHelper.deleteNote(noteId);
            } else {
                localStorage.removeItem(noteId);
            }
            loadNotes();
        } catch (error) {
            console.error('Fehler beim Löschen der Notiz:', error);
            alert('Fehler beim Löschen der Notiz. Bitte versuchen Sie es erneut.');
        }
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

async function clearAllNotes() {
    if (confirm('Möchten Sie wirklich ALLE Notizen löschen? Diese Aktion kann nicht rückgängig gemacht werden!')) {
        try {
            if (typeof StorageHelper !== 'undefined') {
                await StorageHelper.clearAllNotes();
            } else {
                // Fallback: localStorage
                const keysToDelete = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('note_')) {
                        keysToDelete.push(key);
                    }
                }
                keysToDelete.forEach(key => localStorage.removeItem(key));
            }

            loadNotes();
            alert('Alle Notizen wurden gelöscht.');
        } catch (error) {
            console.error('Fehler beim Löschen aller Notizen:', error);
            alert('Fehler beim Löschen der Notizen. Bitte versuchen Sie es erneut.');
        }
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
    document.getElementById('status-filter').value = '';
    document.getElementById('sort-select').value = 'newest';
    invalidateCache();
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

async function updateStorageStats() {
    if (typeof StorageHelper === 'undefined') {
        document.getElementById('storage-stats').style.display = 'none';
        return;
    }

    try {
        const stats = await StorageHelper.getStorageStats();
        if (stats) {
            document.getElementById('storage-stats').style.display = 'block';
            document.getElementById('storage-usage').textContent =
                `${stats.totalSizeKB} KB von ${stats.maxSizeKB} KB (${stats.usagePercent}%)`;

            const statusElement = document.getElementById('storage-status');
            if (stats.usagePercent > 80) {
                statusElement.textContent = '⚠️ Speicher fast voll';
                statusElement.style.color = 'var(--error, #dc2626)';
            } else {
                const browserInfo = StorageHelper.browserInfo || 'Browser Storage';
                statusElement.textContent = `✅ ${browserInfo}`;
                statusElement.style.color = 'var(--success, #059669)';
            }
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Storage-Statistiken:', error);
        document.getElementById('storage-stats').style.display = 'none';
    }
}

function exportBitvReport() {
    try {
        console.log('exportBitvReport() aufgerufen');

        // Export filtered notes instead of all BITV notes
        const filteredNotes = getFilteredNotes(getSortedNotes());
        console.log('Gefilterte Notizen:', filteredNotes.length);

        const bitvNotes = filteredNotes.filter(note => note.bitvTest);
        console.log('BITV-Notizen:', bitvNotes.length);

        if (bitvNotes.length === 0) {
            alert('Keine BITV-Notizen entsprechen den aktuellen Filterkriterien.\n\nHinweis: Stellen Sie sicher, dass mindestens eine Notiz einen BITV-Prüfschritt zugeordnet hat.');
            return;
        }

        console.log('bitvCategories verfügbar:', bitvCategories?.length || 0);

    let reportContent = `BITV-SOFTWARETEST BERICHT\n`;
    reportContent += `Erstellt am: ${new Date().toLocaleString('de-DE')}\n`;
    reportContent += `Anzahl geprüfte Elemente: ${bitvNotes.length}\n`;
    reportContent += `${'='.repeat(60)}\n\n`;

    // Summary by category
    const categoryStats = {};

    // Fallback: Wenn bitvCategories nicht geladen ist, verwende BitvCatalog direkt
    const categories = bitvCategories?.length > 0 ? bitvCategories : (typeof BitvCatalog !== 'undefined' ? BitvCatalog.getCategories() : []);

    if (categories.length === 0) {
        console.error('Keine BITV-Kategorien verfügbar');
        alert('Fehler: BITV-Katalog konnte nicht geladen werden. Bitte Seite neu laden.');
        return;
    }

    categories.forEach(category => {
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

        console.log('BITV-Bericht erfolgreich exportiert');
    } catch (error) {
        console.error('Fehler beim Export des BITV-Berichts:', error);
        alert('Fehler beim Export des BITV-Berichts:\n' + error.message + '\n\nBitte öffnen Sie die Browser-Konsole für Details.');
    }
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

    const statusFilter = document.getElementById('status-filter')?.value;
    if (statusFilter) {
        const statusTexts = {
            draft: 'Entwürfe',
            reported: 'Gemeldete',
            resolved: 'Behobene',
            unreported: 'Nicht gemeldete (Entwurf + Behoben)'
        };
        filters.push(`Status: ${statusTexts[statusFilter] || statusFilter}`);
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

async function bulkDeleteFiltered() {
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
        try {
            if (typeof StorageHelper !== 'undefined') {
                // Parallel löschen für bessere Performance
                await Promise.all(filteredNotes.map(note => StorageHelper.deleteNote(note.id)));
            } else {
                // Fallback: localStorage
                filteredNotes.forEach(note => {
                    localStorage.removeItem(note.id);
                });
            }

            loadNotes();
            alert(`${filteredNotes.length} Notizen wurden gelöscht.`);
        } catch (error) {
            console.error('Fehler beim Bulk-Löschen:', error);
            alert('Fehler beim Löschen einiger Notizen. Bitte versuchen Sie es erneut.');
        }
    }
}

// ============================================
// Bulk Selection Functions
// ============================================

function initializeBulkSelection() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    const bulkActionButton = document.getElementById('bulk-action-button');
    const bulkActionHtmlButton = document.getElementById('bulk-action-html-button');

    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAllChange);
    }

    if (bulkActionButton) {
        bulkActionButton.addEventListener('click', handleBulkExportPDF);
    }

    if (bulkActionHtmlButton) {
        bulkActionHtmlButton.addEventListener('click', handleBulkExportHTML);
    }

    // Event-Delegation für individuelle Checkboxen
    const notesContainer = document.getElementById('notes-container');
    if (notesContainer) {
        notesContainer.addEventListener('change', function(event) {
            if (event.target.classList.contains('note-checkbox-input')) {
                handleNoteCheckboxChange(event.target);
            }
        });
    }
}

function initializeEmailTemplate() {
    const emailDraftButton = document.getElementById('email-draft-button');
    const emailCopyButton = document.getElementById('email-copy-button');

    if (emailDraftButton) {
        emailDraftButton.addEventListener('click', handleEmailDraft);
    }

    if (emailCopyButton) {
        emailCopyButton.addEventListener('click', handleCopyEmail);
    }
}

function handleSelectAllChange(event) {
    const isChecked = event.target.checked;
    const sortedNotes = getSortedNotes();
    const filteredNotes = getFilteredNotesWithCache(sortedNotes);

    if (isChecked) {
        // Alle sichtbaren Notizen auswählen
        filteredNotes.forEach(note => selectedNotes.add(note.id));
    } else {
        // Alle sichtbaren Notizen abwählen
        filteredNotes.forEach(note => selectedNotes.delete(note.id));
    }

    // UI aktualisieren
    updateCheckboxStates();
    updateBulkActionButton();
}

function handleNoteCheckboxChange(checkbox) {
    const noteId = checkbox.dataset.noteId;
    // WICHTIG: dataset.noteId ist ein String, aber wir brauchen Number!
    const noteIdAsNumber = Number(noteId);

    if (checkbox.checked) {
        selectedNotes.add(noteIdAsNumber);
    } else {
        selectedNotes.delete(noteIdAsNumber);
    }

    updateSelectAllCheckbox();
    updateBulkActionButton();
}

function updateCheckboxStates() {
    // Alle Checkboxen im DOM aktualisieren
    const checkboxes = document.querySelectorAll('.note-checkbox-input');

    checkboxes.forEach(checkbox => {
        const noteId = checkbox.dataset.noteId;
        // WICHTIG: dataset.noteId ist ein String, aber selectedNotes enthält Numbers!
        const noteIdAsNumber = Number(noteId);
        checkbox.checked = selectedNotes.has(noteIdAsNumber);
    });
}

function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('select-all-checkbox');
    if (!selectAllCheckbox) return;

    const sortedNotes = getSortedNotes();
    const filteredNotes = getFilteredNotesWithCache(sortedNotes);
    const visibleNoteIds = filteredNotes.map(note => note.id);  // IDs sind Numbers
    const visibleSelectedCount = visibleNoteIds.filter(id => selectedNotes.has(id)).length;

    if (visibleSelectedCount === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (visibleSelectedCount === visibleNoteIds.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

function updateBulkActionButton() {
    const bulkActionButton = document.getElementById('bulk-action-button');
    const bulkActionText = document.getElementById('bulk-action-text');
    const bulkActionHtmlButton = document.getElementById('bulk-action-html-button');
    const bulkActionHtmlText = document.getElementById('bulk-action-html-text');
    const bulkSelectionSection = document.getElementById('bulk-selection-section');

    if (!bulkActionButton || !bulkActionText || !bulkSelectionSection) return;

    const selectionCount = selectedNotes.size;

    // Sektion nur anzeigen, wenn Notizen vorhanden sind
    if (allNotes.length > 0) {
        bulkSelectionSection.style.display = 'block';
    } else {
        bulkSelectionSection.style.display = 'none';
    }

    // Buttons aktivieren/deaktivieren
    if (selectionCount > 0) {
        bulkActionButton.disabled = false;
        bulkActionText.textContent = `Auswahl als PDF exportieren (${selectionCount})`;

        if (bulkActionHtmlButton && bulkActionHtmlText) {
            bulkActionHtmlButton.disabled = false;
            bulkActionHtmlText.textContent = `Auswahl als HTML exportieren (${selectionCount})`;
        }
    } else {
        bulkActionButton.disabled = true;
        bulkActionText.textContent = 'Auswahl als PDF exportieren (0)';

        if (bulkActionHtmlButton && bulkActionHtmlText) {
            bulkActionHtmlButton.disabled = true;
            bulkActionHtmlText.textContent = 'Auswahl als HTML exportieren (0)';
        }
    }
}

async function handleBulkExportPDF() {
    if (selectedNotes.size === 0) {
        alert('Bitte wählen Sie mindestens eine Notiz aus.');
        return;
    }

    try {
        // Sammle ausgewählte Notizen
        const selectedNotesArray = allNotes.filter(note => selectedNotes.has(note.id));

        // Sortiere nach Datum
        selectedNotesArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Generiere PDF
        await generateAccessibilityPDF(selectedNotesArray);

        alert(`PDF erfolgreich erstellt!\n\n${selectedNotesArray.length} Notizen exportiert.`);
    } catch (error) {
        console.error('Fehler beim PDF-Export:', error);
        alert(`Fehler beim PDF-Export: ${error.message}`);
    }
}

async function handleBulkExportHTML() {
    if (selectedNotes.size === 0) {
        alert('Bitte wählen Sie mindestens eine Notiz aus.');
        return;
    }

    try {
        // Sammle ausgewählte Notizen
        const selectedNotesArray = allNotes.filter(note => selectedNotes.has(note.id));

        // Sortiere nach Datum
        selectedNotesArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Generiere HTML
        await generateAccessibilityHTML(selectedNotesArray);

        alert(`HTML erfolgreich erstellt!\n\n${selectedNotesArray.length} Notizen exportiert.\n\nDie Datei kann direkt im Browser geöffnet und mit Screen Readern gelesen werden.`);
    } catch (error) {
        console.error('Fehler beim HTML-Export:', error);
        alert(`Fehler beim HTML-Export: ${error.message}`);
    }
}

// ============================================
// Email Template Functions
// ============================================

function generateGenericEmailText() {
    return `Sehr geehrte Damen und Herren,

ich melde hiermit Barrierefreiheitsprobleme auf Ihrer Website gemäß dem Barrierefreiheitsstärkungsgesetz (BFSG), das seit dem 28. Juni 2025 in Deutschland gilt.

Rechtliche Grundlagen:
- Barrierefreiheitsstärkungsgesetz (BFSG)
- Behindertengleichstellungsgesetz (BGG), insbesondere § 12a
- EU-Richtlinie 2016/2102 über den barrierefreien Zugang zu Websites

Die detaillierte Dokumentation der festgestellten Probleme finden Sie im beigefügten Bericht (PDF oder HTML).

Ich bitte um Stellungnahme innerhalb von 2 Wochen und um Mitteilung, bis wann die Probleme behoben werden.

Sollte keine zufriedenstellende Lösung gefunden werden, werde ich mich an die Schlichtungsstelle nach § 16 BGG wenden.

Weitere Informationen:
- Bundesfachstelle Barrierefreiheit: https://www.bundesfachstelle-barrierefreiheit.de/
- Schlichtungsstelle BGG: https://www.schlichtungsstelle-bgg.de/

Für Rückfragen stehe ich gerne zur Verfügung.

Mit freundlichen Grüßen

---
Erstellt mit AccNotes - AI-Powered BITV Testing Assistant
https://github.com/heikofolkerts/AccNotes`;
}

function handleEmailDraft() {
    try {
        const emailBody = generateGenericEmailText();
        const emailSubject = `Meldung Barrierefreiheitsprobleme gemäß BFSG`;

        // URL-encode für mailto:
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

        // Öffne mailto: Link
        window.location.href = mailtoUrl;

        // Zeige Hinweis
        setTimeout(() => {
            alert(`E-Mail-Entwurf geöffnet!\n\n⚠️ WICHTIG - Nächste Schritte:\n\n1. Tragen Sie die korrekte Empfänger-Adresse ein\n2. Exportieren Sie Ihre Notizen als PDF oder HTML\n3. Fügen Sie die Datei als Anhang zur E-Mail hinzu\n4. Senden Sie die E-Mail ab`);
        }, 500);

    } catch (error) {
        console.error('Fehler beim E-Mail-Entwurf:', error);
        alert(`Fehler beim Öffnen des E-Mail-Programms: ${error.message}\n\nVerwenden Sie alternativ den Button "E-Mail-Text kopieren".`);
    }
}

async function handleCopyEmail() {
    try {
        const emailBody = generateGenericEmailText();
        const emailSubject = `Meldung Barrierefreiheitsprobleme gemäß BFSG`;

        // Vollständiger Text mit Betreff
        const fullEmailText = `Betreff: ${emailSubject}\n\n${emailBody}`;

        // In Zwischenablage kopieren
        await navigator.clipboard.writeText(fullEmailText);

        alert(`✅ E-Mail-Text in Zwischenablage kopiert!\n\nNächste Schritte:\n1. Öffnen Sie Ihr E-Mail-Programm\n2. Fügen Sie den Text mit Strg+V ein\n3. Tragen Sie die Empfänger-Adresse ein\n4. Exportieren Sie Ihre Notizen als PDF oder HTML\n5. Fügen Sie den Export als Anhang hinzu\n6. Senden Sie die E-Mail ab`);

    } catch (error) {
        console.error('Fehler beim Kopieren:', error);
        alert(`Fehler beim Kopieren in die Zwischenablage: ${error.message}`);
    }
}

function clearSelection() {
    selectedNotes.clear();
    updateCheckboxStates();
    updateSelectAllCheckbox();
    updateBulkActionButton();
}

// ============================================
// PDF Export Functionality
// ============================================

async function generateAccessibilityPDF(notes) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPos = margin;

    // ========== Deckblatt ==========
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Barrierefreiheits-Bericht', margin, yPos);
    yPos += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE', {
        year: 'numeric', month: 'long', day: 'numeric'
    })}`, margin, yPos);
    yPos += 10;
    doc.text(`Anzahl Notizen: ${notes.length}`, margin, yPos);
    yPos += 15;

    // Zusammenfassung
    const statusCount = {
        draft: notes.filter(n => n.status === 'draft' || !n.status).length,
        reported: notes.filter(n => n.status === 'reported').length,
        resolved: notes.filter(n => n.status === 'resolved').length
    };

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Zusammenfassung', margin, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Entwürfe: ${statusCount.draft}`, margin, yPos);
    yPos += 7;
    doc.text(`Gemeldet: ${statusCount.reported}`, margin, yPos);
    yPos += 7;
    doc.text(`Behoben: ${statusCount.resolved}`, margin, yPos);
    yPos += 20;

    // Websites-Übersicht
    const websites = [...new Set(notes.map(n => {
        try {
            return new URL(n.url).hostname;
        } catch {
            return n.url || 'Unbekannt';
        }
    }))];

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Betroffene Websites', margin, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    websites.forEach(website => {
        if (yPos > pageHeight - 30) {
            doc.addPage();
            yPos = margin;
        }
        doc.text(`• ${website}`, margin + 5, yPos);
        yPos += 7;
    });

    // ========== Notizen-Details ==========
    doc.addPage();
    yPos = margin;

    // H2: Gefundene Barrieren
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Gefundene Barrieren', margin, yPos);
    yPos += 15;

    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];

        // Prüfe Seitenumbruch
        if (yPos > pageHeight - 80) {
            doc.addPage();
            yPos = margin;
        }

        // H3: Einzelne Barriere (Notiz-Titel)
        doc.setFontSize(12);  // H3-Größe (kleiner als H2)
        doc.setFont('helvetica', 'bold');
        const noteTitle = note.title || note.pageTitle || 'Unbekannte Seite';
        doc.text(`${i + 1}. ${noteTitle}`, margin, yPos);
        yPos += 8;  // Abstand nach H3-Überschrift

        // Status-Badge
        const statusTexts = {
            draft: 'Status: Entwurf (noch nicht gemeldet)',
            reported: 'Status: Gemeldet',
            resolved: 'Status: Behoben'
        };
        const statusText = statusTexts[note.status] || statusTexts.draft;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text(statusText, margin, yPos);
        yPos += 7;

        // Metadaten
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const date = new Date(note.timestamp).toLocaleDateString('de-DE');
        doc.text(`Datum: ${date}`, margin, yPos);
        yPos += 6;

        const urlText = note.url || 'Keine URL';
        const splitUrl = doc.splitTextToSize(urlText, contentWidth);
        doc.text(`URL: ${splitUrl[0]}`, margin, yPos);
        yPos += 6;

        if (note.element?.type) {
            doc.text(`Element: ${note.element.type}`, margin, yPos);
            yPos += 6;
        }

        // BITV-Prüfschritt
        if (note.bitvTest) {
            doc.setFont('helvetica', 'bold');
            doc.text(`BITV-Prüfschritt: ${note.bitvTest.stepId} - ${note.bitvTest.stepTitle}`, margin, yPos);
            yPos += 6;
            doc.setFont('helvetica', 'normal');

            const evaluationTexts = {
                passed: 'Bestanden',
                failed: 'Nicht bestanden',
                partial: 'Teilweise bestanden',
                needs_review: 'Zu überprüfen'
            };
            doc.text(`Bewertung: ${evaluationTexts[note.bitvTest.evaluation] || evaluationTexts.needs_review}`, margin, yPos);
            yPos += 8;
        } else {
            yPos += 2;
        }

        // Beschreibung
        doc.setFont('helvetica', 'bold');
        doc.text('Beschreibung:', margin, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');

        const contentLines = doc.splitTextToSize(note.content || 'Keine Beschreibung', contentWidth);
        contentLines.forEach(line => {
            if (yPos > pageHeight - 20) {
                doc.addPage();
                yPos = margin;
            }
            doc.text(line, margin, yPos);
            yPos += 5;
        });
        yPos += 5;

        // Empfehlung
        if (note.recommendation) {
            doc.setFont('helvetica', 'bold');
            doc.text('Empfehlung:', margin, yPos);
            yPos += 6;
            doc.setFont('helvetica', 'normal');

            const recommendationLines = doc.splitTextToSize(note.recommendation, contentWidth);
            recommendationLines.forEach(line => {
                if (yPos > pageHeight - 20) {
                    doc.addPage();
                    yPos = margin;
                }
                doc.text(line, margin, yPos);
                yPos += 5;
            });
            yPos += 5;
        }

        // Screenshot (wenn vorhanden)
        if (note.screenshotDataUrl) {
            try {
                if (yPos > pageHeight - 100) {
                    doc.addPage();
                    yPos = margin;
                }

                doc.setFont('helvetica', 'bold');
                doc.text('Screenshot:', margin, yPos);
                yPos += 6;

                const imgWidth = contentWidth;
                const imgHeight = 80; // Feste Höhe für einheitliches Layout

                doc.addImage(note.screenshotDataUrl, 'PNG', margin, yPos, imgWidth, imgHeight);
                yPos += imgHeight + 10;
            } catch (error) {
                console.warn('Screenshot konnte nicht eingebettet werden:', error);
            }
        }

        // Trennlinie
        yPos += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, yPos, pageWidth - margin, yPos);
        yPos += 10;
    }

    // ========== Fußzeile auf allen Seiten ==========
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text(
            `Seite ${i} von ${totalPages} • Erstellt mit AccNotes`,
            pageWidth / 2,
            pageHeight - 10,
            { align: 'center' }
        );
    }

    // Speichern
    const filename = `barrierefreiheit-bericht-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
}

// ============================================
// HTML Export Functionality (Accessible Alternative)
// ============================================

async function generateAccessibilityHTML(notes) {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('de-DE', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Status-Zusammenfassung
    const statusCount = {
        draft: notes.filter(n => n.status === 'draft' || !n.status).length,
        reported: notes.filter(n => n.status === 'reported').length,
        resolved: notes.filter(n => n.status === 'resolved').length
    };

    // Websites-Übersicht
    const websites = [...new Set(notes.map(n => {
        try {
            return new URL(n.url).hostname;
        } catch {
            return n.url || 'Unbekannt';
        }
    }))];

    // HTML-Struktur aufbauen
    let html = `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Barrierefreiheits-Bericht - ${formattedDate}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background: #fff;
            color: #333;
        }
        h1 {
            color: #2563eb;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
        }
        h2 {
            color: #1e40af;
            border-bottom: 2px solid #dbeafe;
            padding-bottom: 0.3rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        h3 {
            color: #1e3a8a;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
        }
        .metadata {
            background: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 2rem;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 1rem 0;
        }
        .summary-item {
            background: #fff;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
        }
        .summary-item strong {
            display: block;
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
        }
        .summary-item span {
            font-size: 1.5rem;
            color: #2563eb;
            font-weight: bold;
        }
        .barrier {
            background: #f9fafb;
            border-left: 4px solid #2563eb;
            padding: 1.5rem;
            margin: 1.5rem 0;
            border-radius: 0.25rem;
        }
        .barrier--failed {
            border-left-color: #dc2626;
        }
        .barrier--partial {
            border-left-color: #f59e0b;
        }
        .barrier--passed {
            border-left-color: #10b981;
        }
        .meta-info {
            font-size: 0.875rem;
            color: #6b7280;
            margin: 0.5rem 0;
        }
        .status-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-weight: 600;
            margin: 0.5rem 0;
        }
        .status-badge--draft {
            background: #dbeafe;
            color: #1e40af;
        }
        .status-badge--reported {
            background: #dcfce7;
            color: #166534;
        }
        .status-badge--in_arbitration {
            background: #fef3c7;
            color: #92400e;
        }
        .status-badge--resolved {
            background: #f3e8ff;
            color: #6b21a8;
        }
        .bitv-info {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            padding: 0.75rem;
            border-radius: 0.25rem;
            margin: 0.75rem 0;
        }
        .bitv-evaluation {
            font-weight: bold;
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            display: inline-block;
        }
        .bitv-evaluation--passed {
            background: #d1fae5;
            color: #065f46;
        }
        .bitv-evaluation--failed {
            background: #fee2e2;
            color: #991b1b;
        }
        .bitv-evaluation--partial {
            background: #fef3c7;
            color: #92400e;
        }
        .bitv-evaluation--needs_review {
            background: #e0e7ff;
            color: #3730a3;
        }
        .screenshot {
            max-width: 100%;
            height: auto;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            margin: 1rem 0;
        }
        .description, .recommendation {
            margin: 0.75rem 0;
            line-height: 1.7;
        }
        .description strong, .recommendation strong {
            display: block;
            margin-bottom: 0.25rem;
            color: #374151;
        }
        .website-list {
            list-style: none;
            padding: 0;
        }
        .website-list li {
            padding: 0.5rem;
            border-bottom: 1px solid #e5e7eb;
        }
        @media print {
            body {
                max-width: 100%;
            }
            .barrier {
                page-break-inside: avoid;
            }
        }
        @media (prefers-color-scheme: dark) {
            body {
                background: #1f2937;
                color: #e5e7eb;
            }
            .barrier {
                background: #374151;
            }
            .bitv-info {
                background: #1e3a8a;
                border-color: #1e40af;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Barrierefreiheits-Bericht</h1>
        <div class="metadata">
            <p><strong>Erstellt am:</strong> ${formattedDate}</p>
            <p><strong>Anzahl Notizen:</strong> ${notes.length}</p>
        </div>
    </header>

    <section>
        <h2>Zusammenfassung</h2>
        <div class="summary">
            <div class="summary-item">
                <strong>Entwürfe</strong>
                <span>${statusCount.draft}</span>
            </div>
            <div class="summary-item">
                <strong>Gemeldet</strong>
                <span>${statusCount.reported}</span>
            </div>
            <div class="summary-item">
                <strong>Behoben</strong>
                <span>${statusCount.resolved}</span>
            </div>
        </div>
    </section>

    <section>
        <h2>Betroffene Websites</h2>
        <ul class="website-list">
`;

    websites.forEach(website => {
        html += `            <li>${escapeHtml(website)}</li>\n`;
    });

    html += `        </ul>
    </section>

    <section>
        <h2>Gefundene Barrieren</h2>
`;

    // Einzelne Notizen
    notes.forEach((note, index) => {
        const noteTitle = note.title || note.pageTitle || 'Unbekannte Seite';
        const date = new Date(note.timestamp).toLocaleDateString('de-DE');

        const statusTexts = {
            draft: 'Entwurf (noch nicht gemeldet)',
            reported: 'Gemeldet',
            resolved: 'Behoben'
        };
        const statusText = statusTexts[note.status] || statusTexts.draft;
        const statusClass = note.status || 'draft';

        const evaluationClass = note.bitvTest ? note.bitvTest.evaluation || 'needs_review' : '';
        const barrierClass = evaluationClass ? `barrier--${evaluationClass}` : '';

        html += `
        <article class="barrier ${barrierClass}">
            <h3>${index + 1}. ${escapeHtml(noteTitle)}</h3>

            <span class="status-badge status-badge--${statusClass}">
                Status: ${statusText}
            </span>

            <div class="meta-info">
                <p><strong>Datum:</strong> ${date}</p>
                <p><strong>URL:</strong> <a href="${escapeHtml(note.url)}">${escapeHtml(note.url)}</a></p>
                <p><strong>Element:</strong> ${escapeHtml(note.element?.type || note.elementType || 'Unbekannt')}</p>
            </div>
`;

        // BITV-Informationen
        if (note.bitvTest) {
            const evaluationTexts = {
                passed: 'Bestanden',
                failed: 'Nicht bestanden',
                partial: 'Teilweise bestanden',
                needs_review: 'Zu überprüfen'
            };
            const evaluationText = evaluationTexts[note.bitvTest.evaluation] || evaluationTexts.needs_review;

            html += `
            <div class="bitv-info">
                <p><strong>BITV-Prüfschritt:</strong> ${escapeHtml(note.bitvTest.stepId)} - ${escapeHtml(note.bitvTest.stepTitle)}</p>
                <p>
                    <strong>Bewertung:</strong>
                    <span class="bitv-evaluation bitv-evaluation--${note.bitvTest.evaluation || 'needs_review'}">
                        ${evaluationText}
                    </span>
                </p>
            </div>
`;
        }

        // Beschreibung
        html += `
            <div class="description">
                <strong>Beschreibung:</strong>
                <p>${escapeHtml(note.content || 'Keine Beschreibung')}</p>
            </div>
`;

        // Empfehlung
        if (note.recommendation) {
            html += `
            <div class="recommendation">
                <strong>Empfehlung:</strong>
                <p>${escapeHtml(note.recommendation)}</p>
            </div>
`;
        }

        // Screenshot
        if (note.screenshotDataUrl) {
            html += `
            <div>
                <strong>Screenshot:</strong>
                <img src="${note.screenshotDataUrl}"
                     alt="Screenshot von ${escapeHtml(noteTitle)}"
                     class="screenshot">
            </div>
`;
        }

        html += `
        </article>
`;
    });

    html += `
    </section>

    <footer style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
        <p>Erstellt mit <a href="https://github.com/heikofolkerts/AccNotes" style="color: #2563eb;">AccNotes</a> - AI-Powered BITV Testing Assistant</p>
    </footer>
</body>
</html>`;

    // HTML-Datei zum Download anbieten
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `barrierefreiheit-bericht-${new Date().toISOString().split('T')[0]}.html`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================
// Event Listeners Setup (CSP-compliant)
// ============================================

function initializeEventListeners() {
    // Filter Event-Listeners
    const searchInput = document.getElementById('search-input');
    const bitvCategoryFilter = document.getElementById('bitv-category-filter');
    const bitvEvaluationFilter = document.getElementById('bitv-evaluation-filter');
    const notesTypeFilter = document.getElementById('notes-type-filter');
    const websiteFilter = document.getElementById('website-filter');
    const statusFilter = document.getElementById('status-filter');
    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    const sortSelect = document.getElementById('sort-select');
    const refreshBtn = document.getElementById('refresh-notes-btn');

    // Export Button Event-Listener
    const exportBitvReportBtn = document.getElementById('export-bitv-report-btn');

    if (searchInput) searchInput.addEventListener('keyup', filterNotes);
    if (bitvCategoryFilter) bitvCategoryFilter.addEventListener('change', filterNotes);
    if (bitvEvaluationFilter) bitvEvaluationFilter.addEventListener('change', filterNotes);
    if (notesTypeFilter) notesTypeFilter.addEventListener('change', filterNotes);
    if (websiteFilter) websiteFilter.addEventListener('change', filterNotes);
    if (statusFilter) statusFilter.addEventListener('change', filterNotes);
    if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', clearFilters);
    if (sortSelect) sortSelect.addEventListener('change', sortNotes);
    if (refreshBtn) refreshBtn.addEventListener('click', refreshNotes);

    // Export BITV Report Button
    if (exportBitvReportBtn) {
        console.log('BITV-Export-Button gefunden, Event-Listener wird registriert');
        exportBitvReportBtn.addEventListener('click', function() {
            console.log('BITV-Export-Button wurde geklickt!');
            exportBitvReport();
        });
    } else {
        console.warn('BITV-Export-Button nicht gefunden!');
    }
}