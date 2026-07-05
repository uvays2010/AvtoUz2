/* ========================================
   CAR-ENTERPRISE - BLOG MODULE
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    if (!document.querySelector('.blog-section')) return;
    
    initBlog();
});

// ===== BLOG DATA =====
let blogPosts = [];
let currentPage = 1;
const postsPerPage = 6;
let currentCategory = 'all';
let searchQuery = '';

// ===== INIT BLOG =====
function initBlog() {
    loadBlogPosts();
    initBlogFilters();
    initBlogSearch();
    initNewsletter();
}

// ===== LOAD BLOG POSTS =====
function loadBlogPosts() {
    blogPosts = getBlogData();
    renderBlogPosts();
    renderCategories();
    renderRecentPosts();
    renderTags();
}

function getBlogData() {
    return [
        {
            id: 1,
            title: "2026 yilning eng yaxshi avtomobillari",
            excerpt: "Yangi yilda bozorda qanday avtomobillar eng yaxshi deb topildi?",
            content: "To'liq maqola matni...",
            category: "Yangiliklar",
            tags: ["avtomobillar", "2026", "yangiliklar"],
            image: "../images/blog/car-2026.jpg",
            author: "Alisher Karimov",
            date: "2026-01-15",
            comments: 24,
            views: 1250
        },
        {
            id: 2,
            title: "Avtomobil sotib olishda 5 ta muhim maslahat",
            excerpt: "Avtomobil sotib olishdan oldin bilishingiz kerak bo'lgan 5 ta muhim maslahat.",
            content: "To'liq maqola matni...",
            category: "Maslahatlar",
            tags: ["maslahatlar", "sotib olish", "qo'llanma"],
            image: "../images/blog/car-buying-tips.jpg",
            author: "Dilnoza Abdullaeva",
            date: "2026-01-10",
            comments: 18,
            views: 890
        },
        {
            id: 3,
            title: "Elektromobillar kelajagi - 2026 tendensiyalari",
            excerpt: "Elektromobillar bozori qanday rivojlanmoqda?",
            content: "To'liq maqola matni...",
            category: "Texnologiya",
            tags: ["elektromobil", "texnologiya", "kelajak"],
            image: "../images/blog/electric-cars.jpg",
            author: "Javlon Abdullayev",
            date: "2026-01-08",
            comments: 32,
            views: 2100
        },
        {
            id: 4,
            title: "Qishda avtomobilni qanday parvarish qilish kerak",
            excerpt: "Qish faslida avtomobilingizni to'g'ri parvarish qilish...",
            content: "To'liq maqola matni...",
            category: "Parvarish",
            tags: ["qish", "parvarish", "servis"],
            image: "../images/blog/winter-car-care.jpg",
            author: "Madina Tursunova",
            date: "2026-01-05",
            comments: 15,
            views: 750
        },
        {
            id: 5,
            title: "Eng arzon avtomobillar 2026",
            excerpt: "2026 yilda eng arzon va sifatli avtomobillar qaysilar?",
            content: "To'liq maqola matni...",
            category: "Narxlar",
            tags: ["arzon", "budjet", "2026"],
            image: "../images/blog/cheap-cars.jpg",
            author: "Alisher Karimov",
            date: "2026-01-03",
            comments: 21,
            views: 1500
        },
        {
            id: 6,
            title: "Avtomobil sug'urtasi - bilishingiz kerak bo'lgan hamma narsa",
            excerpt: "Avtomobil sug'urtasi haqida to'liq ma'lumot.",
            content: "To'liq maqola matni...",
            category: "Maslahatlar",
            tags: ["sug'urta", "maslahat", "qo'llanma"],
            image: "../images/blog/car-insurance.jpg",
            author: "Dilnoza Abdullaeva",
            date: "2026-01-01",
            comments: 28,
            views: 1100
        },
        {
            id: 7,
            title: "BMW X5 - 2026 yilning eng yaxshi SUV'i",
            excerpt: "BMW X5 haqida to'liq sharh.",
            content: "To'liq maqola matni...",
            category: "Sharhlar",
            tags: ["bmw", "x5", "suv"],
            image: "../images/blog/bmw-x5-review.jpg",
            author: "Javlon Abdullayev",
            date: "2025-12-28",
            comments: 45,
            views: 2500
        },
        {
            id: 8,
            title: "Yangi avtomobilni sotishdan oldin tekshirish ro'yxati",
            excerpt: "Yangi avtomobil sotib olayotganda nimaga e'tibor berish kerak?",
            content: "To'liq maqola matni...",
            category: "Maslahatlar",
            tags: ["tekshirish", "yangi", "qo'llanma"],
            image: "../images/blog/new-car-check.jpg",
            author: "Alisher Karimov",
            date: "2025-12-25",
            comments: 12,
            views: 680
        },
        {
            id: 9,
            title: "Avtomobil bozori 2026 - prognozlar va tendensiyalar",
            excerpt: "2026 yilda avtomobil bozori qanday bo'lishi haqida prognozlar.",
            content: "To'liq maqola matni...",
            category: "Yangiliklar",
            tags: ["bozor", "prognoz", "2026"],
            image: "../images/blog/market-2026.jpg",
            author: "Dilnoza Abdullaeva",
            date: "2025-12-20",
            comments: 19,
            views: 920
        }
    ];
}

// ===== RENDER BLOG POSTS =====
function renderBlogPosts() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;
    
    let filteredPosts = blogPosts;
    
    if (currentCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.category.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    if (paginatedPosts.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 60px; color: #dee2e6; margin-bottom: 20px;"></i>
                <h3>Hech qanday maqola topilmadi</h3>
                <p>Iltimos, qidiruv so'zlarini o'zgartirib ko'ring</p>
                <button class="btn btn-primary" onclick="resetBlogSearch()">Qidiruvni tozalash</button>
            </div>
        `;
        updatePagination(0, 1);
        return;
    }
    
    grid.innerHTML = paginatedPosts.map(post => `
        <article class="blog-post" data-aos="fade-up">
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
                <span class="post-category">${post.category}</span>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    <span><i class="fas fa-comments"></i> ${post.comments}</span>
                    <span><i class="fas fa-eye"></i> ${post.views}</span>
                </div>
                <h3 class="post-title">
                    <a href="blog-detail.html?id=${post.id}">${post.title}</a>
                </h3>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-footer">
                    <a href="blog-detail.html?id=${post.id}" class="read-more">
                        Ko'proq o'qish <i class="fas fa-arrow-right"></i>
                    </a>
                    <span class="post-comments">
                        <i class="fas fa-comment"></i> ${post.comments}
                    </span>
                </div>
            </div>
        </article>
    `).join('');
    
    updatePagination(totalPosts, totalPages);
}

// ===== UPDATE PAGINATION =====
function updatePagination(totalPosts, totalPages) {
    const pagination = document.getElementById('blogPagination');
    if (!pagination) return;
    
    if (totalPosts <= postsPerPage || totalPages === 0) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    html += `
        <button class="page-item ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="goToBlogPage(${currentPage - 1})" 
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
        html += `<button class="page-item" onclick="goToBlogPage(1)">1</button>`;
        if (startPage > 2) html += `<span class="page-item page-dots">...</span>`;
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-item ${i === currentPage ? 'active' : ''}" 
                    onclick="goToBlogPage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="page-item page-dots">...</span>`;
        }
        html += `<button class="page-item" onclick="goToBlogPage(${totalPages})">${totalPages}</button>`;
    }
    
    html += `
        <button class="page-item ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="goToBlogPage(${currentPage + 1})"
                ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = html;
}

function goToBlogPage(page) {
    const totalPosts = getFilteredPosts().length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderBlogPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== GET FILTERED POSTS =====
function getFilteredPosts() {
    let filtered = blogPosts;
    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.excerpt.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    return filtered;
}

// ===== RENDER CATEGORIES =====
function renderCategories() {
    const list = document.getElementById('categoryList');
    if (!list) return;
    
    const categories = ['all', ...new Set(blogPosts.map(p => p.category))];
    const counts = {};
    blogPosts.forEach(p => {
        counts[p.category] = (counts[p.category] || 0) + 1;
    });
    
    list.innerHTML = categories.map(cat => `
        <li>
            <a href="#" onclick="filterByCategory('${cat}')">
                ${cat === 'all' ? 'Barchasi' : cat}
                <span>${cat === 'all' ? blogPosts.length : counts[cat] || 0}</span>
            </a>
        </li>
    `).join('');
}

// ===== RENDER RECENT POSTS =====
function renderRecentPosts() {
    const list = document.getElementById('recentPosts');
    if (!list) return;
    
    const recent = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    list.innerHTML = recent.map(post => `
        <li>
            <img src="${post.image}" alt="${post.title}" loading="lazy">
            <div class="recent-post-info">
                <a href="blog-detail.html?id=${post.id}">${post.title}</a>
                <span class="recent-post-date">${formatDate(post.date)}</span>
            </div>
        </li>
    `).join('');
}

// ===== RENDER TAGS =====
function renderTags() {
    const cloud = document.getElementById('tagCloud');
    if (!cloud) return;
    
    const tags = {};
    blogPosts.forEach(post => {
        post.tags.forEach(tag => {
            tags[tag] = (tags[tag] || 0) + 1;
        });
    });
    
    const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);
    
    cloud.innerHTML = sortedTags.map(([tag, count]) => `
        <a href="#" class="tag" onclick="searchByTag('${tag}')">${tag} (${count})</a>
    `).join('');
}

// ===== FILTER BY CATEGORY =====
function filterByCategory(category) {
    currentCategory = category;
    currentPage = 1;
    renderBlogPosts();
}

// ===== SEARCH BY TAG =====
function searchByTag(tag) {
    searchQuery = tag;
    document.getElementById('blogSearch').value = tag;
    currentPage = 1;
    renderBlogPosts();
}

// ===== BLOG SEARCH =====
function initBlogSearch() {
    const searchInput = document.getElementById('blogSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            searchQuery = this.value;
            currentPage = 1;
            renderBlogPosts();
        }
    });
    
    const searchBtn = searchInput.parentElement.querySelector('button');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchQuery = searchInput.value;
            currentPage = 1;
            renderBlogPosts();
        });
    }
}

// ===== BLOG FILTERS =====
function initBlogFilters() {
    // Filter buttons can be added here
}

// ===== RESET BLOG SEARCH =====
function resetBlogSearch() {
    searchQuery = '';
    currentCategory = 'all';
    currentPage = 1;
    document.getElementById('blogSearch').value = '';
    renderBlogPosts();
}

// ===== NEWSLETTER =====
function initNewsletter() {
    const widget = document.querySelector('.newsletter-widget');
    if (!widget) return;
    
    const input = widget.querySelector('input');
    const button = widget.querySelector('button');
    
    if (button) {
        button.addEventListener('click', function() {
            const email = input.value.trim();
            if (!email) {
                showNotification('Iltimos, email manzilingizni kiriting', 'warning');
                return;
            }
            if (!isValidEmail(email)) {
                showNotification('Iltimos, to\'g\'ri email kiriting', 'warning');
                return;
            }
            showNotification('Obuna bo\'ldingiz! Rahmat!', 'success');
            input.value = '';
        });
    }
}

// ===== EXPOSE GLOBALLY =====
window.goToBlogPage = goToBlogPage;
window.filterByCategory = filterByCategory;
window.searchByTag = searchByTag;
window.resetBlogSearch = resetBlogSearch;

console.log('✅ Blog Module loaded successfully');