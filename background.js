console.log('🚀 Background script starting...');

// Cross-Browser-API
const browserAPI = (typeof chrome !== 'undefined' && chrome.runtime) ? chrome : browser;

console.log('📡 Background: Using API:', browserAPI === chrome ? 'chrome' : 'browser');

// Erstelle Kontextmenü-Einträge
console.log('🎯 Background: Creating context menu items...');

try {
    browserAPI.contextMenus.create({
        id: "add-note",
        title: "Notiz hinzufügen",
        contexts: ["all"]
    });
    console.log('✅ Background: "Notiz hinzufügen" menu created');

    browserAPI.contextMenus.create({
        id: "view-notes",
        title: "Alle Notizen anzeigen",
        contexts: ["all"]
    });
    console.log('✅ Background: "Alle Notizen anzeigen" menu created');
} catch (error) {
    console.error('❌ Background: Error creating context menus:', error);
}

console.log('🎯 Background: Setting up context menu listener...');

browserAPI.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log('🔔 Background: Context menu clicked!', info.menuItemId);

    if (info.menuItemId === "add-note") {
        console.log('📝 Background: Add note clicked - starting process...');
        try {
            console.log('🚀 Background: Sending message to content script in tab', tab.id);

            // Hole Element-Informationen aus Storage
            let elementInfo = null;

            try {
                // Content Script informieren und kurz warten
                await browserAPI.tabs.sendMessage(tab.id, {action: 'prepareElementInfo'});
                await new Promise(resolve => setTimeout(resolve, 150));

                // Element-Informationen aus Storage lesen
                const storageResult = await new Promise((resolve) => {
                    browserAPI.storage.local.get(['temp_elementInfo', 'temp_timestamp'], (result) => {
                        if (browserAPI.runtime.lastError) {
                            console.error('❌ Background: Storage error:', browserAPI.runtime.lastError);
                            resolve({});
                        } else {
                            resolve(result || {});
                        }
                    });
                });

                if (storageResult?.temp_elementInfo && storageResult?.temp_timestamp) {
                    const age = Date.now() - storageResult.temp_timestamp;
                    if (age < 30000) { // 30 Sekunden Toleranz
                        elementInfo = storageResult.temp_elementInfo;
                        console.log('✅ Background: Element info retrieved:', {
                            tagName: elementInfo.tagName,
                            elementType: elementInfo.elementType,
                            detectedProblems: elementInfo.detectedProblems?.length || 0
                        });

                        // Aufräumen
                        setTimeout(() => {
                            browserAPI.storage.local.remove(['temp_elementInfo', 'temp_timestamp']);
                        }, 1000);
                    }
                }
            } catch (error) {
                console.error('❌ Background: Error retrieving element info:', error);
            }

            // Sammle Kontext-Informationen
            const contextData = {
                url: tab.url || 'Unbekannt',
                title: tab.title || 'Unbekannt',
                selectedText: info.selectionText || '',
                // Element-Informationen aus Content Script (falls verfügbar)
                ...(elementInfo || {})
            };

            // Stelle sicher, dass kritische Felder immer gesetzt sind
            if (!contextData.tagName) {
                contextData.tagName = 'UNKNOWN';
            }
            if (!contextData.elementType) {
                contextData.elementType = info.linkUrl ? 'Link' : (info.srcUrl ? 'Bild' : 'Unbekannt');
            }
            if (!contextData.detectedProblems) {
                contextData.detectedProblems = [];
            }

            console.log('📦 Background: Opening note with element:', contextData.elementType);

            // Erstelle URL-Parameter für die lokale Seite
            const params = new URLSearchParams();
            // Übergebe alle Daten als JSON
            params.set('contextData', JSON.stringify(contextData));

            const notePageUrl = browserAPI.runtime.getURL('note.html') + '?' + params.toString();

            browserAPI.tabs.create({
                url: notePageUrl
            });
        } catch (error) {
            console.error('❌ Background: Error during note creation process:', error);

            // Fallback: Minimale Kontextdaten
            const contextData = {
                url: tab.url || 'Unbekannt',
                title: tab.title || 'Unbekannt',
                selectedText: info.selectionText || '',
                elementType: info.linkUrl ? 'Link' : (info.srcUrl ? 'Bild' : 'Allgemein'),
                tagName: 'UNKNOWN',
                detectedProblems: []
            };

            const params = new URLSearchParams();
            params.set('contextData', JSON.stringify(contextData));

            const notePageUrl = browserAPI.runtime.getURL('note.html') + '?' + params.toString();

            browserAPI.tabs.create({
                url: notePageUrl
            });
        }
    } else if (info.menuItemId === "view-notes") {
        // Öffne die Notizen-Übersichtsseite
        const notesOverviewUrl = browserAPI.runtime.getURL('notes-overview.html');
        browserAPI.tabs.create({
            url: notesOverviewUrl
        });
    }
});

