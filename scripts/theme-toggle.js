/**
 * Theme Toggle Functionality for AccNotes
 * Provides accessible dark/light mode switching with system preference detection
 */

class ThemeManager {
    constructor() {
        this.themeKey = 'accnotes-theme';
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupToggleButton();
        this.setupSystemThemeListener();
        this.announceCurrentTheme();
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
        try {
            return localStorage.getItem(this.themeKey);
        } catch (e) {
            console.warn('localStorage not available for theme storage');
            return null;
        }
    }

    storeTheme(theme) {
        try {
            localStorage.setItem(this.themeKey, theme);
        } catch (e) {
            console.warn('localStorage not available for theme storage');
        }
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        this.updateToggleButton();
        this.storeTheme(theme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.announceThemeChange(newTheme);
    }

    setupToggleButton() {
        const toggleButton = document.getElementById('theme-toggle');
        if (!toggleButton) return;

        toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard support
        toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
            }
        });

        this.updateToggleButton();
    }

    updateToggleButton() {
        const toggleButton = document.getElementById('theme-toggle');
        if (!toggleButton) return;

        const isDark = this.currentTheme === 'dark';
        const icon = toggleButton.querySelector('[aria-hidden="true"]');

        if (icon) {
            icon.textContent = isDark ? '☀️' : '🌙';
        }

        toggleButton.setAttribute('aria-label',
            isDark
                ? 'Zu hellem Design wechseln'
                : 'Zu dunklem Design wechseln'
        );

        toggleButton.setAttribute('title',
            isDark
                ? 'Helles Design aktivieren'
                : 'Dunkles Design aktivieren'
        );
    }

    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        mediaQuery.addEventListener('change', (e) => {
            // Only change if user hasn't manually set a theme
            if (!this.getStoredTheme()) {
                const systemTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(systemTheme);
                this.announceThemeChange(systemTheme);
            }
        });
    }

    announceCurrentTheme() {
        const theme = this.currentTheme === 'dark' ? 'Dunkles' : 'Helles';
        this.announceToScreenReader(`${theme} Design aktiv`);
    }

    announceThemeChange(newTheme) {
        const themeName = newTheme === 'dark' ? 'Dunkles' : 'Helles';
        this.announceToScreenReader(`Zu ${themeName.toLowerCase()}m Design gewechselt`);
    }

    announceToScreenReader(message) {
        // Create temporary announcement element
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // High contrast mode detection
    detectHighContrast() {
        return window.matchMedia('(prefers-contrast: high)').matches;
    }

    // Reduced motion detection
    detectReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Public API
    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.applyTheme(theme);
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager = new ThemeManager();
    });
} else {
    window.themeManager = new ThemeManager();
}