/* ========================================
   CAR-ENTERPRISE - BLOG DETAIL MODULE
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    if (!document.querySelector('.blog-detail-section')) return;
    
    initBlogDetail();
});

// ===== BLOG DETAIL =====
let currentPost = null;

function initBlogDetail() {
    const params = getUrlParams();
    const postId = params.id;
    
    if (!postId) {
        window.location.href = 'blog.html';
        return;
    }
    
    loadBlogPost(postId);
    initCommentForm();
}

function loadBlogPost(postId) {
    // In production, fetch from API
    // For demo, use hardcoded data
    const posts = getBlogData();
    const post = posts.find(p => p.id === parseInt(postId));
    
    if (!post) {
        showNotification('Maqola topilmadi', 'error');
        setTimeout(() => {
            window.location.href = 'blog.html';
        }, 2000);
        return;
    }
    
    currentPost = post;
    renderBlogPost(post);
    renderRecentPosts();
    renderTags();
    renderAuthorWidget(post);
    renderComments(post);
}

function renderBlogPost(post) {
    const container = document.getElementById('blogDetailContent');
    if (!container) return;
    
    // Update page title
    document.title = `${post.title} | Car Enterprise`;
    
    container.innerHTML = `
        <article class="post">
            <div class="post-header">
                <span class="post-category">${post.category}</span>
                <h1 class="post-title">${post.title}</h1>
                <div class="post-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                    <span><i class="fas fa-comments"></i> ${post.comments} sharh</span>
                    <span><i class="fas fa-eye"></i> ${post.views} ko'rish</span>
                </div>
            </div>
            
            <img src="images/${post.image}" alt="${post.title}" class="post-image">
            
            <div class="post-body">
                <p>${post.content || post.excerpt}</p>
                
                <h2>Nima uchun bu muhim?</h2>
                <p>Avtomobil sohasidagi yangiliklar va tendensiyalar har kuni o'zgarib bormoqda. 
                Ushbu maqola sizga eng so'nggi ma'lumotlarni taqdim etadi.</p>
                
                <ul>
                    <li>Birinchi muhim nuqta</li>
                    <li>Ikkinchi muhim nuqta</li>
                    <li>Uchinchi muhim nuqta</li>
                </ul>
                
                <h3>Qo'shimcha ma'lumotlar</h3>
                <p>Ko'proq ma'lumot olish uchun bizning boshqa maqolalarimizni o'qing.</p>
                
                <blockquote>
                    <p>"Avtomobil - bu faqat transport vositasi emas, balki hayot tarzi."</p>
                </blockquote>
            </div>
            
            <div class="post-tags">
                ${post.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
            </div>
        </article>
    `;
}

function renderAuthorWidget(post) {
    const widget = document.getElementById('authorWidget');
    if (!widget) return;
    
    widget.innerHTML = `
        <h4>Muallif</h4>
        <div class="author-avatar">
            <img src="images/team/team-1.jpg" alt="${post.author}">
        </div>
        <h5 class="author-name">${post.author}</h5>
        <p class="author-bio">Avtomobil sohasidagi tajribali mutaxassis. 10 yillik tajribaga ega.</p>
        <a href="blog.html" class="btn btn-outline btn-sm btn-block">Barcha maqolalar</a>
    `;
}

function renderComments(post) {
    const container = document.getElementById('commentsSection');
    if (!container) return;
    
    // Sample comments
    const comments = [
        {
            id: 1,
            author: "Jamshid",
            date: "2026-01-16",
            text: "Juda foydali maqola! Rahmat.",
            avatar: "J"
        },
        {
            id: 2,
            author: "Dilshod",
            date: "2026-01-15",
            text: "Ajoyib tahlil, kutilmagan ma'lumotlar.",
            avatar: "D"
        },
        {
            id: 3,
            author: "Gulnora",
            date: "2026-01-14",
            text: "Bu maqola menga juda yordam berdi. Tafsilotlar ajoyib!",
            avatar: "G"
        }
    ];
    
    container.innerHTML = `
        <h3 class="comments-title">Sharhlar (${comments.length})</h3>
        
        <div class="comments-list">
            ${comments.map(comment => `
                <div class="comment-item">
                    <div class="comment-avatar">${comment.avatar}</div>
                    <div class="comment-body">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-date">${formatDate(comment.date)}</span>
                        <p class="comment-text">${comment.text}</p>
                        <span class="comment-reply"><i class="fas fa-reply"></i> Javob yozish</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="comment-form">
            <h4>Sharh qoldirish</h4>
            <form id="commentForm">
                <div class="form-group">
                    <label for="commentName">Ismingiz *</label>
                    <input type="text" id="commentName" placeholder="Ismingizni kiriting" required>
                </div>
                <div class="form-group">
                    <label for="commentEmail">Email *</label>
                    <input type="email" id="commentEmail" placeholder="Email manzilingiz" required>
                </div>
                <div class="form-group">
                    <label for="commentText">Sharh *</label>
                    <textarea id="commentText" placeholder="Sharhingizni yozing..." required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Sharh qoldirish</button>
            </form>
        </div>
    `;
}

function initCommentForm() {
    const form = document.getElementById('commentForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('commentName').value;
        const email = document.getElementById('commentEmail').value;
        const text = document.getElementById('commentText').value;
        
        if (!name || !email || !text) {
            showNotification('Iltimos, barcha maydonlarni to\'ldiring', 'warning');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Iltimos, to\'g\'ri email kiriting', 'warning');
            return;
        }
        
        // Add comment to list
        const commentsList = document.querySelector('.comments-list');
        if (commentsList) {
            const comment = document.createElement('div');
            comment.className = 'comment-item';
            comment.innerHTML = `
                <div class="comment-avatar">${name.charAt(0).toUpperCase()}</div>
                <div class="comment-body">
                    <span class="comment-author">${name}</span>
                    <span class="comment-date">${formatDate(new Date())}</span>
                    <p class="comment-text">${text}</p>
                    <span class="comment-reply"><i class="fas fa-reply"></i> Javob yozish</span>
                </div>
            `;
            commentsList.appendChild(comment);
        }
        
        // Update comment count
        const commentCount = document.querySelector('.comments-title');
        if (commentCount) {
            const currentCount = parseInt(commentCount.textContent.match(/\d+/)[0]) || 0;
            commentCount.textContent = `Sharhlar (${currentCount + 1})`;
        }
        
        form.reset();
        showNotification('Sharhingiz qabul qilindi! Rahmat!', 'success');
    });
}

function renderRecentPosts() {
    const list = document.getElementById('recentPosts');
    if (!list) return;
    
    const posts = getBlogData().slice(0, 5);
    
    list.innerHTML = posts.map(post => `
        <li>
            <img src="images/${post.image}" alt="${post.title}" loading="lazy">
            <div class="recent-post-info">
                <a href="blog-detail.html?id=${post.id}">${post.title}</a>
                <span class="recent-post-date">${formatDate(post.date)}</span>
            </div>
        </li>
    `).join('');
}

function renderTags() {
    const cloud = document.getElementById('tagCloud');
    if (!cloud) return;
    
    const posts = getBlogData();
    const tags = {};
    posts.forEach(post => {
        post.tags.forEach(tag => {
            tags[tag] = (tags[tag] || 0) + 1;
        });
    });
    
    const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    cloud.innerHTML = sortedTags.map(([tag, count]) => `
        <a href="blog.html?tag=${tag}" class="tag">${tag} (${count})</a>
    `).join('');
}

// ===== GET BLOG DATA (shared with blog.js) =====
function getBlogData() {
    return [
        {
            id: 1,
            title: "2026 yilning eng yaxshi avtomobillari",
            excerpt: "Yangi yilda bozorda qanday avtomobillar eng yaxshi deb topildi?",
            content: "To'liq maqola matni... 2026 yilda avtomobil bozori yangi modellar bilan boyidi...",
            category: "Yangiliklar",
            tags: ["avtomobillar", "2026", "yangiliklar"],
            image: "blog/car-2026.jpg",
            author: "Alisher Karimov",
            date: "2026-01-15",
            comments: 24,
            views: 1250
        },
        {
            id: 2,
            title: "Avtomobil sotib olishda 5 ta muhim maslahat",
            excerpt: "Avtomobil sotib olishdan oldin bilishingiz kerak bo'lgan 5 ta muhim maslahat.",
            content: "To'liq maqola matni... Avtomobil sotib olish - bu muhim qaror...",
            category: "Maslahatlar",
            tags: ["maslahatlar", "sotib olish", "qo'llanma"],
            image: "blog/car-buying-tips.jpg",
            author: "Dilnoza Abdullaeva",
            date: "2026-01-10",
            comments: 18,
            views: 890
        },
        {
            id: 3,
            title: "Elektromobillar kelajagi - 2026 tendensiyalari",
            excerpt: "Elektromobillar bozori qanday rivojlanmoqda?",
            content: "To'liq maqola matni... Elektromobillar kelajagi yorqin...",
            category: "Texnologiya",
            tags: ["elektromobil", "texnologiya", "kelajak"],
            image: "blog/electric-cars.jpg",
            author: "Javlon Abdullayev",
            date: "2026-01-08",
            comments: 32,
            views: 2100
        },
        {
            id: 4,
            title: "Qishda avtomobilni qanday parvarish qilish kerak",
            excerpt: "Qish faslida avtomobilingizni to'g'ri parvarish qilish...",
            content: "To'liq maqola matni... Qishda avtomobil parvarishi muhim...",
            category: "Parvarish",
            tags: ["qish", "parvarish", "servis"],
            image: "blog/winter-car-care.jpg",
            author: "Madina Tursunova",
            date: "2026-01-05",
            comments: 15,
            views: 750
        },
        {
            id: 5,
            title: "Eng arzon avtomobillar 2026",
            excerpt: "2026 yilda eng arzon va sifatli avtomobillar qaysilar?",
            content: "To'liq maqola matni... Budjetingizga mos avtomobillar...",
            category: "Narxlar",
            tags: ["arzon", "budjet", "2026"],
            image: "blog/cheap-cars.jpg",
            author: "Alisher Karimov",
            date: "2026-01-03",
            comments: 21,
            views: 1500
        },
        {
            id: 6,
            title: "Avtomobil sug'urtasi - bilishingiz kerak bo'lgan hamma narsa",
            excerpt: "Avtomobil sug'urtasi haqida to'liq ma'lumot.",
            content: "To'liq maqola matni... Sug'urta turlari va narxlari...",
            category: "Maslahatlar",
            tags: ["sug'urta", "maslahat", "qo'llanma"],
            image: "blog/car-insurance.jpg",
            author: "Dilnoza Abdullaeva",
            date: "2026-01-01",
            comments: 28,
            views: 1100
        },
        {
            id: 7,
            title: "BMW X5 - 2026 yilning eng yaxshi SUV'i",
            excerpt: "BMW X5 haqida to'liq sharh.",
            content: "To'liq maqola matni... BMW X5 - hashamatli SUV...",
            category: "Sharhlar",
            tags: ["bmw", "x5", "suv"],
            image: "blog/bmw-x5-review.jpg",
            author: "Javlon Abdullayev",
            date: "2025-12-28",
            comments: 45,
            views: 2500
        },
        {
            id: 8,
            title: "Yangi avtomobilni sotishdan oldin tekshirish ro'yxati",
            excerpt: "Yangi avtomobil sotib olayotganda nimaga e'tibor berish kerak?",
            content: "To'liq maqola matni... To'liq tekshirish ro'yxati...",
            category: "Maslahatlar",
            tags: ["tekshirish", "yangi", "qo'llanma"],
            image: "blog/new-car-check.jpg",
            author: "Alisher Karimov",
            date: "2025-12-25",
            comments: 12,
            views: 680
        }
    ];
}

console.log('✅ Blog Detail Module loaded successfully');