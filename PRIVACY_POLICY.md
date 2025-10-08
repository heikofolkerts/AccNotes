# Privacy Policy - AccNotes Browser Extension

**Last Updated:** December 2024
**Version:** 1.0.0

## Overview

AccNotes is a browser extension designed to help users document accessibility barriers according to BITV (German accessibility standards). This privacy policy explains how AccNotes handles your data.

## Data Collection and Storage

### What Data is Stored

AccNotes stores the following data **locally on your device only**:

- **Notes and Observations**: Your manually created accessibility notes
- **Element Information**: Details about web elements you annotate (element type, text content, ARIA labels)
- **URLs**: Web addresses of pages where you create notes
- **BITV Test Steps**: Selected BITV test step references
- **Screenshots**: Optional screenshots you capture (stored locally)
- **User Preferences**: Theme settings (dark/light mode), filter preferences

### Where Data is Stored

All data is stored **exclusively in your browser's local storage** (localStorage). This means:

- ✅ Data never leaves your device
- ✅ No data is transmitted to external servers
- ✅ No cloud storage or synchronization
- ✅ Complete data privacy and control

### No Personal Information Collection

AccNotes does **NOT** collect, store, or transmit:

- ❌ Personal identification information
- ❌ Browsing history
- ❌ Login credentials or passwords
- ❌ Analytics or tracking data
- ❌ User behavior metrics
- ❌ IP addresses

## Permissions Explained

AccNotes requests the following browser permissions:

### `contextMenus`
- **Purpose**: Adds context menu (right-click) options for creating notes
- **Data Access**: None

### `tabs`
- **Purpose**: Gets current tab URL and page title for note context
- **Data Access**: Only current tab URL and title when you create a note

### `activeTab`
- **Purpose**: Interacts with the currently active webpage
- **Data Access**: Only when you explicitly trigger note creation

### `storage`
- **Purpose**: Saves your notes in browser's local storage
- **Data Access**: Local storage only (no external access)

### `<all_urls>` and `file://*/*`
- **Purpose**: Allows the extension to work on any website and local files
- **Data Access**: Only when you explicitly create notes

## Data Retention

- Data is stored **indefinitely** in your browser until you:
  - Manually delete individual notes
  - Use the bulk delete feature
  - Clear browser data/cache
  - Uninstall the extension

## Data Export and Deletion

### Export Your Data
You can export your notes at any time:
- Export individual notes as text files
- Bulk export all notes
- Export in various formats (TXT, PDF, etc.)

### Delete Your Data
You have full control to delete data:
- Delete individual notes via the interface
- Bulk delete with filters
- Complete data removal by clearing browser storage or uninstalling

## Third-Party Services

AccNotes does **NOT** use any third-party services:
- ❌ No analytics services (Google Analytics, etc.)
- ❌ No external APIs
- ❌ No cloud storage providers
- ❌ No advertising networks
- ❌ No tracking pixels

## Open Source

AccNotes is open source software. You can review the complete source code at:
- **GitHub**: https://github.com/heikofolkerts/AccNotes

## Updates to This Policy

We may update this privacy policy. Changes will be reflected in the "Last Updated" date. Continued use of AccNotes after updates constitutes acceptance of the revised policy.

## Contact

For privacy-related questions or concerns:
- **GitHub Issues**: https://github.com/heikofolkerts/AccNotes/issues
- **Email**: [Your contact email]

## Compliance

### GDPR Compliance (EU)
- ✅ No personal data processing
- ✅ Data stored locally only
- ✅ No data transfer outside device
- ✅ Full user control over data

### German Data Protection (BDSG)
- ✅ Complies with German data protection regulations
- ✅ No collection of personal data (§ 3 Abs. 1 BDSG)
- ✅ Local storage only

## Your Rights

Under GDPR and BDSG, you have the right to:
- **Access**: Review all stored data via the extension interface
- **Rectification**: Edit any note or data entry
- **Erasure**: Delete any or all data at any time
- **Data Portability**: Export data in standard formats
- **Transparency**: Inspect source code for data handling

---

**Summary**: AccNotes respects your privacy. All data stays on your device. No tracking, no external storage, no data collection. You have complete control.
