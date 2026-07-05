document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.product-detail-section')) return;
    
    initShopDetail();
});

// ===== PRODUCT DATA =====
let currentProduct = null;
let allProducts = [];

function getShopProducts() {
    return [
        {
            id: 1,
            name: "Avtomobil qoplamasi",
            category: "aksessuarlar",
            price: 250000,
            oldPrice: 350000,
            rating: 4.8,
            reviews: 45,
            image: "shop/cover.jpg",
            images: ["shop/cover.jpg", "shop/cover-2.jpg", "shop/cover-3.jpg"],
            brand: "BMW",
            isNew: true,
            isSale: true,
            description: "Yuqori sifatli avtomobil qoplamasi. Avtomobilingizni chang, quyosh va boshqa tashqi omillardan himoya qiladi.",
            specs: {
                "Material": "Poliester",
                "O'lcham": "Universal",
                "Rang": "Kumush",
                "Vazn": "1.2 kg"
            },
            features: ["UV himoya", "Suv o'tkazmaydi", "Yengil", "Yig'ish oson"]
        },
        {
            id: 2,
            name: "Motor yog'i 5W-30",
            category: "yog'lar",
            price: 180000,
            oldPrice: null,
            rating: 4.9,
            reviews: 78,
            image: "shop/oil.jpg",
            images: ["shop/oil.jpg", "shop/oil-2.jpg"],
            brand: "Toyota",
            isNew: false,
            isSale: false,
            description: "Yuqori sifatli motor yog'i. Dvigatelingizni ishqalanishdan himoya qiladi va uning ishlash muddatini uzaytiradi.",
            specs: {
                "Turi": "Sintetik",
                "Yopishqoqlik": "5W-30",
                "Hajm": "4 litr",
                "Standart": "API SN"
            },
            features: ["Yuqori himoya", "Yoqilg'i tejaydi", "Sovuqqa chidamli", "Uzoq muddatli"]
        },
        {
            id: 3,
            name: "Tormoz disklari",
            category: "ehtiyot-qismlar",
            price: 450000,
            oldPrice: 550000,
            rating: 4.7,
            reviews: 34,
            image: "shop/brake.jpg",
            images: ["shop/brake.jpg", "shop/brake-2.jpg"],
            brand: "Mercedes",
            isNew: true,
            isSale: true,
            description: "Yuqori sifatli tormoz disklari. Avtomobilingizning tormoz tizimini mukammal holatga keltiradi.",
            specs: {
                "Material": "Po'lat",
                "O'lcham": "300 mm",
                "Turi": "Ventilyatsiyali",
                "Muvofiqlik": "Universal"
            },
            features: ["Yuqori issiqlik o'tkazuvchanligi", "Uzoq muddatli", "Ishonchli", "Shovqinsiz"]
        },
        {
            id: 4,
            name: "Avtomobil shampuni",
            category: "aksessuarlar",
            price: 85000,
            oldPrice: null,
            rating: 4.5,
            reviews: 56,
            image: "shop/shampoo.jpg",
            images: ["shop/shampoo.jpg"],
            brand: "Audi",
            isNew: false,
            isSale: false,
            description: "Maxsus avtomobil shampuni. Avtomobilingizni yumshoq va samarali tozalaydi, lakka zarar yetkazmaydi.",
            specs: {
                "Turi": "Suyuqlik",
                "Hajm": "1 litr",
                "pH": "Neytral",
                "Xushbo'y": "Yangi"
            },
            features: ["Yumshoq tozalash", "Ko'pikli", "Lakka zarar yetkazmaydi", "Yaxshi yuviladi"]
        }
    ];
}

// ===== INIT =====
function initShopDetail() {
    const params = getUrlParams();
    const productId = params.id;
    
    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }
    
    loadProductDetail(productId);
    initTabs();
    initQuantity();
}

// ===== LOAD PRODUCT =====
function loadProductDetail(productId) {
    allProducts = getShopProducts();
    const product = allProducts.find(p => p.id === parseInt(productId));
    
    if (!product) {
        showNotification('Mahsulot topilmadi', 'error');
        setTimeout(() => window.location.href = 'shop.html', 2000);
        return;
    }
    
    currentProduct = product;
    renderProductDetail(product);
    renderRelatedProducts(product);
}

