/* ========================================
   CAR-ENTERPRISE - HOME MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Check if on home page
    if (!document.querySelector('.hero')) return;
    
    initHome();
});

// ===== INIT HOME =====
function initHome() {
    loadFeaturedCars();
    loadBlogPosts();
    loadTestimonials();
    initCountdown();
    initCounterAnimation();
}

// ===== LOAD FEATURED CARS =====
function loadFeaturedCars() {
    const container = document.getElementById('featuredCars');
    if (!container) return;
    
    // In production: API.cars.getFeatured()
    const cars = getFeaturedCars();
    
    if (cars.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 0;">
                <p style="color: var(--gray-500);">Hozircha mashinalar mavjud emas</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cars.map(car => createCarCard(car)).join('');
}

// ===== GET FEATURED CARS =====
function getFeaturedCars() {
    // Mock data - in production from API
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
        }
    ];
}

// ===== CREATE CAR CARD =====
function createCarCard(car) {
    const hasDiscount = car.oldPrice && car.oldPrice > car.price;
    const discount = hasDiscount ? Math.round(((car.oldPrice - car.price) / car.oldPrice) * 100) : 0;
    const isFavorite = Favorites.isFavorite(car.id);
    const imgPath = car.images && car.images.length > 0 ? `images/${car.images[0]}` : 'images/cars/default.jpg';
    
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
                    <button onclick="window.location.href='pages/car-detail.html?id=${car.id}'"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="car-info">
                <h4 class="car-name">
                    <a href="pages/car-detail.html?id=${car.id}">${car.brand} ${car.model}</a>
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

// ===== LOAD BLOG POSTS =====
function loadBlogPosts() {
    const container = document.getElementById('blogPosts');
    if (!container) return;
    
    // In production: API.blog.getRecent()
    const posts = getRecentBlogPosts();
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 0;">
                <p style="color: var(--gray-500);">Hozircha blog maqolalari mavjud emas</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = posts.map(post => createBlogCard(post)).join('');
}

// ===== GET RECENT BLOG POSTS =====
function getRecentBlogPosts() {
    return [
        {
            id: 1,
            title: "2026 yilning eng yaxshi avtomobillari",
            excerpt: "Yangi yilda bozorda qanday avtomobillar eng yaxshi deb topildi? Biz 2026 yilning eng yaxshi avtomobillarini tanladik...",
            category: "Yangiliklar",
            image: "blog/car-2026.jpg",
            author: "Alisher Karimov",
            date: "2026-01-15",
            comments: 24
        },
        {
            id: 2,
            title: "Avtomobil sotib olishda 5 ta muhim maslahat",
            excerpt: "Avtomobil sotib olishdan oldin bilishingiz kerak bo'lgan 5 ta muhim maslahat...",
            category: "Maslahatlar",
            image: "blog/car-buying-tips.jpg",
            author: "Dilnoza Abdullaeva",
            date: "2026-01-10",
            comments: 18
        },
        {
            id: 3,
            title: "Elektromobillar kelajagi - 2026 tendensiyalari",
            excerpt: "Elektromobillar bozori qanday rivojlanmoqda? 2026 yilda elektromobillarning yangi tendensiyalari...",
            category: "Texnologiya",
            image: "blog/electric-cars.jpg",
            author: "Javlon Abdullayev",
            date: "2026-01-08",
            comments: 32
        }
    ];
}

// ===== CREATE BLOG CARD =====
function createBlogCard(post) {
    return `
        <div class="blog-card">
            <div class="blog-image">
                <img src="images/${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    <span><i class="fas fa-comments"></i> ${post.comments}</span>
                </div>
                <h3 class="blog-title">
                    <a href="pages/blog-detail.html?id=${post.id}">${post.title}</a>
                </h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <a href="pages/blog-detail.html?id=${post.id}" class="blog-read-more">
                    Ko'proq o'qish <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `;
}

// ===== LOAD TESTIMONIALS =====
function loadTestimonials() {
    const container = document.querySelector('.testimonials-slider .swiper-wrapper');
    if (!container) return;
    
    // In production: API.testimonials.getAll()
    const testimonials = getTestimonials();
    
    if (testimonials.length === 0) {
        container.innerHTML = `
            <div class="swiper-slide">
                <p style="text-align:center;color:var(--gray-500);padding:40px 0;">Hozircha fikrlar mavjud emas</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = testimonials.map(testimonial => `
        <div class="swiper-slide">
            <div class="testimonial-card">
                <div class="testimonial-author">
                    <img src="images/users/default-avatar.jpg" alt="${testimonial.name}">
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <span>${testimonial.position}</span>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${renderStars(testimonial.rating)}
                </div>
                <p class="testimonial-text">${testimonial.text}</p>
            </div>
        </div>
    `).join('');
}

// ===== GET TESTIMONIALS =====
function getTestimonials() {
    return [
        {
            id: 1,
            name: "Alisher Karimov",
            position: "Biznesmen",
            rating: 5,
            text: "Car Enterprise dan BMW X5 sotib oldim. Juda mamnunman! Mashina ajoyib holatda, xizmat esa yuqori darajada."
        },
        {
            id: 2,
            name: "Dilnoza Abdullaeva",
            position: "Marketing mutaxassisi",
            rating: 5,
            text: "Mercedes S-Class ni Car Enterprise dan sotib olganimdan juda xursandman. Ular bilan ishlash juda oson va qulay."
        },
        {
            id: 3,
            name: "Javlon Abdullayev",
            position: "Muhandis",
            rating: 4,
            text: "Toyota Camry ni Car Enterprise dan sotib oldim. Yaxshi narx va sifat. Xizmat a'lo darajada."
        }
    ];
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

// ===== INIT COUNTDOWN =====
function initCountdown() {
    const countdownElements = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds')
    };
    
    // Check if all elements exist
    if (!countdownElements.days) return;
    
    // Set target date (7 days from now)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 7);
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            // Reset for another 7 days
            targetDate.setDate(targetDate.getDate() + 7);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElements.days.textContent = String(days).padStart(2, '0');
        countdownElements.hours.textContent = String(hours).padStart(2, '0');
        countdownElements.minutes.textContent = String(minutes).padStart(2, '0');
        countdownElements.seconds.textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===== INIT COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;
    
    let animated = false;
    
    function animateCounters() {
        if (animated) return;
        
        counters.forEach(function(counter) {
            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = Math.max(1, Math.floor(target / 60));
            let current = 0;
            
            const interval = setInterval(function() {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(interval);
                }
                counter.textContent = current + (target > 100 ? '+' : '');
            }, duration / 60);
        });
        
        animated = true;
    }
    
    // Check if counters are visible
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

// ===== TOGGLE FAVORITE =====
function toggleFavorite(carId) {
    const isFavorite = Favorites.toggle(carId);
    const btn = document.querySelector(`.car-card[data-id="${carId}"] .favorite-btn`);
    if (btn) {
        btn.classList.toggle('active');
        btn.querySelector('i').className = `fas ${isFavorite ? 'fa-heart' : 'fa-heart'}`;
    }
    showNotification(
        isFavorite ? 'Sevimlilarga qo\'shildi ❤️' : 'Sevimlilardan olib tashlandi',
        isFavorite ? 'success' : 'info'
    );
}

// ===== ADD TO CART =====
function addToCart(carId) {
    // In production: get car from API
    const cars = getFeaturedCars();
    const car = cars.find(c => c.id === carId);
    if (car) {
        Cart.addItem(carId, 1);
        showNotification(`${car.brand} ${car.model} savatga qo'shildi!`, 'success');
    }
}

// ===== EXPOSE GLOBALLY =====
window.toggleFavorite = toggleFavorite;
window.addToCart = addToCart;

console.log('✅ Home Module loaded successfully');