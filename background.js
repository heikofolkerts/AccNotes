console.log('🚀 Background script starting...');

// Cross-Browser-API
const browserAPI = (typeof chrome !== 'undefined' && chrome.runtime) ? chrome : browser;

console.log('📡 Background: Using API:', browserAPI === chrome ? 'chrome' : 'browser');

// Dynamisches Kontextmenü-System
let currentMenuItems = [];

// Erstelle Standard-Kontextmenü-Einträge (initial)
console.log('🎯 Background: Creating initial context menu items...');

function createInitialContextMenu() {
    try {
        browserAPI.contextMenus.create({
            id: "add-note",
            title: "📝 Notiz hinzufügen",
            contexts: ["all"]
        });

        browserAPI.contextMenus.create({
            id: "view-notes",
            title: "📄 Alle Notizen anzeigen",
            contexts: ["all"]
        });

        currentMenuItems = ["add-note", "view-notes"];
        console.log('✅ Background: Initial context menu created');
    } catch (error) {
        console.error('❌ Background: Error creating initial context menus:', error);
    }
}

// Dynamisches Kontextmenü basierend auf erkannten Problemen
function createDynamicContextMenu(elementInfo) {
    console.log('🔄 Background: Creating dynamic context menu for element:', elementInfo?.tagName);

    try {
        // Lösche alle bestehenden Menü-Items
        browserAPI.contextMenus.removeAll(() => {
            currentMenuItems = [];

            const hasProblems = elementInfo?.detectedProblems?.length > 0;
            const problems = elementInfo?.detectedProblems || [];

            if (hasProblems) {
                console.log(`🚨 Background: ${problems.length} problems detected, creating problem-specific menu`);

                // PROBLEM-SPEZIFISCHE MENÜPUNKTE
                problems.forEach((problem, index) => {
                    const problemMenuId = `quick-report-${index}`;
                    const problemTitle = `🚨 Problem melden: ${problem.title}`;

                    browserAPI.contextMenus.create({
                        id: problemMenuId,
                        title: problemTitle,
                        contexts: ["all"]
                    });

                    currentMenuItems.push(problemMenuId);
                });

                // Separator
                browserAPI.contextMenus.create({
                    id: "separator-1",
                    type: "separator",
                    contexts: ["all"]
                });

                // DETAILLIERTE OPTIONEN
                browserAPI.contextMenus.create({
                    id: "detailed-note",
                    title: "📋 Detaillierte BITV-Notiz erstellen",
                    contexts: ["all"]
                });

                browserAPI.contextMenus.create({
                    id: "explain-problem",
                    title: "❓ Was bedeutet das?",
                    contexts: ["all"]
                });

                currentMenuItems.push("separator-1", "detailed-note", "explain-problem");

            } else {
                console.log('✅ Background: No problems detected, creating standard menu');

                // STANDARD-MENÜ (keine Probleme erkannt)
                const elementType = elementInfo?.elementType || 'Element';

                browserAPI.contextMenus.create({
                    id: "add-note",
                    title: `📝 Notiz zu diesem ${elementType}`,
                    contexts: ["all"]
                });

                browserAPI.contextMenus.create({
                    id: "quick-report",
                    title: "🚀 Schnelle Meldung",
                    contexts: ["all"]
                });

                browserAPI.contextMenus.create({
                    id: "check-accessibility",
                    title: "🔍 Barrierefreiheit prüfen",
                    contexts: ["all"]
                });

                currentMenuItems.push("add-note", "quick-report", "check-accessibility");
            }

            // ALLGEMEINE OPTIONEN (immer vorhanden)
            browserAPI.contextMenus.create({
                id: "separator-2",
                type: "separator",
                contexts: ["all"]
            });

            browserAPI.contextMenus.create({
                id: "view-notes",
                title: "📄 Notizen-Übersicht",
                contexts: ["all"]
            });

            currentMenuItems.push("separator-2", "view-notes");

            console.log('✅ Background: Dynamic context menu created with items:', currentMenuItems);
        });

    } catch (error) {
        console.error('❌ Background: Error creating dynamic context menu:', error);
        // Fallback: Erstelle Standard-Menü
        createInitialContextMenu();
    }
}

// Initialisiere mit Standard-Menü
createInitialContextMenu();

// Message-Listener für dynamisches Kontextmenü
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateContextMenu') {
        console.log('📩 Background: Received context menu update request');
        createDynamicContextMenu(request.elementInfo);
        sendResponse({ success: true });
        return true;
    }
    return false;
});

console.log('🎯 Background: Setting up context menu listener...');

