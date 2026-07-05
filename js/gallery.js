document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.gallery-section')) return;
    
    initGallery();
});

// ===== GALLERY DATA =====
const galleryData = [
    { id: 1, title: "BMW X5", category: "suv", image: "gallery/bmw-x5.jpg" },
    { id: 2, title: "Mercedes S-Class", category: "luxury", image: "gallery/mercedes-s-class.jpg" },
    { id: 3, title: "Porsche 911", category: "sport", image: "gallery/porsche-911.jpg" },
    { id: 4, title: "Toyota Camry", category: "sedan", image: "gallery/toyota-camry.jpg" },
    { id: 5, title: "Tesla Model S", category: "electric", image: "gallery/tesla-model-s.jpg" },
    { id: 6, title: "Audi Q7", category: "suv", image: "gallery/audi-q7.jpg" },
    { id: 7, title: "Lexus RX", category: "luxury", image: "gallery/lexus-rx.jpg" },
    { id: 8, title: "Ferrari F8", category: "sport", image: "gallery/ferrari-f8.jpg" },
    { id: 9, title: "Honda Accord", category: "sedan", image: "gallery/honda-accord.jpg" },
    { id: 10, title: "Hyundai Ioniq", category: "electric", image: "gallery/hyundai-ioniq.jpg" },
    { id: 11, title: "Porsche Cayenne", category: "suv", image: "gallery/porsche-cayenne.jpg" },
    { id: 12, title: "Bentley Continental", category: "luxury", image: "gallery/bentley-continental.jpg" },
    { id: 13, title: "Lamborghini Urus", category: "sport", image: "gallery/lamborghini-urus.jpg" },
    { id: 14, title: "KIA Sportage", category: "suv", image: "gallery/kia-sportage.jpg" },
    { id: 15, title: "BMW 7 Series", category: "luxury", image: "gallery/bmw-7-series.jpg" },
    { id: 16, title: "Audi e-tron", category: "electric", image: "gallery/audi-e-tron.jpg" }
];

let currentFilter = 'all';

// ===== INIT GALLERY =====
function initGallery() {
    renderGallery(galleryData);
    initGalleryFilters();
}

// ===== RENDER GALLERY =====
function renderGallery(items) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    let filteredItems = items;
    if (currentFilter !== 'all') {
        filteredItems = items.filter(item => item.category === currentFilter);
    }
    
    if (filteredItems.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-images" style="font-size: 60px; color: #dee2e6; margin-bottom: 20px;"></i>
                <h3>Hech qanday rasm topilmadi</h3>
                <p>Iltimos, boshqa kategoriyani tanlang</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filteredItems.map(item => `
        <div class="gallery-item" data-category="${item.category}" data-aos="fade-up">
            <a href="../images/${item.image}" data-lightbox="gallery" data-title="${item.title}">
                <img src="../images/${item.image}" alt="${item.title}" loading="lazy">
                <span class="gallery-badge">${item.category}</span>
                <div class="gallery-overlay">
                    <i class="fas fa-search-plus"></i>
                    <h4>${item.title}</h4>
                    <span>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</span>
                </div>
            </a>
        </div>
    `).join('');
}

// ===== GALLERY FILTERS =====
function initGalleryFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            currentFilter = this.dataset.filter;
            renderGallery(galleryData);
        });
    });
}

console.log('✅ Gallery Module loaded');
