# Publishing Checklist - Browser Extension Stores

## Pre-Submission Checklist

### ✅ Core Requirements (Completed)
- [x] Manifest.json updated to v1.0.0
- [x] Privacy Policy created (PRIVACY_POLICY.md)
- [x] Store descriptions written (DE + EN)
- [x] Icons directory created with requirements documented
- [x] Screenshot guide created
- [x] Product Backlog updated (Item #6 marked as not needed)

### 📋 Still Required Before Submission

#### Icons (CRITICAL - Required for both stores)
- [ ] Create icon-16.png (16x16)
- [ ] Create icon-32.png (32x32)
- [ ] Create icon-48.png (48x48)
- [ ] Create icon-128.png (128x128)
- [ ] Test icons on light/dark backgrounds
- [ ] Ensure proper transparency (alpha channel)

**See**: `/icons/ICON_REQUIREMENTS.md` for design guidelines

#### Screenshots (CRITICAL - Required for both stores)
- [ ] Screenshot 1: Notes overview with sample data
- [ ] Screenshot 2: Note editor with BITV selection
- [ ] Screenshot 3: BITV Dashboard (optional but recommended)
- [ ] Screenshot 4: Context menu (optional but recommended)
- [ ] Optimize images (< 5MB each)
- [ ] Save in `/screenshots/store/`

**See**: `/docs/STORE_SUBMISSION_GUIDE.md` for detailed instructions

#### Testing
- [ ] Test extension in Chrome (latest version)
- [ ] Test extension in Firefox (latest version)
- [ ] Test extension in Edge (latest version)
- [ ] Verify all features work correctly
- [ ] Check for console errors
- [ ] Test on various websites
- [ ] Verify BITV catalog loads correctly
- [ ] Test export functionality (PDF, TXT)
- [ ] Test screenshot capture
- [ ] Verify dark/light mode switching

#### Documentation
- [ ] Update README.md with v1.0.0 info
- [ ] Verify all links in documentation work
- [ ] Add contact email to PRIVACY_POLICY.md (line 73)
- [ ] Create CHANGELOG.md for version history

---

## Chrome Web Store Submission

### Account Setup
- [ ] Create Google Developer account ($5 one-time fee)
- [ ] Access Chrome Web Store Developer Dashboard
- [ ] Link: https://chrome.google.com/webstore/devconsole

### Package Preparation
- [ ] Create ZIP of extension root directory
- [ ] Exclude: `.git/`, `node_modules/`, `docs/`, `.vscode/`
- [ ] Include: All source files, manifest.json, icons/, scripts/, styles/
- [ ] Verify ZIP < 100MB (should be ~2-5MB)

**Command to create package:**
```bash
cd /mnt/c/projekte/claude/AccNotes
zip -r accnotes-chrome-v1.0.0.zip . \
  -x "*.git*" \
  -x "*node_modules*" \
  -x "*.vscode*" \
  -x "*docs/*" \
  -x "*screenshots/store/*"
```

### Store Listing Information
- [ ] Upload ZIP package
- [ ] Add detailed description (from STORE_DESCRIPTION.md)
- [ ] Upload screenshots (min. 1, recommended 3-5)
- [ ] Upload 128x128 icon for store listing
- [ ] Add promotional tile (440x280) - optional
- [ ] Set category: "Developer Tools" or "Productivity"
- [ ] Add privacy policy URL: `https://github.com/heikofolkerts/AccNotes/blob/main/PRIVACY_POLICY.md`
- [ ] Declare permissions and justify each one
- [ ] Choose distribution: Public
- [ ] Set pricing: Free

### Permissions Justification (for Chrome review)

**contextMenus**: Required to add right-click menu options for creating accessibility notes directly from web elements.

**tabs**: Required to retrieve current tab URL and page title for contextual note creation.

**activeTab**: Required to interact with the active webpage for element inspection and barrier detection.

**storage**: Required to save user notes locally in browser storage (no external servers).

**<all_urls>** and **file://*/***: Required to allow accessibility testing on any website and local files.

### Review Process
- [ ] Submit for review
- [ ] Typical review time: 1-3 business days
- [ ] Monitor email for review status
- [ ] Address any review feedback

---

## Firefox Add-ons Submission

### Account Setup
- [ ] Create Firefox Add-ons account (free)
- [ ] Access Firefox Developer Hub
- [ ] Link: https://addons.mozilla.org/developers/

### Package Preparation
- [ ] Create ZIP of extension (same as Chrome)
- [ ] Ensure manifest.json is compatible (v2 works for both)
- [ ] Test with Firefox's web-ext tool (optional but recommended)

**Command to validate:**
```bash
npx web-ext lint --source-dir=/mnt/c/projekte/claude/AccNotes
```

### Store Listing Information
- [ ] Upload ZIP package
- [ ] Choose Firefox version compatibility (Firefox 60+)
- [ ] Add detailed description (from STORE_DESCRIPTION.md)
- [ ] Upload screenshots (min. 1, recommended 3-5)
- [ ] Upload icon (48x48 minimum)
- [ ] Add privacy policy URL
- [ ] Set categories: "Developer Tools" and "Accessibility"
- [ ] Add support email/URL
- [ ] Add homepage URL: https://github.com/heikofolkerts/AccNotes
- [ ] Choose license: (Specify if open source - MIT, GPL, etc.)

### Source Code Submission
Firefox may require source code review for extensions with minified code.

- [ ] Check if any scripts are minified (jspdf.umd.min.js)
- [ ] Provide instructions to reproduce build (if applicable)
- [ ] For jspdf: Link to official CDN source

**Note**: If using external libraries, document their sources:
- jsPDF: https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js

### Review Process
- [ ] Submit for review
- [ ] Typical review time: 1-5 business days
- [ ] Monitor email for review status
- [ ] Address any review feedback

---

## Post-Publication Tasks

### After Chrome Web Store Approval
- [ ] Note extension URL (chrome.google.com/webstore/detail/[ID])
- [ ] Update README.md with installation link
- [ ] Create release on GitHub matching v1.0.0
- [ ] Announce on relevant communities (if applicable)

### After Firefox Add-ons Approval
- [ ] Note extension URL (addons.mozilla.org/firefox/addon/[slug])
- [ ] Update README.md with installation link
- [ ] Create release on GitHub (if not already done)

### Marketing & Distribution
- [ ] Update GitHub README with store badges
- [ ] Post in accessibility communities (German focus)
- [ ] Share with BITV testing community
- [ ] Consider blog post or announcement

### Monitoring
- [ ] Set up alerts for user reviews
- [ ] Monitor GitHub issues for bug reports
- [ ] Track usage statistics (if provided by stores)
- [ ] Plan for future updates based on feedback

---

## Quick Commands Reference

### Create Chrome Package
```bash
cd /mnt/c/projekte/claude/AccNotes
zip -r accnotes-chrome-v1.0.0.zip . -x "*.git*" -x "*node_modules*" -x "*.vscode*" -x "*docs/*"
```

### Create Firefox Package
```bash
cd /mnt/c/projekte/claude/AccNotes
zip -r accnotes-firefox-v1.0.0.zip . -x "*.git*" -x "*node_modules*" -x "*.vscode*" -x "*docs/*"
```

### Validate Firefox Package
```bash
npx web-ext lint --source-dir=/mnt/c/projekte/claude/AccNotes
```

### Test Firefox Extension Locally
```bash
npx web-ext run --source-dir=/mnt/c/projekte/claude/AccNotes
```

---

## Common Rejection Reasons & Solutions

### Chrome Web Store
1. **Missing privacy policy**: Added ✅
2. **Insufficient description**: Created detailed description ✅
3. **Missing screenshots**: Guide created, needs execution
4. **Unclear permissions**: Justifications documented above
5. **Misleading functionality**: Ensure title/description match features

### Firefox Add-ons
1. **Minified code without source**: Document jsPDF source
2. **Missing AMO-required fields**: Complete all listing fields
3. **Incompatible permissions**: Manifest v2 compatible ✅
4. **Unclear privacy policy**: Privacy policy created ✅

---

## Support Resources

### Chrome Web Store
- Developer Dashboard: https://chrome.google.com/webstore/devconsole
- Policy Guidelines: https://developer.chrome.com/docs/webstore/program-policies/
- Best Practices: https://developer.chrome.com/docs/webstore/best_practices/

### Firefox Add-ons
- Developer Hub: https://addons.mozilla.org/developers/
- Review Policies: https://extensionworkshop.com/documentation/publish/add-on-policies/
- Submission Guide: https://extensionworkshop.com/documentation/publish/submitting-an-add-on/

### General
- Manifest V2 Docs: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
- web-ext tool: https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/

---

**Status**: Ready for icon creation and screenshot generation, then packaging & submission!
