# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AccNotes is a browser extension for BITV (German accessibility standard) compliance testing. It provides an automated end-to-end workflow from barrier detection to BITV-compliant documentation. The extension is built with vanilla JavaScript (ES6+) and follows WCAG 2.1 AA standards.

## Architecture

### Core Technology Stack
- **Browser Extension**: Manifest V2
- **Language**: Vanilla JavaScript (ES6+) - NO FRAMEWORKS
- **Storage**: LocalStorage for data persistence
- **Styling**: CSS Grid/Flexbox with CSS Custom Properties
- **Accessibility**: WCAG 2.1 AA compliant design

### Key Components

```
AccNotes/
├── manifest.json              # Extension manifest (v0.5.0)
├── background.js              # Service worker/background script
├── content.js                 # Content script (context menu integration)
├── note.html + note.js        # Individual note editor
├── notes-overview.html + .js  # Main application (notes overview)
├── help.html + help.js        # Help system
├── styles/modern-theme.css    # Design system with dark/light modes
├── scripts/
│   ├── theme-toggle.js        # Dark/Light mode functionality
│   ├── bitv-catalog.js        # BITV test step database (54 steps)
│   ├── storage-helper.js      # LocalStorage utilities
│   └── barrier-detector.js    # Automatic barrier detection
└── docs/                      # Project documentation
```

## Development Commands

Since this is a browser extension without build tools, there are no npm scripts or build commands. Development workflow:

1. **Load extension in browser**:
   - Chrome: Open `chrome://extensions/`, enable "Developer mode", click "Load unpacked"
   - Firefox: Open `about:debugging`, click "This Firefox", click "Load Temporary Add-on"

2. **Testing changes**: Reload the extension after modifications

3. **No build process**: Files are served directly - no compilation needed

## Core Data Models

### Note Structure (localStorage)
```javascript
{
  id: "note_1734960000000",           // Unique timestamp-based ID
  timestamp: "2024-12-24T10:00:00Z",  // ISO string
  url: "https://example.com/page",    // Page URL
  title: "Page title",                // Auto or manual title
  content: "Note description",        // Main note content
  elementType: "button",              // Element type (button, link, etc.)
  element: {                          // Element details with ARIA extraction
    type: "button",
    text: "Click me",
    ariaLabel: "Navigation Button",
    role: "button"
  },
  fileName: "note-example.txt",       // Export filename

  // BITV-specific data (optional)
  bitvTest: {
    stepId: "1.1.1",                  // BITV test step ID
    stepTitle: "Nicht-Text-Inhalte",  // Test step title
    category: "wahrnehmbarkeit",      // BITV category
    evaluation: "failed",             // passed/failed/partial/needs_review
    level: "A",                       // WCAG level (A/AA/AAA)
    description: "..."                // Test step description
  },
  recommendation: "Improvement suggestion"
}
```

### BITV Integration
- **54 BITV test steps** from bit-inklusiv.de (official German accessibility testing standard)
- **5 main categories**: Wahrnehmbarkeit, Bedienbarkeit, Verständlichkeit, Robustheit, Interoperabilität
- **4 evaluation levels**: Bestanden, Nicht bestanden, Teilweise, Zu überprüfen

## Key Features

### Automatic Barrier Detection (scripts/barrier-detector.js)
- **5 detection algorithms**: Alt-text, button labels, form labels, contrast, heading structure
- **Performance-optimized**: <200ms element analysis
- **Citizen-friendly descriptions**: "Button-Beschriftung fehlt" instead of technical BITV IDs
- **Automatic BITV mapping**: Problems automatically mapped to correct test steps

### Advanced Filtering & Performance (notes-overview.js)
```javascript
// Smart caching system for filter operations
let filteredNotesCache = null;
let lastFilterHash = '';
const PERFORMANCE_THRESHOLD = 200; // ms

// Virtualization for large datasets
if (filteredNotes.length > 100) {
    renderNotesVirtualized(container, filteredNotes);
}
```

### BITV Dashboard Analytics
- **Progress scoring**: Weighted compliance calculation
- **Problem website identification**: Top 5 most problematic sites
- **Category compliance**: Percentage BITV performance per category
- **Cross-website analysis**: Comparative metrics

## Code Conventions

### JavaScript Standards
- **Pure vanilla JavaScript** - NO frameworks or libraries
- **ES6+ features**: arrow functions, destructuring, template literals
- **Modular functions** with clear responsibilities
- **German localization**: UI and technical terminology
- **Performance-first**: Caching and optimization for large datasets

### CSS Standards
- **Modern CSS**: Custom Properties, Grid, Flexbox
- **Design tokens**: Consistent spacing, colors, typography
- **WCAG AA compliance**: 4.5:1 contrast minimum
- **Dark/light modes**: System preference detection + manual toggle

### Accessibility Requirements
- **WCAG 2.1 AA compliance** for all UI components
- **Screen reader optimization**: Proper ARIA labels and roles
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Visible focus indicators

## Performance Requirements

- **<200ms rendering** for 1000+ notes
- **Smart caching** for repeated filter operations
- **Memory efficient**: No memory leaks with large datasets
- **Responsive UI**: Smooth interaction even with many notes

## Important File Locations

### Core Functionality
- `notes-overview.js`: Main application logic, filtering, BITV dashboard
- `note.js`: Individual note creation/editing with BITV integration
- `scripts/bitv-catalog.js`: Complete BITV test step database
- `scripts/barrier-detector.js`: Automatic accessibility problem detection

### UI & Styling
- `styles/modern-theme.css`: Complete design system with dark/light modes
- `scripts/theme-toggle.js`: Theme switching functionality

### Storage & Data
- `scripts/storage-helper.js`: LocalStorage utilities and data management

## Testing Approach

No automated test framework - manual testing workflow:
1. Load extension in browser
2. Test on various websites
3. Verify barrier detection accuracy
4. Check BITV mapping correctness
5. Test performance with large note collections
6. Verify WCAG AA compliance

## Key APIs

### BITV Catalog API (scripts/bitv-catalog.js)
```javascript
BitvCatalog.getCategories()        // All BITV categories
BitvCatalog.getStepsByCategory()   // Test steps per category
BitvCatalog.getStepById()          // Individual test step
BitvCatalog.validateStep()         // Test step validation
```

### Storage Helper API (scripts/storage-helper.js)
```javascript
StorageHelper.saveNote()           // Save note to localStorage
StorageHelper.getAllNotes()        // Retrieve all notes
StorageHelper.deleteNote()         // Delete specific note
StorageHelper.exportNotes()        // Export to various formats
```

## Development Guidelines

### When adding new features:
1. **Follow existing patterns** - examine similar components first
2. **Maintain performance** - implement caching for expensive operations
3. **Ensure accessibility** - test with screen readers and keyboard navigation
4. **Use German terminology** - follow BITV/accessibility standards terminology
5. **Update documentation** - especially context.md for architectural changes

### When modifying UI:
1. **Follow design system** - use existing CSS custom properties
2. **Test both themes** - light and dark mode
3. **Verify WCAG compliance** - check contrast ratios and keyboard access
4. **Test responsive behavior** - multiple screen sizes

### When working with BITV integration:
1. **Reference bit-inklusiv.de** - official German BITV standard
2. **Maintain mapping accuracy** - problem detection to BITV test steps
3. **Use correct German terminology** - official BITV language
4. **Preserve evaluation structure** - 4-level assessment system