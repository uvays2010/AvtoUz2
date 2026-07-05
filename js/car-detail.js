document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.car-detail-section')) return;
    
    initCarDetail();
});

// ===== CAR DATA =====
let currentCar = null;
let allCars = [];

function initCarDetail() {
    const params = getUrlParams();
    const carId = params.id;
    
    if (!carId) {
        window.location.href = 'cars.html';
        return;
    }
    
    loadCarDetail(carId);
    initTabs();
}

function loadCarDetail(carId) {
    // Demo data - in production use API
    const cars = getCarsData();
    const car = cars.find(c => c.id === parseInt(carId));
    
    if (!car) {
        showNotification('Mashina topilmadi', 'error');
        setTimeout(() => window.location.href = 'cars.html', 2000);
        return;
    }
    
    currentCar = car;
    allCars = cars;
    renderCarDetail(car);
    renderRelatedCars(car);
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
            description: 'BMW X5 - bu hashamatli va kuchli SUV. Zamonaviy dizayn, yuqori sifatli interyer va kuchli dvigatel.',
            features: ['Parktronik', 'Kamera', 'Sunroof', 'Iqlim nazorati', 'Ksenon', 'Sensorlar'],
            images: ['cars/bmw-x5-1.jpg', 'cars/bmw-x5-2.jpg', 'cars/bmw-x5-3.jpg'],
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
            description: 'Mercedes-Benz S-Class - bu eng hashamatli sedan. Har bir detali mukammal ishlangan.',
            features: ['MBUX', 'Massajli o\'rindiqlar', 'Burmester audio', 'Panorama', 'Autopilot'],
            images: ['cars/mercedes-s-class-1.jpg', 'cars/mercedes-s-class-2.jpg'],
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
            description: 'Toyota Camry - ishonchli va qulay sedan. Yaxshi iqtisod va yuqori sifat.',
            features: ['Toyota Safety Sense', 'Karplay', 'Kamera', 'Iqlim nazorati'],
            images: ['cars/toyota-camry-1.jpg', 'cars/toyota-camry-2.jpg'],
            rating: 4.7,
            reviews: 234,
            isFeatured: true,
            isNew: false
        }
    ];
}

function renderCarDetail(car) {
    // Update page title
    document.title = `${car.brand} ${car.model} | Car Enterprise`;
    
    // Update breadcrumb
    document.getElementById('breadcrumbCar').textContent = `${car.brand} ${car.model}`;
    document.getElementById('carTitle').innerHTML = `${car.brand} <span>${car.model}</span>`;
    document.getElementById('carSubtitle').textContent = `${car.year} • ${car.category}`;
    
    // Gallery
    const mainImage = document.getElementById('mainImage');
    const mainImageLink = document.getElementById('mainImageLink');
    const thumbnails = document.getElementById('thumbnails');
    
    if (car.images && car.images.length > 0) {
        const imgPath = `../images/${car.images[0]}`;
        mainImage.src = imgPath;
        mainImage.alt = `${car.brand} ${car.model}`;
        mainImageLink.href = imgPath;
        
        thumbnails.innerHTML = car.images.map((img, index) => `
            <img src="../images/${img}" alt="${car.brand} ${car.model} ${index + 1}" 
                 class="${index === 0 ? 'active' : ''}"
                 onclick="changeMainImage('../images/${img}', this)">
        `).join('');
    }
    
    // Car info
    const info = document.getElementById('carInfo');
    const hasDiscount = car.oldPrice && car.oldPrice > car.price;
    const discountPercent = hasDiscount ? Math.round(((car.oldPrice - car.price) / car.oldPrice) * 100) : 0;
    const isFavorite = Favorites.isFavorite(car.id);
    
    info.innerHTML = `
        <div class="info-header">
            <div class="info-title">
                <h1>${car.brand} ${car.model}</h1>
                <div class="info-rating">
                    <span class="stars">${renderStars(car.rating)}</span>
                    <span class="rating-value">${car.rating}</span>
                    <span class="reviews-count">(${car.reviews} sharh)</span>
                </div>
            </div>
            <div class="info-price">
                ${hasDiscount ? `<span class="old-price">${formatCurrency(car.oldPrice)}</span>` : ''}
                <span class="price">${formatCurrency(car.price)}</span>
                ${hasDiscount ? `<span class="discount">-${discountPercent}%</span>` : ''}
            </div>
        </div>
        
        <div class="info-badges">
            ${car.isNew ? '<span class="badge badge-new">Yangi</span>' : ''}
            <span class="badge ${car.condition === 'Yangi' ? 'badge-condition' : 'badge-used'}">${car.condition}</span>
            ${hasDiscount ? '<span class="badge badge-sale">Chegirma</span>' : ''}
        </div>
        
        <div class="info-description">
            <p>${car.description}</p>
        </div>
        
        <div class="info-specs">
            <div class="spec-item"><span class="spec-label"><i class="fas fa-calendar"></i> Yil</span><span class="spec-value">${car.year}</span></div>
            <div class="spec-item"><span class="spec-label"><i class="fas fa-tachometer-alt"></i> Yurgan masofa</span><span class="spec-value">${car.mileage.toLocaleString()} km</span></div>
            <div class="spec-item"><span class="spec-label"><i class="fas fa-gas-pump"></i> Yoqilg'i</span><span class="spec-value">${car.fuelType}</span></div>
            <div class="spec-item"><span class="spec-label"><i class="fas fa-cog"></i> Transmissiya</span><span class="spec-value">${car.transmission}</span></div>
            <div class="spec-item"><span class="spec-label"><i class="fas fa-car"></i> Dvigatel</span><span class="spec-value">${car.engine}</span></div>
            <div class="spec-item"><span class="spec-label"><i class="fas fa-horse"></i> Quvvat</span><span class="spec-value">${car.power} ot kuchi</span></div>
            <div class="spec-item"><span class="spec-label"><i class="fas fa-paint-bucket"></i> Rang</span><span class="spec-value">${car.color}</span></div>
            <div class="spec-item"><span class="spec-label"><i class="fas fa-tag"></i> Kategoriya</span><span class="spec-value">${car.category}</span></div>
        </div>
        
        <div class="info-features">
            <h3>Xususiyatlar</h3>
            <ul>
                ${car.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
            </ul>
        </div>
        
        <div class="info-actions">
            <button class="btn btn-primary" onclick="addToCart(${car.id})">
                <i class="fas fa-shopping-cart"></i> Savatga qo'shish
            </button>
            <button class="btn ${isFavorite ? 'btn-danger' : 'btn-outline'}" onclick="toggleFavorite(${car.id})">
                <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i> ${isFavorite ? 'Sevimlilarda' : 'Sevimlilarga'}
            </button>
            <button class="btn btn-outline" onclick="scheduleTestDrive(${car.id})">
                <i class="fas fa-calendar-check"></i> Test Drive
            </button>
        </div>
    `;
    
    // Tabs content
    renderTabs(car);
}

