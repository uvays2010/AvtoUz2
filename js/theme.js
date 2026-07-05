/* ========================================
   CAR-ENTERPRISE - THEME MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initTheme();
});

// ===== THEME CONFIG =====
const THEME_CONFIG = {
    STORAGE_KEY: 'theme',
    DEFAULT_THEME: 'light',
    THEMES: {
        light: 'light',
        dark: 'dark'
    },
    TRANSITION_DURATION: 300
};

// ===== THEME STATE =====
let currentTheme = THEME_CONFIG.DEFAULT_THEME;
let isTransitioning = false;

// ===== INIT THEME =====
function initTheme() {
    // Load saved theme
    loadTheme();
    
    // Init theme toggle buttons
    initThemeToggles();
    
    // Listen for system theme changes
    initSystemThemeListener();
    
    // Init theme switcher
    initThemeSwitcher();
}

// ===== LOAD THEME =====
function loadTheme() {
    const savedTheme = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine theme
    if (savedTheme && THEME_CONFIG.THEMES[savedTheme]) {
        currentTheme = savedTheme;
    } else if (prefersDark) {
        currentTheme = THEME_CONFIG.THEMES.dark;
    } else {
        currentTheme = THEME_CONFIG.THEMES.light;
    }
    
    applyTheme(currentTheme);
}

// ===== APPLY THEME =====
function applyTheme(theme, animate = true) {
    if (isTransitioning) return;
    
    const html = document.documentElement;
    
    // Start transition
    if (animate) {
        isTransitioning = true;
        html.style.transition = `background-color ${THEME_CONFIG.TRANSITION_DURATION}ms ease, color ${THEME_CONFIG.TRANSITION_DURATION}ms ease`;
    }
    
    // Apply theme
    html.setAttribute('data-theme', theme);
    currentTheme = theme;
    
    // Save preference
    localStorage.setItem(THEME_CONFIG.STORAGE_KEY, theme);
    
    // Update UI
    updateThemeUI(theme);
    
    // End transition
    if (animate) {
        setTimeout(function() {
            html.style.transition = '';
            isTransitioning = false;
        }, THEME_CONFIG.TRANSITION_DURATION);
    }
    
    // Trigger event
    document.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { theme: theme }
    }));
}

// ===== TOGGLE THEME =====
function toggleTheme() {
    const newTheme = currentTheme === THEME_CONFIG.THEMES.light 
        ? THEME_CONFIG.THEMES.dark 
        : THEME_CONFIG.THEMES.light;
    
    applyTheme(newTheme);
    
    showNotification(`Mavzu ${newTheme === 'dark' ? 'qorong\'i' : 'yorug\''} rejimga o'zgartirildi`, 'success');
}

// ===== SET THEME =====
function setTheme(theme) {
    if (!THEME_CONFIG.THEMES[theme]) return;
    if (theme === currentTheme) return;
    
    applyTheme(theme);
}

// ===== GET CURRENT THEME =====
function getCurrentTheme() {
    return currentTheme;
}

// ===== IS DARK THEME =====
function isDarkTheme() {
    return currentTheme === THEME_CONFIG.THEMES.dark;
}

// ===== UPDATE THEME UI =====
function updateThemeUI(theme) {
    // Update toggle buttons
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    toggleBtns.forEach(function(btn) {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        btn.classList.toggle('dark', theme === 'dark');
        btn.classList.toggle('light', theme === 'light');
    });
    
    // Update theme switcher
    const switcher = document.querySelector('.theme-switcher');
    if (switcher) {
        switcher.value = theme;
    }
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        const computedStyle = getComputedStyle(document.documentElement);
        const bgColor = theme === 'dark' 
            ? computedStyle.getPropertyValue('--bg-primary').trim() 
            : '#ffffff';
        metaThemeColor.content = bgColor;
    }
}

// ===== INIT THEME TOGGLES =====
function initThemeToggles() {
    const toggles = document.querySelectorAll('.theme-toggle');
    
    toggles.forEach(function(toggle) {
        // Skip if already initialized
        if (toggle.dataset.themeInitialized) return;
        toggle.dataset.themeInitialized = 'true';
        
        // Set initial state
        const icon = toggle.querySelector('i');
        if (icon) {
            icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Toggle on click
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
        
        // Keyboard support
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    });
}

// ===== INIT THEME SWITCHER =====
function initThemeSwitcher() {
    const switcher = document.querySelector('.theme-switcher');
    if (!switcher) return;
    
    switcher.value = currentTheme;
    
    switcher.addEventListener('change', function() {
        setTheme(this.value);
    });
}

// ===== INIT SYSTEM THEME LISTENER =====
function initSystemThemeListener() {
    if (!window.matchMedia) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', function(e) {
        // Only change if user hasn't manually set a theme
        const savedTheme = localStorage.getItem(THEME_CONFIG.STORAGE_KEY);
        if (!savedTheme) {
            const newTheme = e.matches ? THEME_CONFIG.THEMES.dark : THEME_CONFIG.THEMES.light;
            applyTheme(newTheme);
        }
    });
}

// ===== THEME COLOR SCHEMES =====
function getThemeColors(theme) {
    const colors = {
        light: {
            primary: '#e74c3c',
            secondary: '#2c3e50',
            background: '#ffffff',
            text: '#212529',
            card: '#ffffff',
            border: '#dee2e6'
        },
        dark: {
            primary: '#e74c3c',
            secondary: '#34495e',
            background: '#1a1a2e',
            text: '#e8e8e8',
            card: '#1e1e2f',
            border: '#2a2a3f'
        }
    };
    
    return colors[theme] || colors.light;
}

// ===== THEME CSS VARIABLES =====
function applyThemeVariables(theme) {
    const colors = getThemeColors(theme);
    const root = document.documentElement;
    
    Object.keys(colors).forEach(function(key) {
        root.style.setProperty(`--theme-${key}`, colors[key]);
    });
}

// ===== THEME PREVIEW =====
function showThemePreview(theme) {
    const preview = document.createElement('div');
    preview.className = 'theme-preview';
    preview.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px 40px;
        background: var(--bg-card);
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 9999;
        text-align: center;
        font-size: 18px;
        animation: fadeIn 0.3s ease;
        border: 2px solid var(--border-primary);
    `;
    
    preview.innerHTML = `
        <i class="fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}" style="font-size: 32px; color: var(--primary-color); display: block; margin-bottom: 10px;"></i>
        <span>${theme === 'dark' ? 'Qorong\'i' : 'Yorug\''} rejimga o'tish</span>
    `;
    
    document.body.appendChild(preview);
    
    setTimeout(function() {
        preview.style.opacity = '0';
        preview.style.transform = 'translate(-50%, -50%) scale(0.95)';
        preview.style.transition = 'all 0.3s ease';
        
        setTimeout(function() {
            preview.remove();
        }, 300);
    }, 1000);
}

// ===== EXPOSE GLOBALLY =====
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.getCurrentTheme = getCurrentTheme;
window.isDarkTheme = isDarkTheme;
window.applyTheme = applyTheme;
window.getThemeColors = getThemeColors;

console.log('✅ Theme Module loaded successfully');