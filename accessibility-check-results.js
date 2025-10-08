// Accessibility Check Results Page - Main Logic
console.log('🚀 Accessibility Check Results page loading...');

// Cross-Browser API
const browserAPI = (typeof chrome !== 'undefined' && chrome.runtime) ? chrome : browser;

// State
let allProblems = [];
let selectedProblems = new Set();
let pageInfo = {
    url: '',
    title: ''
};

// Initialize page
document.addEventListener('DOMContentLoaded', initializePage);

async function initializePage() {
    console.log('🔄 Initializing results page...');

    try {
        // Load results from storage
        const result = await new Promise((resolve) => {
            browserAPI.storage.local.get(['temp_accessibilityCheckResults', 'temp_accessibilityCheckTimestamp'], (data) => {
                resolve(data || {});
            });
        });

        if (!result.temp_accessibilityCheckResults) {
            console.warn('⚠️ No accessibility check results found in storage');
            showEmptyState();
            return;
        }

        // Check if results are too old (> 5 minutes)
        const age = Date.now() - (result.temp_accessibilityCheckTimestamp || 0);
        if (age > 300000) {
            console.warn('⚠️ Results are too old (> 5 minutes)');
            showEmptyState();
            return;
        }

        allProblems = result.temp_accessibilityCheckResults;
        console.log(`✅ Loaded ${allProblems.length} problems`);

        // Extract page info from first problem
        if (allProblems.length > 0) {
            pageInfo.url = allProblems[0].url || '';
            pageInfo.title = allProblems[0].pageTitle || 'Unbekannte Seite';
        }

        // Hide loading state
        document.getElementById('loading-state').style.display = 'none';

        if (allProblems.length === 0) {
            showEmptyState();
        } else {
            showResults();
        }

    } catch (error) {
        console.error('❌ Error initializing results page:', error);
        showErrorState(error.message);
    }
}

function showResults() {
    // Show results summary
    const summaryElement = document.getElementById('results-summary');
    summaryElement.style.display = 'block';
    document.getElementById('total-problems-count').textContent = allProblems.length;
    document.getElementById('page-title-display').textContent = pageInfo.title;
    document.getElementById('page-url-display').textContent = pageInfo.url;

    // Show controls
    document.getElementById('results-controls').style.display = 'flex';

    // Show action buttons
    document.getElementById('action-buttons').style.display = 'flex';

    // Render problem list
    renderProblemList();

    // Select all by default
    selectAll();

    // Setup event listeners
    setupEventListeners();
}

function renderProblemList() {
    const listElement = document.getElementById('problem-list');
    listElement.innerHTML = '';

    allProblems.forEach((problemData, index) => {
        const listItem = createProblemListItem(problemData, index);
        listElement.appendChild(listItem);
    });
}

function createProblemListItem(problemData, index) {
    const { problem, elementInfo } = problemData;

    const li = document.createElement('li');
    li.className = 'problem-item';
    li.dataset.index = index;

    // Checkbox
    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'problem-checkbox-wrapper';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `problem-${index}`;
    checkbox.className = 'problem-checkbox';
    checkbox.checked = true;
    checkbox.addEventListener('change', () => handleCheckboxChange(index, checkbox.checked));

    const content = document.createElement('div');
    content.className = 'problem-content';

    // Problem title
    const titleLabel = document.createElement('label');
    titleLabel.htmlFor = `problem-${index}`;
    titleLabel.className = 'problem-title';
    titleLabel.textContent = problem.title || 'Unbekanntes Problem';

    // Add BITV badge if available
    if (problem.bitvStep) {
        const badge = document.createElement('span');
        badge.className = 'bitv-badge';
        badge.textContent = `BITV ${problem.bitvStep}`;
        titleLabel.appendChild(badge);
    }

    // Problem description
    const description = document.createElement('p');
    description.className = 'problem-description';
    description.textContent = problem.description || '';

    // Element info
    const elementInfoDiv = document.createElement('div');
    elementInfoDiv.className = 'element-info';

    const dl = document.createElement('dl');

    // Element type
    if (elementInfo.elementType) {
        const dt1 = document.createElement('dt');
        dt1.textContent = 'Element-Typ:';
        const dd1 = document.createElement('dd');
        dd1.textContent = elementInfo.elementType;
        dl.appendChild(dt1);
        dl.appendChild(dd1);
    }

    // Element text
    if (elementInfo.text) {
        const dt2 = document.createElement('dt');
        dt2.textContent = 'Element-Text:';
        const dd2 = document.createElement('dd');
        dd2.textContent = elementInfo.text.substring(0, 100) + (elementInfo.text.length > 100 ? '...' : '');
        dl.appendChild(dt2);
        dl.appendChild(dd2);
    }

    // ARIA Label
    if (elementInfo.ariaLabel) {
        const dt3 = document.createElement('dt');
        dt3.textContent = 'ARIA-Label:';
        const dd3 = document.createElement('dd');
        dd3.textContent = elementInfo.ariaLabel;
        dl.appendChild(dt3);
        dl.appendChild(dd3);
    }

    // Selector (for debugging)
    if (elementInfo.selector) {
        const dt4 = document.createElement('dt');
        dt4.textContent = 'CSS-Selector:';
        const dd4 = document.createElement('dd');
        dd4.textContent = elementInfo.selector;
        dd4.style.fontSize = '0.85em';
        dd4.style.fontFamily = 'monospace';
        dl.appendChild(dt4);
        dl.appendChild(dd4);
    }

    elementInfoDiv.appendChild(dl);

    // Assemble content
    content.appendChild(titleLabel);
    content.appendChild(description);
    content.appendChild(elementInfoDiv);

    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(content);

    li.appendChild(checkboxWrapper);

    return li;
}