// ===== RENDER PRODUCT =====
function renderProductDetail(product) {
    // Update page title
    document.title = `${product.name} | Car Enterprise`;
    
    // Update breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.name;
    document.getElementById('productSubtitle').textContent = product.category;
    
    // Gallery
    const mainImage = document.getElementById('mainImage');
    const mainImageLink = document.getElementById('mainImageLink');
    const thumbnails = document.getElementById('thumbnails');
    
    if (product.images && product.images.length > 0) {
        const imgPath = `../images/${product.images[0]}`;
        mainImage.src = imgPath;
        mainImage.alt = product.name;
        mainImageLink.href = imgPath;
        
        thumbnails.innerHTML = product.images.map((img, index) => `
            <img src="../images/${img}" alt="${product.name} ${index + 1}" 
                 class="${index === 0 ? 'active' : ''}"
                 onclick="changeMainImage('../images/${img}', this)">
        `).join('');
    }
    
    // Product info
    const info = document.getElementById('productInfo');
    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    const isFavorite = Favorites.isFavorite(product.id);
    
    info.innerHTML = `
        <div class="info-header">
            <span class="info-category">${product.category}</span>
            <h1 class="info-title">${product.name}</h1>
            <div class="info-rating">
                <span class="stars">${renderStars(product.rating)}</span>
                <span class="rating-value">${product.rating}</span>
                <span class="reviews-count">(${product.reviews} sharh)</span>
            </div>
        </div>
        
        <div class="info-price">
            <span class="current">${formatCurrency(product.price)}</span>
            ${hasDiscount ? `<span class="old">${formatCurrency(product.oldPrice)}</span>` : ''}
            ${hasDiscount ? `<span class="discount">-${discountPercent}%</span>` : ''}
        </div>
        
        <div class="info-description">
            <p>${product.description}</p>
        </div>
        
        <div class="info-specs">
            ${Object.entries(product.specs).map(([key, value]) => `
                <div class="spec-item">
                    <span class="spec-label">${key}</span>
                    <span class="spec-value">${value}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="info-actions">
            <div class="qty-selector">
                <button onclick="changeQuantity(-1)"><i class="fas fa-minus"></i></button>
                <span id="productQty">1</span>
                <button onclick="changeQuantity(1)"><i class="fas fa-plus"></i></button>
            </div>
            <button class="btn btn-primary" onclick="addProductToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i> Savatga qo'shish
            </button>
            <button class="btn ${isFavorite ? 'btn-danger' : 'btn-outline'}" onclick="toggleProductFavorite(${product.id})">
                <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i> ${isFavorite ? 'Sevimlilarda' : 'Sevimlilarga'}
            </button>
        </div>
    `;
    
    // Tabs content
    renderTabs(product);
}

// ===== RENDER TABS =====
function renderTabs(product) {
    // Description
    document.getElementById('tabDescription').innerHTML = `
        <h3>Tavsif</h3>
        <p>${product.description}</p>
        <p style="margin-top: var(--spacing-md);">Bu mahsulot ${product.category} kategoriyasiga kiradi. 
        ${product.brand} brendi tomonidan ishlab chiqarilgan. ${product.isNew ? 'Yangi mahsulot!' : ''}</p>
    `;
    
    // Features
    document.getElementById('tabSpecs').innerHTML = `
        <h3>Xususiyatlar</h3>
        <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm);">
            ${product.features.map(f => `
                <li style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-xs) 0; color: var(--gray-600);">
                    <i class="fas fa-check-circle" style="color: var(--success);"></i> ${f}
                </li>
            `).join('')}
        </ul>
    `;
    
    // Reviews
    document.getElementById('tabReviews').innerHTML = `
        <h3>Sharhlar (${product.reviews})</h3>
        ${generateSampleReviews(product)}
        <div style="margin-top: var(--spacing-xl);">
            <h4>Sharh qoldirish</h4>
            <form id="reviewForm">
                <div class="form-group" style="margin-bottom: var(--spacing-md);">
                    <label style="display: block; font-weight: 500; font-size: var(--font-sm); color: var(--gray-700); margin-bottom: var(--spacing-xs);">Reyting</label>
                    <div class="star-rating" style="display: flex; gap: var(--spacing-xs); font-size: var(--font-2xl); color: var(--gray-300);">
                        <i class="far fa-star" onclick="setProductRating(1)"></i>
                        <i class="far fa-star" onclick="setProductRating(2)"></i>
                        <i class="far fa-star" onclick="setProductRating(3)"></i>
                        <i class="far fa-star" onclick="setProductRating(4)"></i>
                        <i class="far fa-star" onclick="setProductRating(5)"></i>
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: var(--spacing-md);">
                    <label style="display: block; font-weight: 500; font-size: var(--font-sm); color: var(--gray-700); margin-bottom: var(--spacing-xs);">Ismingiz *</label>
                    <input type="text" id="reviewName" placeholder="Ismingiz" style="width: 100%; padding: var(--spacing-md); border: 2px solid var(--gray-200); border-radius: var(--radius-md); font-family: 'Inter', sans-serif; font-size: var(--font-md);">
                </div>
                <div class="form-group" style="margin-bottom: var(--spacing-md);">
                    <label style="display: block; font-weight: 500; font-size: var(--font-sm); color: var(--gray-700); margin-bottom: var(--spacing-xs);">Sharh *</label>
                    <textarea id="reviewText" rows="4" placeholder="Sharhingizni yozing..." style="width: 100%; padding: var(--spacing-md); border: 2px solid var(--gray-200); border-radius: var(--radius-md); font-family: 'Inter', sans-serif; font-size: var(--font-md); resize: vertical;"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Sharh qoldirish</button>
            </form>
        </div>
    `;
    
    // Review form
    document.getElementById('reviewForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('reviewName').value;
        const text = document.getElementById('reviewText').value;
        if (!name || !text) {
            showNotification('Iltimos, barcha maydonlarni to\'ldiring', 'warning');
            return;
        }
        showNotification('Sharhingiz qabul qilindi! Rahmat!', 'success');
        this.reset();
        document.querySelectorAll('.star-rating i').forEach(s => s.className = 'far fa-star');
    });
}

// ===== GENERATE REVIEWS =====
function generateSampleReviews(product) {
    const reviews = [
        { author: 'Alisher', date: '2026-01-15', rating: 5, text: 'Ajoyib mahsulot! Tavsiya qilaman.' },
        { author: 'Dilshod', date: '2026-01-12', rating: 4, text: 'Sifatli mahsulot, narxiga arziydi.' },
        { author: 'Gulnora', date: '2026-01-08', rating: 5, text: 'Juda zo\'r! Tez yetkazib berishdi.' }
    ];
    
    return reviews.map(r => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${r.author}</span>
                <span class="review-date">${formatDate(r.date)}</span>
            </div>
            <div class="review-rating">${renderStars(r.rating)}</div>
            <p class="review-text">${r.text}</p>
        </div>
    `).join('');
}

