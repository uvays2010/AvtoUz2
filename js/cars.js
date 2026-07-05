document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.cars-section')) return;
    
    initCarsPage();
});

// ===== VARIABLES =====
let allCars = [];
let filteredCars = [];
let currentPage = 1;
const itemsPerPage = 9;
let currentView = 'grid';

// ===== INIT =====
function initCarsPage() {
    loadCars();
    initFilters();
    initViewToggle();
    initSearch();
}

// ===== LOAD CARS =====
function loadCars() {
    // Demo data - in production use API
    allCars = getCarsData();
    filteredCars = [...allCars];
    renderCars();
    updateCarsCount();
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
            brand: 'Honda',
            model: 'Accord',
            year: 2023,
            price: 32000000,
            oldPrice: null,
            category: 'Sedan',
            fuelType: 'Benzin',
            transmission: 'Avtomat',
            engine: '2.0L',
            power: 192,
            color: 'Ko\'k',
            mileage: 25000,
            condition: 'Ishlatilgan',
            description: 'Honda Accord - sport ko\'rinish va qulaylik.',
            features: ['Honda Sensing', 'Karplay', 'Kamera'],
            images: ['cars/honda-accord-1.jpg'],
            rating: 4.6,
            reviews: 178,
            isFeatured: false,
            isNew: false
        },
        {
            id: 5,
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
            description: 'Lexus RX 350 - hashamatli va ishonchli SUV.',
            features: ['Lexus Safety System', 'Mark Levinson audio', 'Panorama'],
            images: ['cars/lexus-rx-1.jpg'],
            rating: 4.8,
            reviews: 102,
            isFeatured: true,
            isNew: true
        },
        {
            id: 6,
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
            description: 'Audi Q7 - kuchli va qulay 7 o\'rinli SUV.',
            features: ['Quattro', 'Parktronik', 'Kamera', 'Sunroof'],
            images: ['cars/audi-q7-1.jpg'],
            rating: 4.7,
            reviews: 145,
            isFeatured: false,
            isNew: false
        },
        {
            id: 7,
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
            description: 'Porsche Cayenne - sport SUV. Kuch va hashamat.',
            features: ['Porsche Dynamic', 'Panorama', 'Burmester audio'],
            images: ['cars/porsche-cayenne-1.jpg'],
            rating: 4.9,
            reviews: 67,
            isFeatured: true,
            isNew: true
        },
        {
            id: 8,
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
            description: 'Hyundai Santa Fe - qulay va ishonchli oilaviy SUV.',
            features: ['Hyundai SmartSense', 'Karplay', 'Kamera'],
            images: ['cars/hyundai-santa-fe-1.jpg'],
            rating: 4.5,
            reviews: 189,
            isFeatured: false,
            isNew: false
        },
        {
            id: 9,
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
            description: 'KIA Sportage - zamonaviy va iqtisodiy SUV.',
            features: ['KIA Drive Wise', 'Karplay', 'Kamera'],
            images: ['cars/kia-sportage-1.jpg'],
            rating: 4.4,
            reviews: 212,
            isFeatured: false,
            isNew: true
        },
        {
            id: 10,
            brand: 'Volkswagen',
            model: 'Touareg',
            year: 2023,
            price: 58000000,
            oldPrice: 62000000,
            category: 'SUV',
            fuelType: 'Dizel',
            transmission: 'Avtomat',
            engine: '3.0L',
            power: 231,
            color: 'Qora',
            mileage: 18000,
            condition: 'Ishlatilgan',
            description: 'Volkswagen Touareg - kuchli va qulay premium SUV.',
            features: ['4Motion', 'Parktronik', 'Kamera', 'Sunroof'],
            images: ['cars/vw-touareg-1.jpg'],
            rating: 4.6,
            reviews: 98,
            isFeatured: false,
            isNew: false
        }
    ];
}

