/* ========================================
   CAR-ENTERPRISE - FAVORITES MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initFavorites();
});

// ===== FAVORITES CONFIG =====
const FAVORITES_CONFIG = {
    STORAGE_KEY: 'favorites',
    MAX_ITEMS: 100
};

// ===== FAVORITES DATA =====
let favorites = [];
let allCars = [];

// ===== INIT FAVORITES =====
function initFavorites() {
    // Load favorites from storage
    favorites = getFavorites();
    
    // Load cars data (in production from API)
    loadCarsData();
    
    // Update UI
    updateFavoritesBadge();
    initFavoriteButtons();
    
    // Init favorites page if on favorites page
    if (document.querySelector('.favorites-page')) {
        renderFavoritesPage();
    }
}

// ===== LOAD CARS DATA =====
function loadCarsData() {
    // In production: API.cars.getAll()
    // For demo, use mock data
    allCars = getCarsData();
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
            description: 'BMW X5 - hashamatli va kuchli SUV.',
            features: ['Parktronik', 'Kamera', 'Sunroof', 'Iqlim nazorati'],
            images: ['cars/bmw-x5-1.jpg'],
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
            description: 'Mercedes S-Class - eng hashamatli sedan.',
            features: ['MBUX', 'Massajli o\'rindiqlar', 'Burmester audio', 'Panorama'],
            images: ['cars/mercedes-s-class-1.jpg'],
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
            description: 'Toyota Camry - ishonchli va qulay sedan.',
            features: ['Toyota Safety Sense', 'Karplay', 'Kamera'],
            images: ['cars/toyota-camry-1.jpg'],
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
            description: 'Porsche Cayenne - sport SUV.',
            features: ['Porsche Dynamic', 'Panorama', 'Burmester audio'],
            images: ['cars/porsche-cayenne-1.jpg'],
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
            description: 'Audi Q7 - kuchli va qulay SUV.',
            features: ['Quattro', 'Parktronik', 'Kamera', 'Sunroof'],
            images: ['cars/audi-q7-1.jpg'],
            rating: 4.7,
            reviews: 145,
            isFeatured: false,
            isNew: false
        }
    ];
}

// ===== GET FAVORITES =====
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem(FAVORITES_CONFIG.STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

// ===== SAVE FAVORITES =====
function saveFavorites() {
    try {
        localStorage.setItem(FAVORITES_CONFIG.STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Failed to save favorites:', error);
    }
}

// ===== ADD TO FAVORITES =====
function addToFavorites(carId) {
    // Check if already in favorites
    if (favorites.includes(carId)) {
        showNotification('Bu mashina allaqachon sevimlilarda', 'warning');
        return false;
    }
    
    // Check max items
    if (favorites.length >= FAVORITES_CONFIG.MAX_ITEMS) {
        showNotification(`Faqat ${FAVORITES_CONFIG.MAX_ITEMS} tagacha mashina sevimlilarga qo'shilishi mumkin`, 'warning');
        return false;
    }
    
    // Add to favorites
    favorites.push(carId);
    saveFavorites();
    updateFavoritesBadge();
    
    showNotification('Sevimlilarga qo\'shildi ❤️', 'success');
    return true;
}

// ===== REMOVE FROM FAVORITES =====
function removeFromFavorites(carId) {
    favorites = favorites.filter(id => id !== carId);
    saveFavorites();
    updateFavoritesBadge();
    
    // Re-render favorites page if on favorites page
    if (document.querySelector('.favorites-page')) {
        renderFavoritesPage();
    }
    
    showNotification('Sevimlilardan olib tashlandi', 'info');
    return true;
}

// ===== TOGGLE FAVORITE =====
function toggleFavorite(carId) {
    if (favorites.includes(carId)) {
        removeFromFavorites(carId);
        return false;
    } else {
        return addToFavorites(carId);
    }
}

// ===== CHECK IF IN FAVORITES =====
function isFavorite(carId) {
    return favorites.includes(carId);
}

// ===== GET FAVORITES COUNT =====
function getFavoritesCount() {
    return favorites.length;
}

// ===== GET FAVORITE CARS =====
function getFavoriteCars() {
    return favorites
        .map(id => allCars.find(c => c.id === id))
        .filter(car => car);
}

// ===== UPDATE FAVORITES BADGE =====
function updateFavoritesBadge() {
    const badge = document.getElementById('favoritesCount');
    if (!badge) return;
    
    const count = getFavoritesCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

// ===== INIT FAVORITE BUTTONS =====
function initFavoriteButtons() {
    // Favorite buttons with data-favorite attribute
    const favoriteBtns = document.querySelectorAll('[data-favorite]');
    
    favoriteBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const carId = parseInt(this.dataset.favoriteId || this.dataset.carId);
            if (!carId) return;
            
            const isAdded = toggleFavorite(carId);
            this.classList.toggle('active', isAdded);
            
            // Update button icon
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isAdded ? 'fas fa-heart' : 'far fa-heart';
            }
            
            // Update button text
            const text = this.querySelector('.btn-text');
            if (text) {
                text.textContent = isAdded ? 'Sevimlilarda' : 'Sevimlilarga';
            }
        });
    });
    
    // Update initial states
    favoriteBtns.forEach(function(btn) {
        const carId = parseInt(btn.dataset.favoriteId || btn.dataset.carId);
        if (carId && isFavorite(carId)) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            const text = btn.querySelector('.btn-text');
            if (icon) icon.className = 'fas fa-heart';
            if (text) text.textContent = 'Sevimlilarda';
        }
    });
}

// ===== RENDER FAVORITES PAGE =====
function renderFavoritesPage() {
    const container = document.getElementById('favoritesContainer');
    if (!container) return;
    
    const favoriteCars = getFavoriteCars();
    
    if (favoriteCars.length === 0) {
        container.innerHTML = `
            <div class="favorites-empty">
                <i class="fas fa-heart"></i>
                <h3>Sevimli mashinalar yo'q</h3>
                <p>Mashinalarni ko'rib, sevimlilarga qo'shing</p>
                <a href="cars.html" class="btn btn-primary">
                    <i class="fas fa-car"></i> Mashinalarni ko'rish
                </a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="favorites-grid">
            ${favoriteCars.map(car => createFavoriteCard(car)).join('')}
        </div>
    `;
}

// ===== CREATE FAVORITE CARD =====
function createFavoriteCard(car) {
    const hasDiscount = car.oldPrice && car.oldPrice > car.price;
    const discount = hasDiscount ? Math.round(((car.oldPrice - car.price) / car.oldPrice) * 100) : 0;
    const imgPath = car.images && car.images.length > 0 ? `../images/${car.images[0]}` : '../images/cars/default.jpg';
    
    return `
        <div class="favorite-card" data-id="${car.id}">
            <div class="favorite-card-image">
                <img src="${imgPath}" alt="${car.brand} ${car.model}" loading="lazy">
                ${car.isNew ? '<span class="badge badge-new">Yangi</span>' : ''}
                ${hasDiscount ? `<span class="badge badge-sale">-${discount}%</span>` : ''}
                <button class="favorite-remove" onclick="removeFromFavorites(${car.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="favorite-card-info">
                <h4><a href="car-detail.html?id=${car.id}">${car.brand} ${car.model}</a></h4>
                <div class="favorite-card-specs">
                    <span><i class="fas fa-calendar"></i> ${car.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} km</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                </div>
                <div class="favorite-card-specs">
                    <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                    <span><i class="fas fa-paint-bucket"></i> ${car.color}</span>
                    <span><i class="fas fa-star" style="color:var(--warning);"></i> ${car.rating} (${car.reviews})</span>
                </div>
                <div class="favorite-card-price">
                    <div>
                        ${hasDiscount ? `<span class="old-price">${formatCurrency(car.oldPrice)}</span>` : ''}
                        <span class="price">${formatCurrency(car.price)}</span>
                    </div>
                    <div class="favorite-card-actions">
                        <a href="car-detail.html?id=${car.id}" class="btn btn-sm btn-outline">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="btn btn-sm btn-danger" onclick="removeFromFavorites(${car.id})">
                            <i class="fas fa-heart-broken"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== CLEAR ALL FAVORITES =====
function clearFavorites() {
    if (favorites.length === 0) return;
    
    if (confirm('Barcha sevimli mashinalarni o\'chirishni xohlaysizmi?')) {
        favorites = [];
        saveFavorites();
        updateFavoritesBadge();
        
        if (document.querySelector('.favorites-page')) {
            renderFavoritesPage();
        }
        
        showNotification('Sevimlilar tozalandi', 'info');
    }
}

// ===== EXPOSE GLOBALLY =====
window.addToFavorites = addToFavorites;
window.removeFromFavorites = removeFromFavorites;
window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
window.getFavoritesCount = getFavoritesCount;
window.getFavoriteCars = getFavoriteCars;
window.clearFavorites = clearFavorites;

console.log('✅ Favorites Module loaded successfully');