// ===== RENDER STARS =====
function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '<i class="fas fa-star"></i>'.repeat(full) + (half ? '<i class="fas fa-star-half-alt"></i>' : '') + '<i class="far fa-star"></i>'.repeat(empty);
}

// ===== RELATED PRODUCTS =====
function renderRelatedProducts(product) {
    const container = document.getElementById('relatedProducts');
    const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
    
    if (related.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--gray-500);">Boshqa mahsulotlar mavjud emas</p>';
        return;
    }
    
    container.innerHTML = related.map(p => createProductCard(p)).join('');
}

function createProductCard(product) {
    const hasDiscount = product.oldPrice && product.oldPrice > product.price;
    const discount = hasDiscount ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    const isFavorite = Favorites.isFavorite(product.id);
    
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="../images/${product.image || 'shop/default.jpg'}" alt="${product.name}" loading="lazy">
                ${product.isNew ? '<span class="product-badge new">Yangi</span>' : ''}
                ${hasDiscount ? `<span class="product-badge sale">-${discount}%</span>` : ''}
                <div class="product-actions">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleProductFavorite(${product.id})">
                        <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i>
                    </button>
                    <button onclick="addProductToCart(${product.id})"><i class="fas fa-shopping-cart"></i></button>
                    <button onclick="window.location.href='shop-detail.html?id=${product.id}'"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h4 class="product-name"><a href="shop-detail.html?id=${product.id}">${product.name}</a></h4>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current">${formatCurrency(product.price)}</span>
                    ${hasDiscount ? `<span class="old">${formatCurrency(product.oldPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// ===== CHANGE MAIN IMAGE =====
function changeMainImage(src, element) {
    document.getElementById('mainImage').src = src;
    document.getElementById('mainImageLink').href = src;
    document.querySelectorAll('.thumbnails img').forEach(img => img.classList.remove('active'));
    if (element) element.classList.add('active');
}

// ===== QUANTITY =====
let currentQty = 1;

function initQuantity() {
    currentQty = 1;
    document.getElementById('productQty').textContent = currentQty;
}

function changeQuantity(amount) {
    currentQty += amount;
    if (currentQty < 1) currentQty = 1;
    document.getElementById('productQty').textContent = currentQty;
}

// ===== CART ACTIONS =====
function addProductToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        Cart.addItem(productId, currentQty);
        // Store product info for cart display
        const cartItem = {
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image
        };
        Storage.set(`product_${productId}`, cartItem);
        showNotification(`${product.name} savatga qo'shildi! (${currentQty} ta)`, 'success');
    }
}

// ===== FAVORITES =====
function toggleProductFavorite(productId) {
    const isFavorite = Favorites.toggle(productId);
    const btn = document.querySelector('.info-actions .btn-outline, .info-actions .btn-danger');
    if (btn) {
        btn.className = `btn ${isFavorite ? 'btn-danger' : 'btn-outline'}`;
        btn.innerHTML = `<i class="fas fa-heart"></i> ${isFavorite ? 'Sevimlilarda' : 'Sevimlilarga'}`;
    }
    showNotification(isFavorite ? 'Sevimlilarga qo\'shildi ❤️' : 'Sevimlilardan olib tashlandi', isFavorite ? 'success' : 'info');
}

// ===== TABS =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            contents.forEach(c => c.classList.toggle('active', c.dataset.content === target));
        });
    });
}

// ===== PRODUCT RATING =====
let productSelectedRating = 0;

function setProductRating(rating) {
    productSelectedRating = rating;
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        star.className = index < rating ? 'fas fa-star' : 'far fa-star';
        star.style.color = index < rating ? '#ffc107' : '';
    });
}

// ===== EXPOSE =====
window.changeMainImage = changeMainImage;
window.changeQuantity = changeQuantity;
window.addProductToCart = addProductToCart;
window.toggleProductFavorite = toggleProductFavorite;
window.setProductRating = setProductRating;

console.log('✅ Shop Detail Module loaded');