function handleCheckboxChange(index, isChecked) {
    if (isChecked) {
        selectedProblems.add(index);
    } else {
        selectedProblems.delete(index);
    }

    updateSelectionUI();
}

function updateSelectionUI() {
    // Update selection count
    const selectionCount = document.getElementById('selection-count');
    selectionCount.textContent = `${selectedProblems.size} von ${allProblems.length}`;

    // Update save button state
    const saveButton = document.getElementById('save-notes-btn');
    saveButton.disabled = selectedProblems.size === 0;

    // Update visual state of problem items
    document.querySelectorAll('.problem-item').forEach((item, index) => {
        if (selectedProblems.has(index)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

function selectAll() {
    selectedProblems.clear();
    for (let i = 0; i < allProblems.length; i++) {
        selectedProblems.add(i);
    }

    // Update checkboxes
    document.querySelectorAll('.problem-checkbox').forEach(checkbox => {
        checkbox.checked = true;
    });

    updateSelectionUI();
}

function deselectAll() {
    selectedProblems.clear();

    // Update checkboxes
    document.querySelectorAll('.problem-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });

    updateSelectionUI();
}

function setupEventListeners() {
    // Select/Deselect all buttons
    document.getElementById('select-all-btn').addEventListener('click', selectAll);
    document.getElementById('deselect-all-btn').addEventListener('click', deselectAll);

    // Save notes button
    document.getElementById('save-notes-btn').addEventListener('click', saveSelectedNotes);
}

async function saveSelectedNotes() {
    console.log(`💾 Saving ${selectedProblems.size} selected notes...`);

    const saveButton = document.getElementById('save-notes-btn');
    saveButton.disabled = true;
    saveButton.textContent = '💾 Speichere...';

    try {
        // Get selected report type
        const reportType = document.querySelector('input[name="report-type"]:checked').value;
        const isCitizenReport = reportType === 'citizen';

        console.log(`📋 Report type: ${isCitizenReport ? 'Citizen' : 'Detailed BITV'}`);

        // Load existing notes to avoid ID conflicts
        const existingNotes = await StorageHelper.loadAllNotes();
        let savedCount = 0;

        // Save each selected problem as a note
        for (const index of selectedProblems) {
            const problemData = allProblems[index];
            const note = createNoteFromProblem(problemData, isCitizenReport);

            // Save note
            const success = await StorageHelper.saveNote(note.id, note);
            if (success) {
                savedCount++;
                console.log(`✅ Note saved: ${note.id}`);
            } else {
                console.error(`❌ Failed to save note: ${note.id}`);
            }
        }

        console.log(`✅ Successfully saved ${savedCount} of ${selectedProblems.size} notes`);

        // Show success message
        saveButton.textContent = `✅ ${savedCount} Notizen gespeichert!`;
        saveButton.classList.add('btn--success');

        // Redirect to notes overview after 1 second
        setTimeout(() => {
            const notesOverviewUrl = browserAPI.runtime.getURL('notes-overview.html');
            window.location.href = notesOverviewUrl;
        }, 1000);

    } catch (error) {
        console.error('❌ Error saving notes:', error);
        saveButton.textContent = '❌ Fehler beim Speichern';
        saveButton.classList.add('btn--error');

        setTimeout(() => {
            saveButton.disabled = false;
            saveButton.textContent = '💾 Ausgewählte Notizen speichern';
            saveButton.classList.remove('btn--error');
        }, 3000);
    }
}

function createNoteFromProblem(problemData, isCitizenReport) {
    const { problem, elementInfo, url, pageTitle } = problemData;

    // Generate unique ID based on timestamp
    const timestamp = new Date().toISOString();
    const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Base note structure
    const note = {
        id: noteId,
        timestamp: timestamp,
        url: url,
        title: pageTitle,
        elementType: elementInfo.elementType || 'Unbekannt',
        element: {
            type: elementInfo.elementType || 'Unbekannt',
            text: elementInfo.text || '',
            ariaLabel: elementInfo.ariaLabel || '',
            role: elementInfo.ariaRole || ''
        },
        fileName: `note-${Date.now()}.txt`
    };

    if (isCitizenReport) {
        // CITIZEN REPORT MODE (simplified)
        note.content = `${problem.title}\n\n${problem.description || ''}`;
        note.recommendation = problem.recommendation || '';

        // Add simplified BITV reference (without full metadata)
        if (problem.bitvStep) {
            note.bitvReference = problem.bitvStep;
        }

    } else {
        // DETAILED BITV MODE (full structure)
        note.content = problem.description || problem.title;
        note.recommendation = problem.recommendation || '';

        // Full BITV test step data
        if (problem.bitvStep && typeof BitvCatalog !== 'undefined') {
            const bitvStep = BitvCatalog.getStepById(problem.bitvStep);
            if (bitvStep) {
                note.bitvTest = {
                    stepId: bitvStep.id,
                    stepTitle: bitvStep.title,
                    category: bitvStep.category,
                    evaluation: 'failed', // Default to failed since it's a detected problem
                    level: bitvStep.level || 'A',
                    description: bitvStep.description || ''
                };
            }
        }
    }

    return note;
}

function showEmptyState() {
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('empty-state').style.display = 'block';
}

function showErrorState(errorMessage) {
    document.getElementById('loading-state').style.display = 'none';

    const emptyState = document.getElementById('empty-state');
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
        <div class="empty-state-icon">❌</div>
        <h2>Fehler beim Laden der Ergebnisse</h2>
        <p>${errorMessage}</p>
        <p style="margin-top: var(--spacing-md);">
            <button class="btn btn--secondary" onclick="window.close()">Fenster schließen</button>
        </p>
    `;
}

console.log('✅ Accessibility Check Results page script loaded');
