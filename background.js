    browser.contextMenus.create({
    id: "add-note",
    title: "Notiz hinzufügen",
    contexts: ["all"]
});

browser.contextMenus.create({
    id: "view-notes",
    title: "Alle Notizen anzeigen",
    contexts: ["all"]
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "add-note") {
        try {
            // Hole zusätzliche Element-Informationen vom Content Script
            const elementInfo = await browser.tabs.sendMessage(tab.id, {action: 'getElementInfo'});

            // Sammle Kontext-Informationen
            const contextData = {
                url: tab.url || 'Unbekannt',
                title: tab.title || 'Unbekannt',
                selectedText: info.selectionText || '',
                // Element-Informationen aus Content Script
                ...elementInfo
            };

            // Debug: Logge die verfügbaren Informationen
            console.log('Context Info:', info);
            console.log('Element Info:', elementInfo);
            console.log('Tab Info:', tab);
            console.log('Context Data:', contextData);

            // Erstelle URL-Parameter für die lokale Seite
            const params = new URLSearchParams();
            // Übergebe alle Daten als JSON
            params.set('contextData', JSON.stringify(contextData));

            const notePageUrl = browser.runtime.getURL('note.html') + '?' + params.toString();

            browser.tabs.create({
                url: notePageUrl
            });
        } catch (error) {
            console.error('Fehler beim Abrufen der Element-Informationen:', error);
            // Fallback ohne Content Script Daten
            const contextData = {
                url: tab.url || 'Unbekannt',
                title: tab.title || 'Unbekannt',
                selectedText: info.selectionText || '',
                elementType: info.linkUrl ? 'Link' : (info.srcUrl ? 'Bild' : 'Allgemein'),
                href: info.linkUrl || '',
                text: info.selectionText || ''
            };

            const params = new URLSearchParams();
            params.set('contextData', JSON.stringify(contextData));

            const notePageUrl = browser.runtime.getURL('note.html') + '?' + params.toString();

            browser.tabs.create({
                url: notePageUrl
            });
        }
    } else if (info.menuItemId === "view-notes") {
        // Öffne die Notizen-Übersichtsseite
        const notesOverviewUrl = browser.runtime.getURL('notes-overview.html');
        browser.tabs.create({
            url: notesOverviewUrl
        });
    }
});

