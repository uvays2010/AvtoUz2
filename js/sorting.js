/* ========================================
   CAR-ENTERPRISE - SORTING MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initSorting();
});

// ===== SORTING CONFIG =====
const SORTING_CONFIG = {
    STORAGE_KEY: 'sorting',
    DEFAULT_SORT: 'newest'
};

// ===== SORTING OPTIONS =====
const SORT_OPTIONS = {
    newest: { label: 'Eng yangi', value: 'newest', icon: 'fa-clock' },
    oldest: { label: 'Eng eski', value: 'oldest', icon: 'fa-history' },
    'price-low': { label: 'Narxi pastdan', value: 'price-low', icon: 'fa-arrow-up' },
    'price-high': { label: 'Narxi yuqoridan', value: 'price-high', icon: 'fa-arrow-down' },
    rating: { label: 'Reyting bo\'yicha', value: 'rating', icon: 'fa-star' },
    popular: { label: 'Eng mashhur', value: 'popular', icon: 'fa-fire' },
    name: { label: 'Nomi bo\'yicha', value: 'name', icon: 'fa-sort-alpha-down' }
};

// ===== SORTING STATE =====
let currentSort = SORTING_CONFIG.DEFAULT_SORT;

// ===== INIT SORTING =====
function initSorting() {
    // Load saved sort
    loadSavedSort();
    
    // Init sort controls
    initSortControls();
}

// ===== LOAD SAVED SORT =====
function loadSavedSort() {
    try {
        const saved = localStorage.getItem(SORTING_CONFIG.STORAGE_KEY);
        if (saved && SORT_OPTIONS[saved]) {
            currentSort = saved;
        }
    } catch (error) {
        console.error('Failed to load sort:', error);
    }
}

// ===== SAVE SORT =====
function saveSort() {
    try {
        localStorage.setItem(SORTING_CONFIG.STORAGE_KEY, currentSort);
    } catch (error) {
        console.error('Failed to save sort:', error);
    }
}

// ===== INIT SORT CONTROLS =====
function initSortControls() {
    // Sort select
    const sortSelect = document.getElementById('sortProducts');
    if (sortSelect) {
        sortSelect.value = currentSort;
        sortSelect.addEventListener('change', function() {
            setSort(this.value);
        });
    }
    
    // Sort buttons
    const sortBtns = document.querySelectorAll('[data-sort]');
    sortBtns.forEach(function(btn) {
        const sortValue = btn.dataset.sort;
        if (sortValue === currentSort) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            setSort(sortValue);
        });
    });
    
    // Sort dropdown items
    const dropdownItems = document.querySelectorAll('.sort-dropdown .dropdown-item');
    dropdownItems.forEach(function(item) {
        const sortValue = item.dataset.sort;
        if (sortValue === currentSort) {
            item.classList.add('active');
        }
        
        item.addEventListener('click', function(e) {
            e.preventDefault();
            setSort(sortValue);
        });
    });
}

// ===== SET SORT =====
function setSort(sortValue) {
    if (!SORT_OPTIONS[sortValue]) return;
    
    currentSort = sortValue;
    saveSort();
    
    // Update UI
    updateSortUI();
    
    // Apply sort
    applySort();
    
    // Trigger event
    document.dispatchEvent(new CustomEvent('sortChanged', {
        detail: {
            sort: currentSort,
            option: SORT_OPTIONS[currentSort]
        }
    }));
    
    showNotification(`Saralash: ${SORT_OPTIONS[currentSort].label}`, 'info');
}

// ===== UPDATE SORT UI =====
function updateSortUI() {
    // Update select
    const sortSelect = document.getElementById('sortProducts');
    if (sortSelect) {
        sortSelect.value = currentSort;
    }
    
    // Update buttons
    const sortBtns = document.querySelectorAll('[data-sort]');
    sortBtns.forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.sort === currentSort);
    });
    
    // Update dropdown items
    const dropdownItems = document.querySelectorAll('.sort-dropdown .dropdown-item');
    dropdownItems.forEach(function(item) {
        item.classList.toggle('active', item.dataset.sort === currentSort);
    });
    
    // Update sort label
    const sortLabel = document.getElementById('sortLabel');
    if (sortLabel) {
        sortLabel.textContent = SORT_OPTIONS[currentSort].label;
    }
    
    // Update sort icon
    const sortIcon = document.getElementById('sortIcon');
    if (sortIcon) {
        sortIcon.className = `fas ${SORT_OPTIONS[currentSort].icon}`;
    }
}

// ===== APPLY SORT =====
function applySort() {
    // Get current items
    let items = [];
    const container = document.querySelector('.cars-grid, .products-grid, .blog-grid');
    
    if (container) {
        items = Array.from(container.children);
    }
    
    if (items.length === 0) return;
    
    // Sort items based on current sort
    const sortedItems = sortItems(items, currentSort);
    
    // Reorder items in container
    sortedItems.forEach(function(item) {
        container.appendChild(item);
    });
}

// ===== SORT ITEMS =====
function sortItems(items, sortType) {
    const sortFunctions = {
        newest: function(a, b) {
            const yearA = parseInt(a.dataset.year || a.querySelector('.car-year')?.textContent || 0);
            const yearB = parseInt(b.dataset.year || b.querySelector('.car-year')?.textContent || 0);
            return yearB - yearA;
        },
        oldest: function(a, b) {
            const yearA = parseInt(a.dataset.year || a.querySelector('.car-year')?.textContent || 0);
            const yearB = parseInt(b.dataset.year || b.querySelector('.car-year')?.textContent || 0);
            return yearA - yearB;
        },
        'price-low': function(a, b) {
            const priceA = parseFloat(a.dataset.price || a.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || 0);
            const priceB = parseFloat(b.dataset.price || b.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || 0);
            return priceA - priceB;
        },
        'price-high': function(a, b) {
            const priceA = parseFloat(a.dataset.price || a.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || 0);
            const priceB = parseFloat(b.dataset.price || b.querySelector('.price')?.textContent?.replace(/[^0-9]/g, '') || 0);
            return priceB - priceA;
        },
        rating: function(a, b) {
            const ratingA = parseFloat(a.dataset.rating || a.querySelector('.rating')?.textContent || 0);
            const ratingB = parseFloat(b.dataset.rating || b.querySelector('.rating')?.textContent || 0);
            return ratingB - ratingA;
        },
        popular: function(a, b) {
            const reviewsA = parseInt(a.dataset.reviews || a.querySelector('.reviews')?.textContent || 0);
            const reviewsB = parseInt(b.dataset.reviews || b.querySelector('.reviews')?.textContent || 0);
            return reviewsB - reviewsA;
        },
        name: function(a, b) {
            const nameA = a.querySelector('.name, .title, h4')?.textContent || '';
            const nameB = b.querySelector('.name, .title, h4')?.textContent || '';
            return nameA.localeCompare(nameB);
        }
    };
    
    const sortFn = sortFunctions[sortType] || sortFunctions.newest;
    return items.sort(sortFn);
}

// ===== GET SORT FUNCTION =====
function getSortFunction(sortType) {
    const sortFunctions = {
        newest: function(items) {
            return items.sort((a, b) => b.year - a.year);
        },
        oldest: function(items) {
            return items.sort((a, b) => a.year - b.year);
        },
        'price-low': function(items) {
            return items.sort((a, b) => a.price - b.price);
        },
        'price-high': function(items) {
            return items.sort((a, b) => b.price - a.price);
        },
        rating: function(items) {
            return items.sort((a, b) => b.rating - a.rating);
        },
        popular: function(items) {
            return items.sort((a, b) => b.reviews - a.reviews);
        },
        name: function(items) {
            return items.sort((a, b) => a.name.localeCompare(b.name));
        }
    };
    
    return sortFunctions[sortType] || sortFunctions.newest;
}

// ===== SORT DATA =====
function sortData(data, sortType) {
    const sortFn = getSortFunction(sortType);
    return sortFn([...data]);
}

// ===== GET SORT OPTIONS =====
function getSortOptions() {
    return SORT_OPTIONS;
}

// ===== GET CURRENT SORT =====
function getCurrentSort() {
    return currentSort;
}

// ===== GET SORT LABEL =====
function getSortLabel(sortValue) {
    return SORT_OPTIONS[sortValue]?.label || sortValue;
}

// ===== RENDER SORT DROPDOWN =====
function renderSortDropdown(container) {
    if (!container) return;
    
    let html = `
        <button class="sort-toggle" id="sortToggle">
            <i class="fas ${SORT_OPTIONS[currentSort].icon}" id="sortIcon"></i>
            <span id="sortLabel">${SORT_OPTIONS[currentSort].label}</span>
            <i class="fas fa-chevron-down"></i>
        </button>
        <div class="sort-dropdown-menu">
    `;
    
    Object.values(SORT_OPTIONS).forEach(function(option) {
        const active = option.value === currentSort ? 'active' : '';
        html += `
            <a href="#" class="dropdown-item ${active}" data-sort="${option.value}">
                <i class="fas ${option.icon}"></i>
                ${option.label}
                ${active ? '<i class="fas fa-check"></i>' : ''}
            </a>
        `;
    });
    
    html += `</div>`;
    container.innerHTML = html;
    
    // Init dropdown
    const toggle = container.querySelector('#sortToggle');
    const dropdown = container.querySelector('.sort-dropdown-menu');
    
    if (toggle && dropdown) {
        toggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            dropdown.classList.remove('show');
        });
    }
    
    // Init sort items
    const items = container.querySelectorAll('.dropdown-item');
    items.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            setSort(this.dataset.sort);
            dropdown.classList.remove('show');
        });
    });
}

// ===== EXPOSE GLOBALLY =====
window.setSort = setSort;
window.applySort = applySort;
window.sortItems = sortItems;
window.sortData = sortData;
window.getSortOptions = getSortOptions;
window.getCurrentSort = getCurrentSort;
window.getSortLabel = getSortLabel;
window.renderSortDropdown = renderSortDropdown;

console.log('✅ Sorting Module loaded successfully');