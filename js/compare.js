/* ========================================
   CAR-ENTERPRISE - COMPARE MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initCompare();
});

// ===== COMPARE CONFIG =====
const COMPARE_CONFIG = {
    MAX_ITEMS: 4,
    STORAGE_KEY: 'compare',
    COMPARE_PAGE: 'compare.html'
};

// ===== COMPARE DATA =====
let compareItems = [];
let allCars = [];

// ===== INIT COMPARE =====
function initCompare() {
    // Load compare from storage
    compareItems = getCompareItems();
    
    // Load cars data (in production from API)
    loadCarsData();
    
    // Update UI
    updateCompareBadge();
    
    // Init compare buttons
    initCompareButtons();
    
    // Init compare page if on compare page
    if (document.querySelector('.compare-page')) {
        renderComparePage();
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

// ===== GET COMPARE ITEMS =====
function getCompareItems() {
    try {
        return JSON.parse(localStorage.getItem(COMPARE_CONFIG.STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

// ===== SAVE COMPARE ITEMS =====
function saveCompareItems() {
    try {
        localStorage.setItem(COMPARE_CONFIG.STORAGE_KEY, JSON.stringify(compareItems));
    } catch (error) {
        console.error('Failed to save compare:', error);
    }
}

// ===== ADD TO COMPARE =====
function addToCompare(carId) {
    // Check if already in compare
    if (compareItems.includes(carId)) {
        showNotification('Bu mashina allaqachon taqqoslashda', 'warning');
        return false;
    }
    
    // Check max items
    if (compareItems.length >= COMPARE_CONFIG.MAX_ITEMS) {
        showNotification(`Faqat ${COMPARE_CONFIG.MAX_ITEMS} tagacha mashina taqqoslanishi mumkin`, 'warning');
        return false;
    }
    
    // Add to compare
    compareItems.push(carId);
    saveCompareItems();
    updateCompareBadge();
    
    showNotification('Taqqoslashga qo\'shildi! 🔍', 'success');
    return true;
}

// ===== REMOVE FROM COMPARE =====
function removeFromCompare(carId) {
    compareItems = compareItems.filter(id => id !== carId);
    saveCompareItems();
    updateCompareBadge();
    
    // Re-render compare page if on compare page
    if (document.querySelector('.compare-page')) {
        renderComparePage();
    }
    
    showNotification('Taqqoslashdan olib tashlandi', 'info');
    return true;
}

// ===== TOGGLE COMPARE =====
function toggleCompare(carId) {
    if (compareItems.includes(carId)) {
        removeFromCompare(carId);
        return false;
    } else {
        return addToCompare(carId);
    }
}

// ===== CHECK IF IN COMPARE =====
function isInCompare(carId) {
    return compareItems.includes(carId);
}

// ===== GET COMPARE COUNT =====
function getCompareCount() {
    return compareItems.length;
}

// ===== UPDATE COMPARE BADGE =====
function updateCompareBadge() {
    const badge = document.getElementById('compareCount');
    if (!badge) return;
    
    const count = getCompareCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
}

// ===== INIT COMPARE BUTTONS =====
function initCompareButtons() {
    // Compare buttons with data-compare attribute
    const compareBtns = document.querySelectorAll('[data-compare]');
    
    compareBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const carId = parseInt(this.dataset.comparedId || this.dataset.carId);
            if (!carId) return;
            
            const isAdded = toggleCompare(carId);
            this.classList.toggle('active', isAdded);
            
            // Update button text
            const icon = this.querySelector('i');
            const text = this.querySelector('.btn-text');
            
            if (icon) {
                icon.className = isAdded ? 'fas fa-check-circle' : 'fas fa-balance-scale';
            }
            if (text) {
                text.textContent = isAdded ? 'Taqqoslashda' : 'Taqqoslash';
            }
        });
    });
    
    // Update initial states
    compareBtns.forEach(function(btn) {
        const carId = parseInt(btn.dataset.comparedId || btn.dataset.carId);
        if (carId && isInCompare(carId)) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            const text = btn.querySelector('.btn-text');
            if (icon) icon.className = 'fas fa-check-circle';
            if (text) text.textContent = 'Taqqoslashda';
        }
    });
}

// ===== RENDER COMPARE PAGE =====
function renderComparePage() {
    const container = document.getElementById('compareContainer');
    if (!container) return;
    
    const compareCars = compareItems
        .map(id => allCars.find(c => c.id === id))
        .filter(car => car);
    
    if (compareCars.length === 0) {
        container.innerHTML = `
            <div class="compare-empty">
                <i class="fas fa-balance-scale"></i>
                <h3>Hech qanday mashina taqqoslanmagan</h3>
                <p>Mashinalarni taqqoslash uchun ularni qo'shing</p>
                <a href="cars.html" class="btn btn-primary">
                    <i class="fas fa-car"></i> Mashinalarni ko'rish
                </a>
            </div>
        `;
        return;
    }
    
    // Build comparison table
    let html = `
        <div class="compare-table">
            <div class="compare-row compare-header">
                <div class="compare-label">Xususiyat</div>
                ${compareCars.map(car => `
                    <div class="compare-item">
                        <div class="compare-item-image">
                            <img src="../images/${car.images[0] || 'cars/default.jpg'}" alt="${car.brand} ${car.model}">
                            <button class="compare-remove" onclick="removeFromCompare(${car.id})">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <h4>${car.brand} ${car.model}</h4>
                        <span class="compare-price">${formatCurrency(car.price)}</span>
                        <a href="car-detail.html?id=${car.id}" class="btn btn-sm btn-outline">
                            <i class="fas fa-eye"></i> Ko'rish
                        </a>
                    </div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Brend</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.brand}</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Model</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.model}</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Yil</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.year}</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Kategoriya</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.category}</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Yoqilg'i</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.fuelType}</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Transmissiya</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.transmission}</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Dvigatel</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.engine}</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Quvvat</div>
                ${compareCars.map(car => `
                    <div class="compare-value">${car.power} ot kuchi</div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Rangi</div>
                ${compareCars.map(car => `
                    <div class="compare-value">
                        <span class="color-dot" style="background: ${getColorCode(car.color)};"></span>
                        ${car.color}
                    </div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Holati</div>
                ${compareCars.map(car => `
                    <div class="compare-value">
                        <span class="badge ${car.condition === 'Yangi' ? 'badge-success' : 'badge-warning'}">
                            ${car.condition}
                        </span>
                    </div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Reyting</div>
                ${compareCars.map(car => `
                    <div class="compare-value">
                        <span class="stars">${renderStars(car.rating)}</span>
                        <span class="rating-number">${car.rating}</span>
                        <span class="reviews-count">(${car.reviews})</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="compare-row">
                <div class="compare-label">Xususiyatlar</div>
                ${compareCars.map(car => `
                    <div class="compare-value">
                        <ul class="compare-features">
                            ${car.features.map(f => `
                                <li><i class="fas fa-check"></i> ${f}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
            
            <div class="compare-row compare-actions">
                <div class="compare-label"></div>
                ${compareCars.map(car => `
                    <div class="compare-value">
                        <a href="car-detail.html?id=${car.id}" class="btn btn-primary btn-block">
                            <i class="fas fa-shopping-cart"></i> Xarid qilish
                        </a>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ===== RENDER STARS =====
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '<i class="fas fa-star"></i>'.repeat(full) + 
           (half ? '<i class="fas fa-star-half-alt"></i>' : '') + 
           '<i class="far fa-star"></i>'.repeat(empty);
}

// ===== GET COLOR CODE =====
function getColorCode(color) {
    const colors = {
        'qora': '#000000',
        'oq': '#ffffff',
        'kumush': '#c0c0c0',
        'qizil': '#ff0000',
        'ko\'k': '#0000ff',
        'yashil': '#00ff00',
        'sariq': '#ffff00',
        'oltin': '#ffd700',
        'kumush': '#c0c0c0',
        'bordo': '#800000'
    };
    return colors[color.toLowerCase()] || '#cccccc';
}

// ===== CLEAR ALL COMPARE =====
function clearCompare() {
    if (compareItems.length === 0) return;
    
    if (confirm('Barcha mashinalarni taqqoslashdan olib tashlashni xohlaysizmi?')) {
        compareItems = [];
        saveCompareItems();
        updateCompareBadge();
        
        if (document.querySelector('.compare-page')) {
            renderComparePage();
        }
        
        showNotification('Taqqoslash tozalandi', 'info');
    }
}

// ===== EXPOSE GLOBALLY =====
window.addToCompare = addToCompare;
window.removeFromCompare = removeFromCompare;
window.toggleCompare = toggleCompare;
window.isInCompare = isInCompare;
window.getCompareCount = getCompareCount;
window.clearCompare = clearCompare;

console.log('✅ Compare Module loaded successfully');