browserAPI.contextMenus.onClicked.addListener(async (info, tab) => {
    console.log('🔔 Background: Context menu clicked!', info.menuItemId);

    // Handle dynamic problem-specific menu items
    if (info.menuItemId.startsWith("quick-report-")) {
        const problemIndex = parseInt(info.menuItemId.replace("quick-report-", ""));
        console.log(`🚨 Background: Quick report for problem ${problemIndex}`);

        // Get element info and create note with specific problem pre-filled
        await handleQuickProblemReport(problemIndex, tab, info);
        return;
    }

    // Handle other dynamic menu items
    if (info.menuItemId === "detailed-note") {
        console.log('📋 Background: Detailed BITV note requested');
        await handleDetailedNote(tab, info);
        return;
    }

    if (info.menuItemId === "explain-problem") {
        console.log('❓ Background: Explain problem requested');
        await handleExplainProblem(tab, info);
        return;
    }

    if (info.menuItemId === "quick-report") {
        console.log('🚀 Background: Quick report requested');
        await handleQuickReport(tab, info);
        return;
    }

    if (info.menuItemId === "check-accessibility") {
        console.log('🔍 Background: Accessibility check requested');
        await handleAccessibilityCheck(tab, info);
        return;
    }

    // Standard menu items
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

// === HANDLER-FUNKTIONEN FÜR DYNAMISCHES KONTEXTMENÜ ===

async function handleQuickProblemReport(problemIndex, tab, info) {
    console.log(`🚨 Background: Handling quick problem report for index ${problemIndex}`);

    try {
        // Element-Informationen abrufen
        const elementInfo = await getElementInfo(tab);

        if (elementInfo?.detectedProblems?.[problemIndex]) {
            const problem = elementInfo.detectedProblems[problemIndex];

            // Erstelle kontextuelle Daten mit spezifischem Problem
            const contextData = {
                url: tab.url || 'Unbekannt',
                title: tab.title || 'Unbekannt',
                selectedText: info.selectionText || '',
                ...elementInfo,
                // Markiere das spezifische Problem als primär
                primaryProblem: problem,
                reportType: 'quick-problem',
                quickReportTitle: problem.title,
                quickReportDescription: problem.description,
                quickReportRecommendation: problem.recommendation
            };

            await openNoteWithContext(contextData);
            console.log(`✅ Background: Quick problem report opened for: ${problem.title}`);
        } else {
            console.error('❌ Background: Problem not found at index:', problemIndex);
            // Fallback: Normaler Notiz-Workflow
            await handleDetailedNote(tab, info);
        }
    } catch (error) {
        console.error('❌ Background: Error in quick problem report:', error);
        // Fallback: Standard-Notiz
        await handleDetailedNote(tab, info);
    }
}

async function handleDetailedNote(tab, info) {
    console.log('📋 Background: Handling detailed BITV note');

    try {
        const elementInfo = await getElementInfo(tab);

        const contextData = {
            url: tab.url || 'Unbekannt',
            title: tab.title || 'Unbekannt',
            selectedText: info.selectionText || '',
            ...elementInfo,
            reportType: 'detailed-bitv'
        };

        await openNoteWithContext(contextData);
        console.log('✅ Background: Detailed BITV note opened');
    } catch (error) {
        console.error('❌ Background: Error in detailed note:', error);
    }
}

async function handleExplainProblem(tab, info) {
    console.log('❓ Background: Handling explain problem');

    try {
        const elementInfo = await getElementInfo(tab);

        if (elementInfo?.detectedProblems?.length > 0) {
            // Erstelle Hilfe-Seite mit Problem-Erklärungen
            const params = new URLSearchParams();
            params.set('mode', 'explain');
            params.set('problems', JSON.stringify(elementInfo.detectedProblems));

            const helpUrl = browserAPI.runtime.getURL('help.html') + '?' + params.toString();
            browserAPI.tabs.create({ url: helpUrl });

            console.log('✅ Background: Problem explanation opened');
        } else {
            // Allgemeine Hilfe
            const helpUrl = browserAPI.runtime.getURL('help.html');
            browserAPI.tabs.create({ url: helpUrl });
        }
    } catch (error) {
        console.error('❌ Background: Error explaining problem:', error);
    }
}

async function handleQuickReport(tab, info) {
    console.log('🚀 Background: Handling quick report');

    try {
        const elementInfo = await getElementInfo(tab);

        const contextData = {
            url: tab.url || 'Unbekannt',
            title: tab.title || 'Unbekannt',
            selectedText: info.selectionText || '',
            ...elementInfo,
            reportType: 'quick-citizen'
        };

        await openNoteWithContext(contextData);
        console.log('✅ Background: Quick citizen report opened');
    } catch (error) {
        console.error('❌ Background: Error in quick report:', error);
    }
}

async function handleAccessibilityCheck(tab, info) {
    console.log('🔍 Background: Handling accessibility check');

    try {
        // Sende Nachricht an Content Script für vollständige Seiten-Analyse
        await browserAPI.tabs.sendMessage(tab.id, {
            action: 'performFullAccessibilityCheck'
        });

        console.log('✅ Background: Accessibility check initiated');
    } catch (error) {
        console.error('❌ Background: Error in accessibility check:', error);
    }
}

// === HELPER-FUNKTIONEN ===

async function getElementInfo(tab) {
    try {
        // Content Script informieren und Element-Info abrufen
        await browserAPI.tabs.sendMessage(tab.id, {action: 'prepareElementInfo'});
        await new Promise(resolve => setTimeout(resolve, 150));

        const storageResult = await new Promise((resolve) => {
            browserAPI.storage.local.get(['temp_elementInfo', 'temp_timestamp'], (result) => {
                resolve(result || {});
            });
        });

        if (storageResult?.temp_elementInfo && storageResult?.temp_timestamp) {
            const age = Date.now() - storageResult.temp_timestamp;
            if (age < 30000) {
                return storageResult.temp_elementInfo;
            }
        }

        return null;
    } catch (error) {
        console.error('❌ Background: Error getting element info:', error);
        return null;
    }
}

async function openNoteWithContext(contextData) {
    // Stelle sicher, dass kritische Felder gesetzt sind
    if (!contextData.tagName) contextData.tagName = 'UNKNOWN';
    if (!contextData.elementType) contextData.elementType = 'Unbekannt';
    if (!contextData.detectedProblems) contextData.detectedProblems = [];

    const params = new URLSearchParams();
    params.set('contextData', JSON.stringify(contextData));

    const notePageUrl = browserAPI.runtime.getURL('note.html') + '?' + params.toString();
    browserAPI.tabs.create({ url: notePageUrl });
}