// ===== RENDER CARS =====
function renderCars() {
    const grid = document.getElementById('carsGrid');
    if (!grid) return;
    
    // Paginate
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedCars = filteredCars.slice(start, end);
    
    if (paginatedCars.length === 0) {
        grid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Hech qanday mashina topilmadi</h3>
                <p>Iltimos, filtr sozlamalarini o'zgartirib ko'ring</p>
                <button class="btn btn-primary" onclick="resetFilters()">Filtrni tozalash</button>
            </div>
        `;
        updatePagination(0);
        return;
    }
    
    grid.className = `cars-grid ${currentView === 'list' ? 'list-view' : ''}`;
    grid.innerHTML = paginatedCars.map(car => createCarCard(car)).join('');
    
    updatePagination(filteredCars.length);
}

// ===== CREATE CAR CARD =====
function createCarCard(car) {
    const hasDiscount = car.oldPrice && car.oldPrice > car.price;
    const discount = hasDiscount ? Math.round(((car.oldPrice - car.price) / car.oldPrice) * 100) : 0;
    const isFavorite = Favorites.isFavorite(car.id);
    const imgPath = car.images && car.images.length > 0 ? `../images/${car.images[0]}` : '../images/cars/default.jpg';
    
    return `
        <div class="car-card" data-id="${car.id}">
            <div class="car-image">
                <img src="${imgPath}" alt="${car.brand} ${car.model}" loading="lazy">
                ${car.isNew ? '<span class="car-badge">Yangi</span>' : ''}
                ${hasDiscount ? `<span class="car-badge" style="background:var(--success);">-${discount}%</span>` : ''}
                <div class="car-actions">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${car.id})">
                        <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i>
                    </button>
                    <button onclick="addToCart(${car.id})"><i class="fas fa-shopping-cart"></i></button>
                    <button onclick="window.location.href='car-detail.html?id=${car.id}'"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="car-info">
                <h4 class="car-name">
                    <a href="car-detail.html?id=${car.id}">${car.brand} ${car.model}</a>
                </h4>
                <div class="car-specs">
                    <span><i class="fas fa-calendar"></i> ${car.year}</span>
                    <span><i class="fas fa-tachometer-alt"></i> ${car.mileage.toLocaleString()} km</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                </div>
                <div class="car-specs">
                    <span><i class="fas fa-cog"></i> ${car.transmission}</span>
                    <span><i class="fas fa-paint-bucket"></i> ${car.color}</span>
                    <span><i class="fas fa-star" style="color:var(--warning);"></i> ${car.rating} (${car.reviews})</span>
                </div>
                <div class="car-price">
                    <div>
                        ${hasDiscount ? `<span class="old-price">${formatCurrency(car.oldPrice)}</span>` : ''}
                        <span class="price">${formatCurrency(car.price)}</span>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${car.id})">
                        <i class="fas fa-shopping-cart"></i> Savatga
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== FILTERS =====
function initFilters() {
    // Apply filters button
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    
    // Reset filters button
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // Enter key for search
    document.getElementById('searchCars').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') applyFilters();
    });
    
    // Auto-filter on select change
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', applyFilters);
    });
}

function applyFilters() {
    const search = document.getElementById('searchCars').value.toLowerCase().trim();
    const brand = document.getElementById('brandFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const year = document.getElementById('yearFilter').value;
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity;
    const sort = document.getElementById('sortFilter').value;
    
    filteredCars = allCars.filter(car => {
        let match = true;
        
        // Search
        if (search) {
            const searchText = `${car.brand} ${car.model} ${car.category} ${car.year}`.toLowerCase();
            if (!searchText.includes(search)) match = false;
        }
        
        // Brand
        if (brand && car.brand !== brand) match = false;
        
        // Category
        if (category && car.category !== category) match = false;
        
        // Year
        if (year && car.year !== parseInt(year)) match = false;
        
        // Price
        if (car.price < minPrice || car.price > maxPrice) match = false;
        
        return match;
    });
    
    // Sort
    switch (sort) {
        case 'newest':
            filteredCars.sort((a, b) => b.year - a.year);
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
    }
    
    currentPage = 1;
    renderCars();
    updateCarsCount();
}

function resetFilters() {
    document.getElementById('searchCars').value = '';
    document.getElementById('brandFilter').value = '';
    document.getElementById('categoryFilter').value = '';
    document.getElementById('yearFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortFilter').value = 'newest';
    
    filteredCars = [...allCars];
    currentPage = 1;
    renderCars();
    updateCarsCount();
}

// ===== UPDATE CARS COUNT =====
function updateCarsCount() {
    document.getElementById('carsCount').textContent = filteredCars.length;
}

// ===== PAGINATION =====
function updatePagination(total) {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    const totalPages = Math.ceil(total / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `<button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
    
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }
    
    if (start > 1) {
        html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (start > 2) html += `<span class="page-btn page-dots">...</span>`;
    }
    
    for (let i = start; i <= end; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    
    if (end < totalPages) {
        if (end < totalPages - 1) html += `<span class="page-btn page-dots">...</span>`;
        html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    html += `<button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
    
    container.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderCars();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== VIEW TOGGLE =====
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            renderCars();
        });
    });
}

// ===== SEARCH =====
function initSearch() {
    const searchInput = document.getElementById('searchCars');
    if (!searchInput) return;
    
    // Get search param from URL
    const params = getUrlParams();
    if (params.search) {
        searchInput.value = params.search;
        applyFilters();
    }
}

// ===== ACTIONS =====
function toggleFavorite(carId) {
    const isFavorite = Favorites.toggle(carId);
    const btn = document.querySelector(`.car-card[data-id="${carId}"] .favorite-btn`);
    if (btn) {
        btn.classList.toggle('active');
        btn.querySelector('i').className = `fas ${isFavorite ? 'fa-heart' : 'fa-heart'}`;
    }
}

function addToCart(carId) {
    const car = allCars.find(c => c.id === carId);
    if (car) {
        Cart.addItem(carId, 1);
        showNotification(`${car.brand} ${car.model} savatga qo'shildi!`, 'success');
    }
}

// ===== EXPOSE GLOBALLY =====
window.goToPage = goToPage;
window.resetFilters = resetFilters;
window.toggleFavorite = toggleFavorite;
window.addToCart = addToCart;

console.log('✅ Cars Module loaded');