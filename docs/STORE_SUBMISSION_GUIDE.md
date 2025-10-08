# Store Submission Guide - AccNotes

## Required Screenshots

### Chrome Web Store Requirements
- **Minimum**: 1 screenshot (1280x800 or 640x400)
- **Recommended**: 3-5 screenshots
- **Format**: PNG or JPG
- **Show**: Main features and UI

### Firefox Add-ons Requirements
- **Minimum**: 1 screenshot
- **Recommended**: 3-5 screenshots
- **Max size**: 5MB per image
- **Format**: PNG, JPG, or GIF

### Screenshot Suggestions

#### 1. **Main Notes Overview** (Required)
- Show: notes-overview.html with multiple notes
- Highlight: Filter/search functionality, BITV dashboard
- Theme: Light mode (default)

#### 2. **Note Creation/Editing** (Required)
- Show: note.html with BITV test step selection
- Highlight: Element detection, automatic problem detection
- Theme: Could show dark mode

#### 3. **BITV Dashboard Analytics** (Recommended)
- Show: Dashboard with compliance metrics
- Highlight: Progress scoring, problematic websites

#### 4. **Context Menu Integration** (Recommended)
- Show: Right-click context menu with problem detection
- Highlight: Intelligent problem-specific menu items

#### 5. **Barrier Detection in Action** (Optional)
- Show: Detected accessibility problem on real website
- Highlight: Automatic BITV mapping

## How to Create Screenshots

### Method 1: Manual Screenshots
1. Load extension in browser
2. Navigate to notes-overview.html
3. Add sample notes for demonstration
4. Use browser screenshot tool or OS screenshot
5. Crop to appropriate size

### Method 2: Browser DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Set dimensions (1280x800)
4. Take screenshot via DevTools

### Method 3: Extension Screenshot Tool
1. Use built-in screenshot helper (scripts/screenshot-helper.js)
2. Programmatic capture of extension pages

## Checklist Before Screenshots

- [ ] Add 5-10 sample notes with various BITV test steps
- [ ] Ensure dark/light mode looks good
- [ ] Test with different screen sizes
- [ ] Show realistic data (no "Test123" content)
- [ ] Use German language content (BITV is German standard)
- [ ] Ensure WCAG AA contrast in all screenshots
- [ ] Remove any sensitive URLs or personal data

## Sample Data for Screenshots

### Sample Notes to Create

**Note 1: Missing Alt-Text**
- Element: `<img>` without alt
- BITV: 1.1.1 - Nicht-Text-Inhalte
- Status: Nicht bestanden
- URL: https://example-government-site.de

**Note 2: Button Without Label**
- Element: `<button>` icon-only
- BITV: 4.1.2 - Name, Rolle, Wert
- Status: Nicht bestanden
- URL: https://example-public-service.de

**Note 3: Contrast Issue**
- Element: Text on background
- BITV: 1.4.3 - Kontrast (Minimum)
- Status: Teilweise bestanden
- URL: https://example-municipality.de

**Note 4: Form Label Missing**
- Element: `<input>` without `<label>`
- BITV: 3.3.2 - Beschriftungen oder Anweisungen
- Status: Nicht bestanden
- URL: https://example-form.de

**Note 5: Heading Structure**
- Element: Skipped heading level
- BITV: 1.3.1 - Info und Beziehungen
- Status: Zu überprüfen
- URL: https://example-content.de

## File Naming Convention

Save screenshots as:
- `screenshot-1-overview.png` - Main overview
- `screenshot-2-note-editor.png` - Note creation
- `screenshot-3-dashboard.png` - BITV dashboard
- `screenshot-4-context-menu.png` - Context menu
- `screenshot-5-detection.png` - Barrier detection

Store in: `/screenshots/store/`
