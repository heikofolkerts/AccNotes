#!/usr/bin/env node

/**
 * AccNotes Automated Screenshot Generator
 * Für Screenreader-Nutzer: Vollautomatische Screenshot-Erstellung
 */

const fs = require('fs');
const path = require('path');

// Sample notes data (same as in screenshot-generator.html)
const sampleNotes = [
  {
    id: "note_1",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    url: "https://www.berlin.de/buergerservice",
    title: "Bürgerservice Berlin - Barrieren",
    content: "Bild im Header hat keinen Alt-Text. Nutzer mit Screenreader können den Inhalt nicht erfassen.",
    elementType: "img",
    element: { type: "img", text: "", ariaLabel: "", role: "img" },
    fileName: "note-berlin-buergerservice.txt",
    bitvTest: {
      stepId: "1.1.1",
      stepTitle: "Nicht-Text-Inhalte",
      category: "wahrnehmbarkeit",
      evaluation: "failed",
      level: "A"
    },
    recommendation: "Alt-Attribut mit beschreibendem Text ergänzen"
  },
  {
    id: "note_2",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    url: "https://www.bundestag.de/formulare",
    title: "Bundestag Formulare - Button-Problem",
    content: "Submit-Button hat nur ein Icon ohne Text.",
    elementType: "button",
    element: { type: "button", text: "", ariaLabel: "", role: "button" },
    fileName: "note-bundestag-button.txt",
    bitvTest: {
      stepId: "4.1.2",
      stepTitle: "Name, Rolle, Wert",
      category: "robustheit",
      evaluation: "failed",
      level: "A"
    },
    recommendation: "aria-label hinzufügen"
  },
  {
    id: "note_3",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    url: "https://www.muenchen.de/rathaus/online-services",
    title: "München Online-Services - Formular",
    content: "Eingabefeld für E-Mail hat kein zugeordnetes Label.",
    elementType: "input",
    element: { type: "email", text: "", ariaLabel: "", role: "" },
    fileName: "note-muenchen-formular.txt",
    bitvTest: {
      stepId: "3.3.2",
      stepTitle: "Beschriftungen oder Anweisungen",
      category: "verstaendlichkeit",
      evaluation: "failed",
      level: "A"
    },
    recommendation: "Label-Element hinzufügen"
  },
  {
    id: "note_4",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    url: "https://www.hamburg.de/service",
    title: "Hamburg Service - Kontrast-Problem",
    content: "Hellgrauer Text auf weißem Hintergrund. Kontrast nur 2.8:1.",
    elementType: "text",
    element: { type: "p", text: "Wichtige Information", ariaLabel: "", role: "" },
    fileName: "note-hamburg-kontrast.txt",
    bitvTest: {
      stepId: "1.4.3",
      stepTitle: "Kontrast (Minimum)",
      category: "wahrnehmbarkeit",
      evaluation: "failed",
      level: "AA"
    },
    recommendation: "Textfarbe dunkler für 4.5:1 Kontrast"
  },
  {
    id: "note_5",
    timestamp: new Date(Date.now() - 432000000).toISOString(),
    url: "https://www.koeln.de/artikel",
    title: "Köln Artikel - Überschriften-Struktur",
    content: "Seite springt von H1 zu H3, H2 fehlt.",
    elementType: "heading",
    element: { type: "h3", text: "Unterabschnitt", ariaLabel: "", role: "heading" },
    fileName: "note-koeln-ueberschriften.txt",
    bitvTest: {
      stepId: "1.3.1",
      stepTitle: "Info und Beziehungen",
      category: "wahrnehmbarkeit",
      evaluation: "partial",
      level: "A"
    },
    recommendation: "Überschriften-Hierarchie korrigieren"
  }
];

console.log('🎯 AccNotes Screenshot Generator');
console.log('=================================\n');

// Check if Puppeteer is installed
try {
  require.resolve('puppeteer');
} catch (e) {
  console.log('❌ Puppeteer ist nicht installiert.');
  console.log('\n📦 Installation erforderlich:');
  console.log('   npm install puppeteer\n');
  console.log('oder verwende die manuelle Methode:');
  console.log('   Siehe /screenshots/SCREENSHOT_GUIDE_SCREENREADER.md\n');
  process.exit(1);
}

const puppeteer = require('puppeteer');

async function generateScreenshots() {
  console.log('🚀 Starte automatische Screenshot-Generierung...\n');

  let browser;
  try {
    // Launch browser
    console.log('📂 Öffne Browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    // Get extension path
    const extensionPath = path.join(__dirname, '..');
    const notesOverviewPath = `file://${path.join(extensionPath, 'notes-overview.html')}`;

    console.log('💾 Lade Beispieldaten in LocalStorage...');

    // Load notes overview and inject sample data
    await page.goto(notesOverviewPath, { waitUntil: 'networkidle0' });

    // Inject sample notes into localStorage
    await page.evaluate((notes) => {
      localStorage.setItem('accnotes', JSON.stringify(notes));
      location.reload();
    }, sampleNotes);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Screenshot 1: Notes Overview
    console.log('📸 Screenshot 1: Notizen-Übersicht...');
    const screenshot1Path = path.join(__dirname, 'store', 'screenshot-1-overview.png');
    await page.screenshot({
      path: screenshot1Path,
      fullPage: true
    });
    console.log(`   ✅ Gespeichert: ${screenshot1Path}`);

    // Screenshot 2: BITV Dashboard (enable dashboard)
    console.log('📸 Screenshot 2: BITV Dashboard...');
    await page.evaluate(() => {
      const dashboardCheckbox = document.getElementById('toggle-dashboard');
      if (dashboardCheckbox) {
        dashboardCheckbox.checked = true;
        dashboardCheckbox.dispatchEvent(new Event('change'));
      }
    });
    await new Promise(resolve => setTimeout(resolve, 500));

    const screenshot2Path = path.join(__dirname, 'store', 'screenshot-2-dashboard.png');
    await page.screenshot({
      path: screenshot2Path,
      fullPage: true
    });
    console.log(`   ✅ Gespeichert: ${screenshot2Path}`);

    // Screenshot 3: Note Editor (open first note)
    console.log('📸 Screenshot 3: Notiz-Editor...');
    const noteEditorPath = `file://${path.join(extensionPath, 'note.html')}?id=note_1`;
    await page.goto(noteEditorPath, { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 500));

    const screenshot3Path = path.join(__dirname, 'store', 'screenshot-3-note-editor.png');
    await page.screenshot({
      path: screenshot3Path,
      fullPage: true
    });
    console.log(`   ✅ Gespeichert: ${screenshot3Path}`);

    console.log('\n✨ Alle Screenshots erfolgreich erstellt!');
    console.log('\n📁 Speicherort: /screenshots/store/');
    console.log('   - screenshot-1-overview.png');
    console.log('   - screenshot-2-dashboard.png');
    console.log('   - screenshot-3-note-editor.png');

    console.log('\n🎉 Bereit für Store-Submission!');
    console.log('   Nächster Schritt: Siehe /docs/PUBLISHING_CHECKLIST.md\n');

  } catch (error) {
    console.error('\n❌ Fehler bei Screenshot-Generierung:', error.message);
    console.log('\n💡 Alternative: Verwende manuelle Methode');
    console.log('   Siehe /screenshots/SCREENSHOT_GUIDE_SCREENREADER.md\n');
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Ensure store directory exists
const storeDir = path.join(__dirname, 'store');
if (!fs.existsSync(storeDir)) {
  fs.mkdirSync(storeDir, { recursive: true });
}

// Run
generateScreenshots();
