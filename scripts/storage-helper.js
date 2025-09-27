// Storage Helper für persistente Notizen-Speicherung
// Cross-Browser: Verwendet this.storage (Chrome/Edge) oder browser.storage.local (Firefox)

const StorageHelper = {
    // Cross-Browser Storage API Detection
    get storage() {
        if (typeof browser !== 'undefined' && browser.storage) {
            return browser.storage.local;  // Firefox native API
        } else if (typeof chrome !== 'undefined' && chrome.storage) {
            return this.storage;   // Chrome/Edge API
        } else {
            throw new Error('Keine unterstützte Storage-API gefunden');
        }
    },

    // Browser-Detection für Debugging
    get browserInfo() {
        if (typeof browser !== 'undefined') {
            return 'Firefox (WebExtensions)';
        } else if (typeof chrome !== 'undefined') {
            return 'Chrome/Edge (Extensions API)';
        } else {
            return 'Unbekannt';
        }
    },
    // Präfix für alle Notizen-Keys
    NOTE_PREFIX: 'note_',
    SETTINGS_KEY: 'accnotes_settings',

    // Einzelne Notiz speichern
    async saveNote(noteId, noteData) {
        try {
            const key = noteId.startsWith(this.NOTE_PREFIX) ? noteId : `${this.NOTE_PREFIX}${noteId}`;
            await this.storage.set({ [key]: noteData });
            return true;
        } catch (error) {
            console.error('Fehler beim Speichern der Notiz:', error);
            return false;
        }
    },

    // Einzelne Notiz laden
    async loadNote(noteId) {
        try {
            const key = noteId.startsWith(this.NOTE_PREFIX) ? noteId : `${this.NOTE_PREFIX}${noteId}`;
            const result = await this.storage.get([key]);
            return result[key] || null;
        } catch (error) {
            console.error('Fehler beim Laden der Notiz:', error);
            return null;
        }
    },

    // Alle Notizen laden
    async loadAllNotes() {
        try {
            const result = await this.storage.get(null);
            const notes = [];

            for (const [key, value] of Object.entries(result)) {
                if (key.startsWith(this.NOTE_PREFIX)) {
                    notes.push({
                        id: key,
                        ...value
                    });
                }
            }

            return notes;
        } catch (error) {
            console.error('Fehler beim Laden aller Notizen:', error);
            return [];
        }
    },

    // Notiz löschen
    async deleteNote(noteId) {
        try {
            const key = noteId.startsWith(this.NOTE_PREFIX) ? noteId : `${this.NOTE_PREFIX}${noteId}`;
            await this.storage.remove([key]);
            return true;
        } catch (error) {
            console.error('Fehler beim Löschen der Notiz:', error);
            return false;
        }
    },

    // Alle Notizen löschen
    async clearAllNotes() {
        try {
            const result = await this.storage.get(null);
            const noteKeys = Object.keys(result).filter(key => key.startsWith(this.NOTE_PREFIX));

            if (noteKeys.length > 0) {
                await this.storage.remove(noteKeys);
            }

            return true;
        } catch (error) {
            console.error('Fehler beim Löschen aller Notizen:', error);
            return false;
        }
    },

    // Migration von localStorage zu chrome.storage
    async migrateFromLocalStorage() {
        try {
            console.log(`AccNotes: Initialisiere Storage (${this.browserInfo})`);
            const migrated = [];

            // Prüfe localStorage auf vorhandene Notizen
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.NOTE_PREFIX)) {
                    try {
                        const noteData = JSON.parse(localStorage.getItem(key));
                        await this.saveNote(key, noteData);
                        migrated.push(key);
                        localStorage.removeItem(key); // Entferne aus localStorage
                    } catch (e) {
                        console.warn('Konnte Notiz nicht migrieren:', key, e);
                    }
                }
            }

            console.log(`Migration abgeschlossen: ${migrated.length} Notizen migriert`);
            return migrated;
        } catch (error) {
            console.error('Fehler bei Migration:', error);
            return [];
        }
    },

    // Settings speichern/laden
    async saveSettings(settings) {
        try {
            await this.storage.set({ [this.SETTINGS_KEY]: settings });
            return true;
        } catch (error) {
            console.error('Fehler beim Speichern der Einstellungen:', error);
            return false;
        }
    },

    async loadSettings() {
        try {
            const result = await this.storage.get([this.SETTINGS_KEY]);
            return result[this.SETTINGS_KEY] || {};
        } catch (error) {
            console.error('Fehler beim Laden der Einstellungen:', error);
            return {};
        }
    },

    // Storage-Statistiken
    async getStorageStats() {
        try {
            const result = await this.storage.get(null);
            const noteCount = Object.keys(result).filter(key => key.startsWith(this.NOTE_PREFIX)).length;
            const totalSize = JSON.stringify(result).length;

            return {
                noteCount,
                totalSize,
                totalSizeKB: Math.round(totalSize / 1024),
                maxSizeKB: 5 * 1024, // this.storage limit: ~5MB
                usagePercent: Math.round((totalSize / (5 * 1024 * 1024)) * 100)
            };
        } catch (error) {
            console.error('Fehler beim Abrufen der Storage-Statistiken:', error);
            return null;
        }
    }
};

// Globale Verfügbarkeit
if (typeof window !== 'undefined') {
    window.StorageHelper = StorageHelper;
}