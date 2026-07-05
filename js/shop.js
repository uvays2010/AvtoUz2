/* ========================================
   CAR-ENTERPRISE - SHOP MODULE
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    if (!document.querySelector('.shop-section')) return;
    
    initShop();
});

// ===== SHOP DATA =====
const shopProducts = [
    {
        id: 1,
        name: "Avtomobil qoplamasi",
        category: "aksessuarlar",
        price: 250000,
        oldPrice: 350000,
        rating: 4.8,
        reviews: 45,
        image: "../images/shop/cover.jpg",
        brand: "BMW",
        isNew: true,
        isSale: true
    },
    {
        id: 2,
        name: "Motor yog'i 5W-30",
        category: "yog'lar",
        price: 180000,
        oldPrice: null,
        rating: 4.9,
        reviews: 78,
        image: "../images/shop/oil.jpg",
        brand: "Toyota",
        isNew: false,
        isSale: false
    },
    {
        id: 3,
        name: "Tormoz disklari",
        category: "ehtiyot-qismlar",
        price: 450000,
        oldPrice: 550000,
        rating: 4.7,
        reviews: 34,
        image: "../images/shop/brake.jpg",
        brand: "Mercedes",
        isNew: true,
        isSale: true
    },
    {
        id: 4,
        name: "Avtomobil shampuni",
        category: "aksessuarlar",
        price: 85000,
        oldPrice: null,
        rating: 4.5,
        reviews: 56,
        image: "../images/shop/shampoo.jpg",
        brand: "Audi",
        isNew: false,
        isSale: false
    },
    {
        id: 5,
        name: "Havo filtri",
        category: "ehtiyot-qismlar",
        price: 120000,
        oldPrice: 150000,
        rating: 4.6,
        reviews: 29,
        image: "../images/shop/filter.jpg",
        brand: "BMW",
        isNew: false,
        isSale: true
    },
    {
        id: 6,
        name: "Transmissiya yog'i",
        category: "yog'lar",
        price: 220000,
        oldPrice: 280000,
        rating: 4.8,
        reviews: 42,
        image: "../images/shop/transmission-oil.jpg",
        brand: "Toyota",
        isNew: true,
        isSale: true
    },
    {
        id: 7,
        name: "Faralar to'plami",
        category: "aksessuarlar",
        price: 320000,
        oldPrice: null,
        rating: 4.4,
        reviews: 38,
        image: "../images/shop/headlights.jpg",
        brand: "Mercedes",
        isNew: false,
        isSale: false
    },
    {
        id: 8,
        name: "Dvigatel moyi",
        category: "yog'lar",
        price: 195000,
        oldPrice: 230000,
        rating: 4.9,
        reviews: 67,
        image: "../images/shop/engine-oil.jpg",
        brand: "Audi",
        isNew: false,
        isSale: true
    },
    {
        id: 9,
        name: "Shinalar to'plami",
        category: "ehtiyot-qismlar",
        price: 2800000,
        oldPrice: 3200000,
        rating: 4.7,
        reviews: 23,
        image: "../images/shop/tires.jpg",
        brand: "BMW",
        isNew: true,
        isSale: true
    }
];

let currentCategory = 'all';
let currentSort = 'newest';
let currentView = 'grid';
let currentPage = 1;
const itemsPerPage = 6;
let maxPrice = 5000000;

// ===== INIT SHOP =====
function initShop() {
    renderProducts();
    initCategoryFilter();
    initPriceFilter();
    initSortFilter();
    initViewToggle();
    initProductActions();
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
    const grid = document.getElementById('shopGrid');
    if (!grid) return;
    
    let filtered = shopProducts;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    
    filtered = filtered.filter(p => p.price <= maxPrice);
    filtered = sortProducts(filtered);
    
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filtered.slice(startIndex, endIndex);
    
    const countEl = document.getElementById('productCount');
    if (countEl) {
        countEl.textContent = `${totalItems} ta mahsulot`;
    }
    
    if (paginated.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-box-open" style="font-size: 60px; color: #dee2e6; margin-bottom: 20px;"></i>
                <h3>Hech qanday mahsulot topilmadi</h3>
                <p>Iltimos, filtr sozlamalarini o'zgartirib ko'ring</p>
            </div>
        `;
        updatePagination(0, 1);
        return;
    }
    
    grid.className = `shop-grid ${currentView === 'list' ? 'list-view' : ''}`;
    grid.innerHTML = paginated.map(product => createProductCard(product)).join('');
    updatePagination(totalItems, totalPages);
}

// ===== CREATE PRODUCT CARD =====
function createProductCard(product) {
    const stars = renderStars(product.rating);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.isNew ? '<span class="product-badge new">Yangi</span>' : ''}
                ${product.isSale ? `<span class="product-badge sale">-${discount}%</span>` : ''}
                <div class="product-actions">
                    <button onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i></button>
                    <button onclick="toggleWishlist(${product.id})"><i class="fas fa-heart"></i></button>
                    <button onclick="quickView(${product.id})"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h4 class="product-name"><a href="shop-detail.html?id=${product.id}">${product.name}</a></h4>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current">${formatCurrency(product.price)}</span>
                    ${product.oldPrice ? `<span class="old">${formatCurrency(product.oldPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// ===== RENDER STARS =====
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let html = '';
    for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
    if (half) html += '<i class="fas fa-star-half-alt"></i>';
    for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
    return html;
}

// ===== SORT PRODUCTS =====
function sortProducts(products) {
    switch (currentSort) {
        case 'newest':
            return [...products].sort((a, b) => a.id - b.id);
        case 'popular':
            return [...products].sort((a, b) => b.reviews - a.reviews);
        case 'price-low':
            return [...products].sort((a, b) => a.price - b.price);
        case 'price-high':
            return [...products].sort((a, b) => b.price - a.price);
        default:
            return products;
    }
}

// ===== UPDATE PAGINATION =====
function updatePagination(totalItems, totalPages) {
    const pagination = document.getElementById('shopPagination');
    if (!pagination) return;
    
    if (totalItems <= itemsPerPage || totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `
        <button class="page-item ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="goToShopPage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        html += `<button class="page-item" onclick="goToShopPage(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-item page-dots">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-item ${i === currentPage ? 'active' : ''}" 
                    onclick="goToShopPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="page-item page-dots">...</span>`;
        }
        html += `<button class="page-item" onclick="goToShopPage(${totalPages})">${totalPages}</button>`;
    }
    
    html += `
        <button class="page-item ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="goToShopPage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = html;
}

function goToShopPage(page) {
    const totalItems = shopProducts.filter(p => {
        if (currentCategory !== 'all' && p.category !== currentCategory) return false;
        return p.price <= maxPrice;
    }).length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== CATEGORY FILTER =====
function initCategoryFilter() {
    const categoryLinks = document.querySelectorAll('.category-list a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            currentPage = 1;
            renderProducts();
        });
    });
}

// ===== PRICE FILTER =====
function initPriceFilter() {
    const rangeInput = document.getElementById('priceRange');
    if (!rangeInput) return;
    
    const display = document.getElementById('priceDisplay');
    
    rangeInput.addEventListener('input', function() {
        maxPrice = parseInt(this.value);
        if (display) {
            display.textContent = formatCurrency(maxPrice);
        }
        currentPage = 1;
        renderProducts();
    });
}

// ===== SORT FILTER =====
function initSortFilter() {
    const sortSelect = document.getElementById('sortProducts');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        currentPage = 1;
        renderProducts();
    });
}

// ===== VIEW TOGGLE =====
function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-buttons button');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            renderProducts();
        });
    });
}

// ===== PRODUCT ACTIONS =====
function initProductActions() {
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.product-actions button');
        if (!target) return;
        
        const productCard = target.closest('.product-card');
        if (!productCard) return;
        
        const productId = parseInt(productCard.dataset.id);
        
        if (target.querySelector('.fa-shopping-cart')) {
            addToCart(productId);
        } else if (target.querySelector('.fa-heart')) {
            toggleWishlist(productId);
        } else if (target.querySelector('.fa-eye')) {
            quickView(productId);
        }
    });
}

// ===== CART ACTIONS =====
function addToCart(productId) {
    const product = shopProducts.find(p => p.id === productId);
    if (product) {
        showNotification(`${product.name} savatga qo'shildi!`, 'success');
    }
}

function toggleWishlist(productId) {
    showNotification('Sevimlilarga qo\'shildi ❤️', 'success');
}

function quickView(productId) {
    const product = shopProducts.find(p => p.id === productId);
    if (!product) return;
    showNotification(`📦 ${product.name} - ${formatCurrency(product.price)}`, 'info');
}

// ===== EXPOSE GLOBALLY =====
window.goToShopPage = goToShopPage;
window.addToCart = addToCart;
window.toggleWishlist = toggleWishlist;
window.quickView = quickView;

console.log('✅ Shop Module loaded successfully');