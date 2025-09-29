// Screenshot Helper für AccNotes
// Erstellt Screenshots von problematischen Elementen für die Dokumentation

if (typeof window.ScreenshotHelper === 'undefined') {
    window.ScreenshotHelper = {

        // Canvas-Element für Screenshot-Erstellung
        canvas: null,
        context: null,

        // Initialisierung
        init() {
            console.log('📷 ScreenshotHelper initializing...');
            this.canvas = document.getElementById('screenshot-canvas');
            if (this.canvas) {
                this.context = this.canvas.getContext('2d');
                console.log('✅ Screenshot canvas ready');
            }
        },

        // Hauptfunktion: Screenshot von Element und Umgebung erstellen
        async captureElementScreenshot(element, options = {}) {
            console.log('📷 Capturing screenshot for element:', element?.tagName);

            try {
                const config = {
                    padding: options.padding || 20,
                    highlightElement: options.highlight !== false,
                    maxWidth: options.maxWidth || 800,
                    maxHeight: options.maxHeight || 600,
                    quality: options.quality || 0.8,
                    ...options
                };

                // Element-Position und -Größe ermitteln
                const elementRect = this.getElementBounds(element);
                if (!elementRect) {
                    throw new Error('Element-Grenzen konnten nicht ermittelt werden');
                }

                // Screenshot-Bereich berechnen (Element + Kontext)
                const captureRect = this.calculateCaptureArea(elementRect, config);

                // Tab-Screenshot erstellen (Chrome Extension API)
                const tabScreenshot = await this.captureTabScreenshot();

                // Element-Bereich aus Tab-Screenshot extrahieren
                const elementScreenshot = await this.extractElementArea(
                    tabScreenshot,
                    captureRect,
                    config
                );

                // Element hervorheben (optional)
                if (config.highlightElement) {
                    this.highlightElementOnScreenshot(
                        elementScreenshot,
                        elementRect,
                        captureRect,
                        config
                    );
                }

                console.log('✅ Screenshot successfully captured');
                return {
                    success: true,
                    dataUrl: elementScreenshot,
                    dimensions: captureRect,
                    timestamp: new Date().toISOString()
                };

            } catch (error) {
                console.error('❌ Screenshot capture failed:', error);
                return {
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        },

        // Element-Grenzen ermitteln (inklusive Scroll-Position)
        getElementBounds(element) {
            if (!element || !element.getBoundingClientRect) {
                return null;
            }

            const rect = element.getBoundingClientRect();
            const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;

            return {
                x: rect.left + scrollX,
                y: rect.top + scrollY,
                width: rect.width,
                height: rect.height,
                viewportX: rect.left,
                viewportY: rect.top
            };
        },

        // Screenshot-Bereich berechnen (Element + Kontext)
        calculateCaptureArea(elementRect, config) {
            const padding = config.padding;

            // Basis-Capture-Bereich: Element + Padding
            let captureArea = {
                x: Math.max(0, elementRect.viewportX - padding),
                y: Math.max(0, elementRect.viewportY - padding),
                width: elementRect.width + (padding * 2),
                height: elementRect.height + (padding * 2)
            };

            // Viewport-Grenzen berücksichtigen
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Bereich an Viewport-Grenzen anpassen
            if (captureArea.x + captureArea.width > viewportWidth) {
                captureArea.width = viewportWidth - captureArea.x;
            }

            if (captureArea.y + captureArea.height > viewportHeight) {
                captureArea.height = viewportHeight - captureArea.y;
            }

            // Maximale Dimensionen einhalten
            if (captureArea.width > config.maxWidth) {
                const scale = config.maxWidth / captureArea.width;
                captureArea.width = config.maxWidth;
                captureArea.height = Math.round(captureArea.height * scale);
            }

            if (captureArea.height > config.maxHeight) {
                const scale = config.maxHeight / captureArea.height;
                captureArea.height = config.maxHeight;
                captureArea.width = Math.round(captureArea.width * scale);
            }

            return captureArea;
        },

        // Tab-Screenshot erstellen (via Chrome Extension API)
        async captureTabScreenshot() {
            return new Promise((resolve, reject) => {
                if (typeof chrome !== 'undefined' && chrome.tabs) {
                    // Chrome Extension-Kontext
                    chrome.tabs.captureVisibleTab(null, {
                        format: 'png',
                        quality: 90
                    }, (dataUrl) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(dataUrl);
                        }
                    });
                } else {
                    // Alternative: html2canvas (falls verfügbar) oder Fallback
                    reject(new Error('Chrome tabs API nicht verfügbar - Browser-Extension erforderlich'));
                }
            });
        },

        // Element-Bereich aus Tab-Screenshot extrahieren
        async extractElementArea(tabScreenshotDataUrl, captureRect, config) {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    try {
                        // Canvas für Extraktion erstellen
                        const extractCanvas = document.createElement('canvas');
                        const extractCtx = extractCanvas.getContext('2d');

                        extractCanvas.width = captureRect.width;
                        extractCanvas.height = captureRect.height;

                        // Bereich aus Tab-Screenshot extrahieren
                        extractCtx.drawImage(
                            img,
                            captureRect.x, captureRect.y, captureRect.width, captureRect.height,
                            0, 0, captureRect.width, captureRect.height
                        );

                        // Als Data URL exportieren
                        const extractedDataUrl = extractCanvas.toDataURL('image/png', config.quality);
                        resolve(extractedDataUrl);

                    } catch (error) {
                        reject(new Error(`Screenshot-Extraktion fehlgeschlagen: ${error.message}`));
                    }
                };

                img.onerror = () => {
                    reject(new Error('Tab-Screenshot konnte nicht geladen werden'));
                };

                img.src = tabScreenshotDataUrl;
            });
        },

        // Element auf Screenshot hervorheben
        highlightElementOnScreenshot(screenshotDataUrl, elementRect, captureRect, config) {
            return new Promise((resolve, reject) => {
                const img = new Image();

                img.onload = () => {
                    try {
                        // Canvas für Highlighting erstellen
                        const highlightCanvas = document.createElement('canvas');
                        const highlightCtx = highlightCanvas.getContext('2d');

                        highlightCanvas.width = captureRect.width;
                        highlightCanvas.height = captureRect.height;

                        // Original-Screenshot zeichnen
                        highlightCtx.drawImage(img, 0, 0);

                        // Element-Position relativ zum Screenshot-Bereich
                        const relativeX = elementRect.viewportX - captureRect.x;
                        const relativeY = elementRect.viewportY - captureRect.y;

                        // Highlight-Rahmen zeichnen
                        highlightCtx.strokeStyle = '#ff0000';
                        highlightCtx.lineWidth = 3;
                        highlightCtx.setLineDash([5, 5]);
                        highlightCtx.strokeRect(
                            relativeX,
                            relativeY,
                            elementRect.width,
                            elementRect.height
                        );

                        // Semi-transparente Highlight-Füllung
                        highlightCtx.fillStyle = 'rgba(255, 0, 0, 0.1)';
                        highlightCtx.fillRect(
                            relativeX,
                            relativeY,
                            elementRect.width,
                            elementRect.height
                        );

                        // Hervorgehobenen Screenshot zurückgeben
                        const highlightedDataUrl = highlightCanvas.toDataURL('image/png', config.quality);
                        resolve(highlightedDataUrl);

                    } catch (error) {
                        reject(new Error(`Element-Highlighting fehlgeschlagen: ${error.message}`));
                    }
                };

                img.onerror = () => {
                    reject(new Error('Screenshot für Highlighting konnte nicht geladen werden'));
                };

                img.src = screenshotDataUrl;
            });
        },

        // Screenshot-Vorschau anzeigen
        showScreenshotPreview(screenshotData) {
            const previewContainer = document.getElementById('screenshot-preview');
            const canvas = document.getElementById('screenshot-canvas');
            const info = document.getElementById('screenshot-info');

            if (!previewContainer || !canvas || !info) {
                console.warn('Screenshot-Vorschau-Elemente nicht gefunden');
                return;
            }

            if (screenshotData.success) {
                // Canvas mit Screenshot-Daten füllen
                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    this.context.drawImage(img, 0, 0);

                    // Info aktualisieren
                    info.textContent = `Screenshot erfolgreich erstellt (${img.width}×${img.height}px)`;
                    info.style.color = 'var(--success-color, #2e7d32)';

                    // Vorschau anzeigen
                    previewContainer.style.display = 'block';
                };
                img.src = screenshotData.dataUrl;

            } else {
                // Fehler anzeigen
                info.textContent = `Screenshot-Fehler: ${screenshotData.error}`;
                info.style.color = 'var(--error-color, #c62828)';
                previewContainer.style.display = 'block';
            }
        },

        // Screenshot-Vorschau ausblenden
        hideScreenshotPreview() {
            const previewContainer = document.getElementById('screenshot-preview');
            if (previewContainer) {
                previewContainer.style.display = 'none';
            }
        },

        // Screenshot-Daten für Speicherung vorbereiten
        prepareScreenshotForStorage(screenshotData, noteData) {
            if (!screenshotData.success) {
                return null;
            }

            return {
                dataUrl: screenshotData.dataUrl,
                timestamp: screenshotData.timestamp,
                dimensions: screenshotData.dimensions,
                elementInfo: {
                    tagName: noteData.elementType,
                    text: noteData.text,
                    url: noteData.url
                },
                metadata: {
                    captureMethod: 'browser-extension',
                    version: '1.0.0',
                    noteId: noteData.id
                }
            };
        }
    };

    console.log('✅ ScreenshotHelper successfully defined');
} else {
    console.log('ℹ️ ScreenshotHelper already exists, skipping redefinition');
}