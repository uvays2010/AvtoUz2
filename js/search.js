/* ========================================
   CAR-ENTERPRISE - SEARCH MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initSearch();
});

// ===== SEARCH CONFIG =====
const SEARCH_CONFIG = {
    MIN_QUERY_LENGTH: 2,
    MAX_SUGGESTIONS: 10,
    DEBOUNCE_DELAY: 300,
    STORAGE_KEY: 'search_history'
};

// ===== SEARCH STATE =====
let searchHistory = [];
let searchTimeout = null;

// ===== INIT SEARCH =====
function initSearch() {
    // Load search history
    loadSearchHistory();
    
    // Init search elements
    initSearchInputs();
    initSearchHistory();
}

// ===== LOAD SEARCH HISTORY =====
function loadSearchHistory() {
    try {
        const saved = localStorage.getItem(SEARCH_CONFIG.STORAGE_KEY);
        if (saved) {
            searchHistory = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load search history:', error);
    }
}

// ===== SAVE SEARCH HISTORY =====
function saveSearchHistory() {
    try {
        localStorage.setItem(SEARCH_CONFIG.STORAGE_KEY, JSON.stringify(searchHistory));
    } catch (error) {
        console.error('Failed to save search history:', error);
    }
}

// ===== INIT SEARCH INPUTS =====
function initSearchInputs() {
    const searchInputs = document.querySelectorAll('.search-input, #searchInput, #filterSearch');
    
    searchInputs.forEach(function(input) {
        // Skip if already initialized
        if (input.dataset.searchInitialized) return;
        input.dataset.searchInitialized = 'true';
        
        // Search on input with debounce
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH) {
                searchTimeout = setTimeout(function() {
                    performSearch(query);
                }, SEARCH_CONFIG.DEBOUNCE_DELAY);
            } else if (query.length === 0) {
                clearSearch();
            }
        });
        
        // Search on Enter key
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const query = this.value.trim();
                if (query.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH) {
                    performSearch(query);
                }
            }
        });
        
        // Clear search on Escape
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                clearSearch();
            }
        });
    });
}

// ===== PERFORM SEARCH =====
function performSearch(query) {
    if (!query || query.trim().length < SEARCH_CONFIG.MIN_QUERY_LENGTH) {
        return;
    }
    
    const trimmedQuery = query.trim();
    
    // Add to search history
    addToSearchHistory(trimmedQuery);
    
    // Trigger search event
    document.dispatchEvent(new CustomEvent('searchPerformed', {
        detail: {
            query: trimmedQuery,
            timestamp: new Date().toISOString()
        }
    }));
    
    // If on cars page, apply filter
    if (document.querySelector('.cars-section') || document.querySelector('.filter-container')) {
        applySearchFilter(trimmedQuery);
    } else {
        // Navigate to cars page with search
        window.location.href = `pages/cars.html?search=${encodeURIComponent(trimmedQuery)}`;
    }
}

// ===== APPLY SEARCH FILTER =====
function applySearchFilter(query) {
    const searchInput = document.getElementById('filterSearch');
    if (searchInput) {
        searchInput.value = query;
    }
    
    // Trigger filter
    if (typeof window.applyFilters === 'function') {
        // Update current filters
        if (window.currentFilters) {
            window.currentFilters.search = query;
        }
        window.applyFilters();
    }
    
    showNotification(`"${query}" bo'yicha qidiruv natijalari`, 'info');
}

// ===== CLEAR SEARCH =====
function clearSearch() {
    document.dispatchEvent(new CustomEvent('searchCleared'));
    
    // Clear filter
    if (typeof window.applyFilters === 'function') {
        if (window.currentFilters) {
            window.currentFilters.search = '';
        }
        window.applyFilters();
    }
}

// ===== ADD TO SEARCH HISTORY =====
function addToSearchHistory(query) {
    // Remove duplicate
    searchHistory = searchHistory.filter(item => item !== query);
    
    // Add to front
    searchHistory.unshift(query);
    
    // Limit history
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    saveSearchHistory();
    renderSearchHistory();
}

// ===== REMOVE FROM SEARCH HISTORY =====
function removeFromSearchHistory(query) {
    searchHistory = searchHistory.filter(item => item !== query);
    saveSearchHistory();
    renderSearchHistory();
}

// ===== CLEAR SEARCH HISTORY =====
function clearSearchHistory() {
    if (confirm('Qidiruv tarixini tozalashni xohlaysizmi?')) {
        searchHistory = [];
        saveSearchHistory();
        renderSearchHistory();
        showNotification('Qidiruv tarixi tozalandi', 'info');
    }
}

// ===== INIT SEARCH HISTORY =====
function initSearchHistory() {
    renderSearchHistory();
}

// ===== RENDER SEARCH HISTORY =====
function renderSearchHistory() {
    const container = document.getElementById('searchHistory');
    if (!container) return;
    
    if (searchHistory.length === 0) {
        container.innerHTML = `
            <div class="search-history-empty">
                <i class="fas fa-search"></i>
                <span>Hali qidiruv yo'q</span>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="search-history-header">
            <span>So'nggi qidiruvlar</span>
            <button class="clear-history" onclick="clearSearchHistory()">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <ul class="search-history-list">
            ${searchHistory.map(query => `
                <li onclick="performSearch('${query}')">
                    <i class="fas fa-clock"></i>
                    <span>${query}</span>
                    <button class="remove-history" onclick="event.stopPropagation(); removeFromSearchHistory('${query}')">
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            `).join('')}
        </ul>
    `;
}

// ===== GET SEARCH SUGGESTIONS =====
function getSearchSuggestions(query) {
    // In production: API.cars.searchSuggestions(query)
    // Mock suggestions
    const suggestions = [
        { name: 'BMW X5', type: 'car' },
        { name: 'Mercedes S-Class', type: 'car' },
        { name: 'Toyota Camry', type: 'car' },
        { name: 'Porsche Cayenne', type: 'car' },
        { name: 'Audi Q7', type: 'car' }
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    
    return suggestions;
}

// ===== EXPOSE GLOBALLY =====
window.performSearch = performSearch;
window.clearSearch = clearSearch;
window.addToSearchHistory = addToSearchHistory;
window.removeFromSearchHistory = removeFromSearchHistory;
window.clearSearchHistory = clearSearchHistory;
window.getSearchSuggestions = getSearchSuggestions;

console.log('✅ Search Module loaded successfully');