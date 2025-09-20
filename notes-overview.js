// Notes Overview JavaScript
let allNotes = [];

// Lade alle Notizen beim Seitenstart
document.addEventListener('DOMContentLoaded', function() {
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

    document.getElementById('total-notes').textContent = totalNotes;
    document.getElementById('notes-today').textContent = notesToday;
    document.getElementById('unique-pages').textContent = uniquePages;
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

    return `
        <div class="note-item">
            <div class="note-header">
                <div class="note-info">
                    <div class="note-title">${note.title || 'Unbekannte Seite'} - ${note.elementType || 'Element'}</div>
                    <div class="note-url">${note.url || 'Keine URL'}</div>
                    <div class="note-meta">📅 ${formattedDate} | 📄 ${note.fileName || 'Keine Datei'}</div>
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
            return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        default:
            return sorted;
    }
}

function getFilteredNotes(notes) {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    if (!searchTerm) return notes;

    return notes.filter(note =>
        (note.content || '').toLowerCase().includes(searchTerm) ||
        (note.title || '').toLowerCase().includes(searchTerm) ||
        (note.url || '').toLowerCase().includes(searchTerm) ||
        (note.elementType || '').toLowerCase().includes(searchTerm)
    );
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