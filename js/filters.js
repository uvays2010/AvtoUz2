/* ========================================
   CAR-ENTERPRISE - FILTERS MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initFilters();
});

// ===== FILTERS CONFIG =====
const FILTERS_CONFIG = {
    STORAGE_KEY: 'filters',
    MAX_PRICE: 100000000,
    MIN_PRICE: 0
};

// ===== FILTERS STATE =====
let currentFilters = {
    search: '',
    brand: '',
    category: '',
    year: '',
    minPrice: '',
    maxPrice: '',
    fuelType: '',
    transmission: '',
    condition: '',
    sort: 'newest'
};

let filteredCars = [];
let allCars = [];

// ===== INIT FILTERS =====
function initFilters() {
    // Load saved filters
    loadSavedFilters();
    
    // Load cars data
    loadCarsData();
    
    // Init filter elements
    initFilterElements();
    initPriceRange();
    initSortFilter();
    initSearchFilter();
    initFilterButtons();
}

// ===== LOAD SAVED FILTERS =====
function loadSavedFilters() {
    try {
        const saved = localStorage.getItem(FILTERS_CONFIG.STORAGE_KEY);
        if (saved) {
            currentFilters = { ...currentFilters, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.error('Failed to load filters:', error);
    }
}

// ===== SAVE FILTERS =====
function saveFilters() {
    try {
        localStorage.setItem(FILTERS_CONFIG.STORAGE_KEY, JSON.stringify(currentFilters));
    } catch (error) {
        console.error('Failed to save filters:', error);
    }
}

// ===== LOAD CARS DATA =====
function loadCarsData() {
    // In production: API.cars.getAll()
    allCars = getCarsData();
    applyFilters();
}

function getCarsData() {
    return [
        {
            id: 1,
            brand: 'BMW',
            model: 'X5',
            year: 2024,
            price: 85000000,
            oldPrice: 92000000,
            category: 'SUV',
            fuelType: 'Dizel',
            transmission: 'Avtomat',
            engine: '3.0L',
            power: 286,
            color: 'Qora',
            mileage: 0,
            condition: 'Yangi',
            rating: 4.8,
            reviews: 156,
            isFeatured: true,
            isNew: true
        },
        {
            id: 2,
            brand: 'Mercedes-Benz',
            model: 'S-Class',
            year: 2024,
            price: 120000000,
            oldPrice: null,
            category: 'Sedan',
            fuelType: 'Benzin',
            transmission: 'Avtomat',
            engine: '4.0L',
            power: 503,
            color: 'Kumush',
            mileage: 0,
            condition: 'Yangi',
            rating: 4.9,
            reviews: 89,
            isFeatured: true,
            isNew: true
        },
        {
            id: 3,
            brand: 'Toyota',
            model: 'Camry',
            year: 2023,
            price: 35000000,
            oldPrice: 38000000,
            category: 'Sedan',
            fuelType: 'Benzin',
            transmission: 'Avtomat',
            engine: '2.5L',
            power: 206,
            color: 'Oq',
            mileage: 15000,
            condition: 'Ishlatilgan',
            rating: 4.7,
            reviews: 234,
            isFeatured: true,
            isNew: false
        },
        {
            id: 4,
            brand: 'Porsche',
            model: 'Cayenne',
            year: 2024,
            price: 110000000,
            oldPrice: 125000000,
            category: 'SUV',
            fuelType: 'Benzin',
            transmission: 'Avtomat',
            engine: '3.0L',
            power: 340,
            color: 'Qizil',
            mileage: 0,
            condition: 'Yangi',
            rating: 4.9,
            reviews: 67,
            isFeatured: true,
            isNew: true
        },
        {
            id: 5,
            brand: 'Audi',
            model: 'Q7',
            year: 2023,
            price: 70000000,
            oldPrice: null,
            category: 'SUV',
            fuelType: 'Dizel',
            transmission: 'Avtomat',
            engine: '3.0L',
            power: 245,
            color: 'Qora',
            mileage: 12000,
            condition: 'Ishlatilgan',
            rating: 4.7,
            reviews: 145,
            isFeatured: false,
            isNew: false
        },
        {
            id: 6,
            brand: 'Lexus',
            model: 'RX 350',
            year: 2024,
            price: 95000000,
            oldPrice: 100000000,
            category: 'SUV',
            fuelType: 'Benzin',
            transmission: 'Avtomat',
            engine: '3.5L',
            power: 295,
            color: 'Oltin',
            mileage: 0,
            condition: 'Yangi',
            rating: 4.8,
            reviews: 102,
            isFeatured: true,
            isNew: true
        },
        {
            id: 7,
            brand: 'Hyundai',
            model: 'Santa Fe',
            year: 2023,
            price: 28000000,
            oldPrice: 30000000,
            category: 'SUV',
            fuelType: 'Dizel',
            transmission: 'Avtomat',
            engine: '2.2L',
            power: 200,
            color: 'Kumush',
            mileage: 20000,
            condition: 'Ishlatilgan',
            rating: 4.5,
            reviews: 189,
            isFeatured: false,
            isNew: false
        },
        {
            id: 8,
            brand: 'KIA',
            model: 'Sportage',
            year: 2024,
            price: 25000000,
            oldPrice: null,
            category: 'SUV',
            fuelType: 'Benzin',
            transmission: 'Avtomat',
            engine: '2.0L',
            power: 150,
            color: 'Oq',
            mileage: 0,
            condition: 'Yangi',
            rating: 4.4,
            reviews: 212,
            isFeatured: false,
            isNew: true
        }
    ];
}

// ===== APPLY FILTERS =====
function applyFilters() {
    const cars = [...allCars];
    
    // Search filter
    if (currentFilters.search) {
        const query = currentFilters.search.toLowerCase();
        filteredCars = cars.filter(car => {
            const searchText = `${car.brand} ${car.model} ${car.category} ${car.year} ${car.color}`.toLowerCase();
            return searchText.includes(query);
        });
    } else {
        filteredCars = cars;
    }
    
    // Brand filter
    if (currentFilters.brand) {
        filteredCars = filteredCars.filter(car => car.brand === currentFilters.brand);
    }
    
    // Category filter
    if (currentFilters.category) {
        filteredCars = filteredCars.filter(car => car.category === currentFilters.category);
    }
    
    // Year filter
    if (currentFilters.year) {
        filteredCars = filteredCars.filter(car => car.year === parseInt(currentFilters.year));
    }
    
    // Fuel type filter
    if (currentFilters.fuelType) {
        filteredCars = filteredCars.filter(car => car.fuelType === currentFilters.fuelType);
    }
    
    // Transmission filter
    if (currentFilters.transmission) {
        filteredCars = filteredCars.filter(car => car.transmission === currentFilters.transmission);
    }
    
    // Condition filter
    if (currentFilters.condition) {
        filteredCars = filteredCars.filter(car => car.condition === currentFilters.condition);
    }
    
    // Price range filter
    if (currentFilters.minPrice) {
        filteredCars = filteredCars.filter(car => car.price >= parseInt(currentFilters.minPrice));
    }
    if (currentFilters.maxPrice) {
        filteredCars = filteredCars.filter(car => car.price <= parseInt(currentFilters.maxPrice));
    }
    
    // Sort
    applySorting();
    
    // Update UI
    updateFilterUI();
    updateResultCount();
    
    // Trigger event
    document.dispatchEvent(new CustomEvent('filtersApplied', {
        detail: { filters: currentFilters, results: filteredCars }
    }));
    
    return filteredCars;
}

// ===== APPLY SORTING =====
function applySorting() {
    switch (currentFilters.sort) {
        case 'newest':
            filteredCars.sort((a, b) => b.year - a.year);
            break;
        case 'oldest':
            filteredCars.sort((a, b) => a.year - b.year);
            break;
        case 'price-low':
            filteredCars.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCars.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredCars.sort((a, b) => b.rating - a.rating);
            break;
        case 'popular':
            filteredCars.sort((a, b) => b.reviews - a.reviews);
            break;
        default:
            filteredCars.sort((a, b) => b.year - a.year);
    }
}

// ===== GET FILTERED CARS =====
function getFilteredCars() {
    return filteredCars;
}

// ===== UPDATE FILTER UI =====
function updateFilterUI() {
    // Update filter form values
    const searchInput = document.getElementById('filterSearch');
    if (searchInput) searchInput.value = currentFilters.search || '';
    
    const brandSelect = document.getElementById('filterBrand');
    if (brandSelect) brandSelect.value = currentFilters.brand || '';
    
    const categorySelect = document.getElementById('filterCategory');
    if (categorySelect) categorySelect.value = currentFilters.category || '';
    
    const yearSelect = document.getElementById('filterYear');
    if (yearSelect) yearSelect.value = currentFilters.year || '';
    
    const fuelSelect = document.getElementById('filterFuel');
    if (fuelSelect) fuelSelect.value = currentFilters.fuelType || '';
    
    const transmissionSelect = document.getElementById('filterTransmission');
    if (transmissionSelect) transmissionSelect.value = currentFilters.transmission || '';
    
    const conditionSelect = document.getElementById('filterCondition');
    if (conditionSelect) conditionSelect.value = currentFilters.condition || '';
    
    const minPriceInput = document.getElementById('filterMinPrice');
    if (minPriceInput) minPriceInput.value = currentFilters.minPrice || '';
    
    const maxPriceInput = document.getElementById('filterMaxPrice');
    if (maxPriceInput) maxPriceInput.value = currentFilters.maxPrice || '';
    
    const sortSelect = document.getElementById('filterSort');
    if (sortSelect) sortSelect.value = currentFilters.sort || 'newest';
}

// ===== UPDATE RESULT COUNT =====
function updateResultCount() {
    const countElement = document.getElementById('resultCount');
    if (countElement) {
        countElement.textContent = filteredCars.length;
    }
}

// ===== INIT FILTER ELEMENTS =====
function initFilterElements() {
    // Filter form
    const filterForm = document.querySelector('.filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
}

// ===== INIT PRICE RANGE =====
function initPriceRange() {
    const minSlider = document.getElementById('priceMinSlider');
    const maxSlider = document.getElementById('priceMaxSlider');
    const minDisplay = document.getElementById('priceMinDisplay');
    const maxDisplay = document.getElementById('priceMaxDisplay');
    
    if (minSlider && minDisplay) {
        minSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            minDisplay.textContent = formatCurrency(value);
            currentFilters.minPrice = value;
            saveFilters();
            applyFilters();
        });
    }
    
    if (maxSlider && maxDisplay) {
        maxSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            maxDisplay.textContent = formatCurrency(value);
            currentFilters.maxPrice = value;
            saveFilters();
            applyFilters();
        });
    }
}

// ===== INIT SORT FILTER =====
function initSortFilter() {
    const sortSelect = document.getElementById('filterSort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentFilters.sort = this.value;
            saveFilters();
            applyFilters();
        });
    }
}

// ===== INIT SEARCH FILTER =====
function initSearchFilter() {
    const searchInput = document.getElementById('filterSearch');
    if (searchInput) {
        // Debounce search
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                currentFilters.search = this.value;
                saveFilters();
                applyFilters();
            }, 300);
        });
    }
}

// ===== INIT FILTER BUTTONS =====
function initFilterButtons() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('[data-filter]');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            
            if (filterType && filterValue !== undefined) {
                currentFilters[filterType] = filterValue;
                saveFilters();
                applyFilters();
            }
        });
    });
    
    // Reset filters button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
}

// ===== RESET FILTERS =====
function resetFilters() {
    currentFilters = {
        search: '',
        brand: '',
        category: '',
        year: '',
        minPrice: '',
        maxPrice: '',
        fuelType: '',
        transmission: '',
        condition: '',
        sort: 'newest'
    };
    
    saveFilters();
    applyFilters();
    
    // Reset price sliders
    const minSlider = document.getElementById('priceMinSlider');
    const maxSlider = document.getElementById('priceMaxSlider');
    const minDisplay = document.getElementById('priceMinDisplay');
    const maxDisplay = document.getElementById('priceMaxDisplay');
    
    if (minSlider) minSlider.value = FILTERS_CONFIG.MIN_PRICE;
    if (maxSlider) maxSlider.value = FILTERS_CONFIG.MAX_PRICE;
    if (minDisplay) minDisplay.textContent = formatCurrency(FILTERS_CONFIG.MIN_PRICE);
    if (maxDisplay) maxDisplay.textContent = formatCurrency(FILTERS_CONFIG.MAX_PRICE);
    
    showNotification('Filtrlar tozalandi', 'info');
}

// ===== UPDATE FILTERS FROM URL =====
function updateFiltersFromURL() {
    const params = getUrlParams();
    
    if (params.search) currentFilters.search = params.search;
    if (params.brand) currentFilters.brand = params.brand;
    if (params.category) currentFilters.category = params.category;
    if (params.year) currentFilters.year = params.year;
    if (params.minPrice) currentFilters.minPrice = params.minPrice;
    if (params.maxPrice) currentFilters.maxPrice = params.maxPrice;
    if (params.sort) currentFilters.sort = params.sort;
    
    saveFilters();
    applyFilters();
}

// ===== GET FILTERS AS URL PARAMS =====
function getFiltersAsURLParams() {
    const params = new URLSearchParams();
    
    Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key]) {
            params.append(key, currentFilters[key]);
        }
    });
    
    return params.toString();
}

// ===== EXPOSE GLOBALLY =====
window.applyFilters = applyFilters;
window.getFilteredCars = getFilteredCars;
window.resetFilters = resetFilters;
window.updateFiltersFromURL = updateFiltersFromURL;
window.getFiltersAsURLParams = getFiltersAsURLParams;

console.log('✅ Filters Module loaded successfully');