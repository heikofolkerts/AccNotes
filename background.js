console.log('🚀 Background script starting...');

// Proxy-Logging: Sende alle Background Logs auch an Content Script
function logToContentScript(message, data = null) {
    console.log(message, data || '');
    // Versuche auch an Content Script zu senden (für gemeinsame Konsole)
    try {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'logFromBackground',
                    message: message,
                    data: data
                }).catch(() => {}); // Ignoriere Fehler
            }
        });
    } catch (e) {} // Ignoriere Fehler
}

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
    logToContentScript('🔔 [BG] Context menu clicked: ' + info.menuItemId);

    if (info.menuItemId === "add-note") {
        console.log('📝 Background: Add note clicked - starting process...');
        logToContentScript('📝 [BG] Add note clicked - starting process...');
        try {
            console.log('🚀 Background: Sending message to content script in tab', tab.id);

            // Hole Element-Informationen aus Storage (Alternative zu Message Passing)
            let elementInfo = null;
            console.log('📤 Background: Reading element info from storage...');

            try {
                // Warte kurz, damit Content Script Daten speichern kann
                await new Promise(resolve => setTimeout(resolve, 50));

                // Versuche direkt Content Script zu kontaktieren UND Storage zu nutzen
                try {
                    console.log('📤 Background: Trying to contact content script...');
                    await browserAPI.tabs.sendMessage(tab.id, {action: 'prepareElementInfo'});
                    console.log('✅ Background: Content script contacted successfully');
                } catch (msgError) {
                    console.warn('⚠️ Background: Content script message failed:', msgError.message);
                }

                // Warte noch etwas länger für Storage-Update
                await new Promise(resolve => setTimeout(resolve, 100));

                // Debug: Teste Storage-Zugriff
                console.log('🧪 Background: Testing storage access...');
                try {
                    const testResult = await new Promise((resolve) => {
                        browserAPI.storage.local.get(null, (allData) => {
                            if (browserAPI.runtime.lastError) {
                                console.error('❌ Background: Test storage error:', browserAPI.runtime.lastError);
                                resolve(null);
                            } else {
                                resolve(allData);
                            }
                        });
                    });
                    console.log('🧪 Background: All storage data:', testResult);
                } catch (testError) {
                    console.error('❌ Background: Storage test failed:', testError);
                }

                // Storage mit Promise wrapper für bessere Kompatibilität
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

                console.log('📥 Background: Storage result:', storageResult);
                console.log('📥 Background: Storage result type:', typeof storageResult);
                console.log('📥 Background: Has temp_elementInfo:', !!storageResult.temp_elementInfo);

                if (storageResult && storageResult.temp_elementInfo && storageResult.temp_timestamp) {
                    const timestamp = storageResult.temp_timestamp;
                    const age = Date.now() - timestamp;
                    console.log('📥 Background: Found stored data, age:', age, 'ms');
                    logToContentScript(`📥 [BG] Found stored data, age: ${age}ms`);

                    if (age < 30000) { // Erweitert auf 30 Sekunden
                        elementInfo = storageResult.temp_elementInfo;
                        const elementSummary = {
                            tagName: elementInfo.tagName,
                            elementType: elementInfo.elementType,
                            detectedProblemsCount: elementInfo.detectedProblems?.length || 0
                        };
                        console.log('✅ Background: Valid element info retrieved from storage:', elementSummary);
                        logToContentScript('✅ [BG] Valid element info retrieved from storage', elementSummary);

                        // Lösche temporäre Daten nach erfolgreichem Lesen
                        setTimeout(() => {
                            browserAPI.storage.local.remove(['temp_elementInfo', 'temp_timestamp']);
                            console.log('🗑️ Background: Cleaned up temporary storage (delayed)');
                        }, 1000);
                    } else {
                        console.warn('⚠️ Background: Storage data too old:', age, 'ms');
                        elementInfo = null;
                    }
                } else {
                    console.warn('⚠️ Background: No element info found in storage');
                    elementInfo = null;
                }
            } catch (error) {
                console.error('❌ Background: Failed to read from storage:', error);
                elementInfo = null;
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

            // Debug: Logge die verfügbaren Informationen
            console.log('📋 Background: Context Info:', info);
            console.log('🎯 Background: Element Info:', elementInfo);
            console.log('📦 Background: Final Context Data being sent to note.html:', {
                tagName: contextData.tagName,
                elementType: contextData.elementType,
                text: contextData.text,
                detectedProblemsCount: contextData.detectedProblems?.length || 0,
                url: contextData.url
            });

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