function renderTabs(car) {
    // Description
    document.getElementById('tabDescription').innerHTML = `
        <h3>Tavsif</h3>
        <p>${car.description}</p>
        <p style="margin-top: var(--spacing-md);">${car.brand} ${car.model} - bu ${car.category} klassi vakili. 
        ${car.year} yil ishlab chiqarilgan. ${car.condition} holatda. 
        ${car.fuelType} dvigateli bilan jihozlangan.</p>
    `;
    
    // Specs
    document.getElementById('tabSpecs').innerHTML = `
        <h3>Texnik xususiyatlar</h3>
        <div class="specs-grid">
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-car"></i></div>
                <span class="spec-label">Brend</span>
                <span class="spec-value">${car.brand}</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-cog"></i></div>
                <span class="spec-label">Model</span>
                <span class="spec-value">${car.model}</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-calendar"></i></div>
                <span class="spec-label">Yil</span>
                <span class="spec-value">${car.year}</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-tachometer-alt"></i></div>
                <span class="spec-label">Yurgan masofa</span>
                <span class="spec-value">${car.mileage.toLocaleString()} km</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-gas-pump"></i></div>
                <span class="spec-label">Yoqilg'i</span>
                <span class="spec-value">${car.fuelType}</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-cog"></i></div>
                <span class="spec-label">Transmissiya</span>
                <span class="spec-value">${car.transmission}</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-horse"></i></div>
                <span class="spec-label">Quvvat</span>
                <span class="spec-value">${car.power} ot kuchi</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-paint-bucket"></i></div>
                <span class="spec-label">Rang</span>
                <span class="spec-value">${car.color}</span>
            </div>
            <div class="spec-card">
                <div class="spec-icon"><i class="fas fa-tag"></i></div>
                <span class="spec-label">Kategoriya</span>
                <span class="spec-value">${car.category}</span>
            </div>
        </div>
    `;
    
    // Features
    document.getElementById('tabFeatures').innerHTML = `
        <h3>Xususiyatlar</h3>
        <ul style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm);">
            ${car.features.map(f => `<li style="display: flex; align-items: center; gap: var(--spacing-sm); padding: var(--spacing-xs) 0; color: var(--gray-600);"><i class="fas fa-check-circle" style="color: var(--success);"></i> ${f}</li>`).join('')}
        </ul>
    `;
    
    // Reviews
    document.getElementById('tabReviews').innerHTML = `
        <h3>Sharhlar (${car.reviews})</h3>
        ${generateSampleReviews(car)}
        <div style="margin-top: var(--spacing-xl);">
            <h4>Sharh qoldirish</h4>
            <form id="reviewForm">
                <div class="form-group" style="margin-bottom: var(--spacing-md);">
                    <label style="display: block; font-weight: 500; font-size: var(--font-sm); color: var(--gray-700); margin-bottom: var(--spacing-xs);">Reyting</label>
                    <div class="star-rating" style="display: flex; gap: var(--spacing-xs); font-size: var(--font-2xl); color: var(--gray-300);">
                        <i class="far fa-star" onclick="setRating(1)"></i>
                        <i class="far fa-star" onclick="setRating(2)"></i>
                        <i class="far fa-star" onclick="setRating(3)"></i>
                        <i class="far fa-star" onclick="setRating(4)"></i>
                        <i class="far fa-star" onclick="setRating(5)"></i>
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

function generateSampleReviews(car) {
    const reviews = [
        { author: 'Alisher', date: '2026-01-15', rating: 5, text: 'Ajoyib mashina! Tavsiya qilaman.' },
        { author: 'Dilshod', date: '2026-01-12', rating: 4, text: 'Yaxshi mashina, narxi biroz qimmat.' },
        { author: 'Gulnora', date: '2026-01-08', rating: 5, text: 'Orzudagi mashinamni topdim! Rahmat Car Enterprise!' }
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

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return '<i class="fas fa-star"></i>'.repeat(full) + (half ? '<i class="fas fa-star-half-alt"></i>' : '') + '<i class="far fa-star"></i>'.repeat(empty);
}

function renderRelatedCars(car) {
    const container = document.getElementById('relatedCars');
    const related = allCars.filter(c => c.id !== car.id && (c.category === car.category || c.brand === car.brand)).slice(0, 4);
    
    if (related.length === 0) {
        container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--gray-500);">Boshqa mashinalar mavjud emas</p>';
        return;
    }
    
    container.innerHTML = related.map(c => createCarCard(c)).join('');
}

function createCarCard(car) {
    const hasDiscount = car.oldPrice && car.oldPrice > car.price;
    const discount = hasDiscount ? Math.round(((car.oldPrice - car.price) / car.oldPrice) * 100) : 0;
    const isFavorite = Favorites.isFavorite(car.id);
    
    return `
        <div class="car-card">
            <div class="car-image">
                <img src="../images/${car.images?.[0] || 'cars/default.jpg'}" alt="${car.brand} ${car.model}" loading="lazy">
                ${car.isNew ? '<span class="car-badge">Yangi</span>' : ''}
                ${hasDiscount ? `<span class="car-badge" style="background:var(--success);">-${discount}%</span>` : ''}
                <div class="car-actions">
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="toggleFavorite(${car.id})">
                        <i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i>
                    </button>
                    <button onclick="addToCart(${car.id})"><i class="fas fa-shopping-cart"></i></button>
                </div>
            </div>
            <div class="car-info">
                <h4 class="car-name"><a href="car-detail.html?id=${car.id}">${car.brand} ${car.model}</a></h4>
                <div class="car-specs">
                    <span><i class="fas fa-calendar"></i> ${car.year}</span>
                    <span><i class="fas fa-gas-pump"></i> ${car.fuelType}</span>
                </div>
                <div class="car-price">
                    <span class="price">${formatCurrency(car.price)}</span>
                    ${hasDiscount ? `<span class="old-price">${formatCurrency(car.oldPrice)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function changeMainImage(src, element) {
    document.getElementById('mainImage').src = src;
    document.getElementById('mainImageLink').href = src;
    document.querySelectorAll('.thumbnails img').forEach(img => img.classList.remove('active'));
    if (element) element.classList.add('active');
}

function toggleFavorite(carId) {
    const isFavorite = Favorites.toggle(carId);
    const btn = document.querySelector('.info-actions .btn-outline, .info-actions .btn-danger');
    if (btn) {
        btn.className = `btn ${isFavorite ? 'btn-danger' : 'btn-outline'}`;
        btn.innerHTML = `<i class="fas fa-heart"></i> ${isFavorite ? 'Sevimlilarda' : 'Sevimlilarga'}`;
    }
    showNotification(isFavorite ? 'Sevimlilarga qo\'shildi ❤️' : 'Sevimlilardan olib tashlandi', isFavorite ? 'success' : 'info');
}

function addToCart(carId) {
    const car = allCars.find(c => c.id === carId);
    if (car) {
        Cart.addItem(carId, 1);
        showNotification(`${car.brand} ${car.model} savatga qo'shildi!`, 'success');
    }
}

function scheduleTestDrive(carId) {
    const car = allCars.find(c => c.id === carId);
    if (car) {
        showNotification(`Test Drive uchun ${car.brand} ${car.model} band qilindi!`, 'success');
    }
}

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

// Star rating
let selectedRating = 0;

function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        star.className = index < rating ? 'fas fa-star' : 'far fa-star';
        star.style.color = index < rating ? '#ffc107' : '';
    });
}

window.changeMainImage = changeMainImage;
window.toggleFavorite = toggleFavorite;
window.addToCart = addToCart;
window.scheduleTestDrive = scheduleTestDrive;
window.setRating = setRating;

console.log('✅ Car Detail Module loaded');