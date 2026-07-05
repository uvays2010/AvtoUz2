/* ========================================
   CAR-ENTERPRISE - FAQ MODULE
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    if (!document.querySelector('.faq-section')) return;
    
    initFaq();
});

// ===== FAQ DATA =====
const faqData = [
    {
        id: 1,
        question: "Avtomobil sotib olish uchun qanday hujjatlar kerak?",
        answer: "Avtomobil sotib olish uchun sizga pasport, INN (JShShIR), va sotuvchi bilan shartnoma kerak bo'ladi. Agar kredit orqali sotib olsangiz, qo'shimcha hujjatlar talab qilinishi mumkin.",
        category: "sotib-olish"
    },
    {
        id: 2,
        question: "Avtomobilni qanday tekshirish kerak?",
        answer: "Avtomobilni tekshirishda quyidagilarga e'tibor bering: dvigatel ishlashi, tormoz tizimi, rul boshqaruvi, shinalar holati, korpusdagi zang va shikastlar. Professional diagnostikadan o'tkazish tavsiya etiladi.",
        category: "texnik"
    },
    {
        id: 3,
        question: "Kredit olish uchun qanday shartlar kerak?",
        answer: "Kredit olish uchun sizga doimiy ish joyi, 6 oydan kam bo'lmagan ish staji, va bank talab qilgan boshqa hujjatlar kerak bo'ladi. Kredit miqdori va foiz stavkasi bankka qarab farq qiladi.",
        category: "kredit"
    },
    {
        id: 4,
        question: "Avtomobilni qancha vaqtda yetkazib berasiz?",
        answer: "Avtomobilni yetkazib berish muddati model va ombordagi mavjudligiga bog'liq. O'rtacha 3-7 ish kuni ichida yetkazib beramiz. Ba'zi modellar uchun 2-3 hafta vaqt ketishi mumkin.",
        category: "sotib-olish"
    },
    {
        id: 5,
        question: "Avtomobilga kafolat bera olasizmi?",
        answer: "Ha, barcha avtomobillarga 3 yil yoki 100,000 km gacha kafolat beramiz. Kafolat davrida dvigatel, transmissiya va boshqa muhim qismlar qoplanadi.",
        category: "texnik"
    },
    {
        id: 6,
        question: "Avtomobilni qanday to'lov usullari bilan sotib olish mumkin?",
        answer: "Siz avtomobilni naqd pul, bank o'tkazmasi, kredit yoki lizing orqali sotib olishingiz mumkin. Biz barcha to'lov usullarini qabul qilamiz.",
        category: "sotib-olish"
    },
    {
        id: 7,
        question: "Avtomobilni qaytarish yoki almashtirish imkoniyati bormi?",
        answer: "Ha, sotib olingan kundan boshlab 7 kun ichida avtomobilni qaytarish yoki almashtirish imkoniyati mavjud. Buning uchun avtomobil shikastlanmagan va to'liq komplektda bo'lishi kerak.",
        category: "sotib-olish"
    },
    {
        id: 8,
        question: "Avtomobilga texnik xizmat ko'rsatish qancha turadi?",
        answer: "Texnik xizmat ko'rsatish narxi avtomobil modeli va ish hajmiga bog'liq. O'rtacha 500,000 dan 2,000,000 so'mgacha bo'lishi mumkin. Biz sizga aniq narxni avtomobilni ko'rib chiqqandan keyin aytib beramiz.",
        category: "servis"
    },
    {
        id: 9,
        question: "Avtomobil sug'urtasini qanday rasmiylashtirish mumkin?",
        answer: "Avtomobil sug'urtasini bizning kompaniyamiz orqali yoki mustaqil sug'urta kompaniyalaridan rasmiylashtirishingiz mumkin. Biz sizga eng yaxshi shartlarni taklif qilamiz.",
        category: "sotib-olish"
    },
    {
        id: 10,
        question: "Avtomobilning texnik holatini qanday bilish mumkin?",
        answer: "Siz avtomobilning texnik holatini bizning diagnostika markazimizda tekshirishingiz mumkin. Biz barcha avtomobillarni sotishdan oldin to'liq tekshiruvdan o'tkazamiz.",
        category: "texnik"
    }
];

let currentCategory = 'all';
let searchQuery = '';

// ===== INIT FAQ =====
function initFaq() {
    renderFaq();
    initCategoryFilter();
    initFaqSearch();
    initFaqToggle();
}

// ===== RENDER FAQ =====
function renderFaq() {
    const container = document.getElementById('faqList');
    if (!container) return;
    
    let filtered = faqData;
    
    if (currentCategory !== 'all') {
        filtered = filtered.filter(item => item.category === currentCategory);
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="no-results" style="text-align: center; padding: 60px 20px;">
                <i class="fas fa-search" style="font-size: 60px; color: #dee2e6; margin-bottom: 20px;"></i>
                <h3>Savol topilmadi</h3>
                <p>Iltimos, qidiruv so'zlarini o'zgartirib ko'ring</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(item => `
        <div class="faq-item" data-category="${item.category}">
            <div class="faq-question" onclick="toggleFaq(this)">
                <h4>${item.question}</h4>
                <span class="faq-toggle"><i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        </div>
    `).join('');
}

// ===== TOGGLE FAQ =====
function toggleFaq(element) {
    const item = element.closest('.faq-item');
    const isActive = item.classList.contains('active');
    
    // Close all others
    document.querySelectorAll('.faq-item.active').forEach(el => {
        el.classList.remove('active');
    });
    
    if (!isActive) {
        item.classList.add('active');
    }
}

// ===== CATEGORY FILTER =====
function initCategoryFilter() {
    const categories = document.querySelectorAll('.faq-cat');
    categories.forEach(cat => {
        cat.addEventListener('click', function() {
            categories.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderFaq();
        });
    });
}

// ===== FAQ SEARCH =====
function initFaqSearch() {
    const searchInput = document.getElementById('faqSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        searchQuery = this.value;
        renderFaq();
    });
}

// ===== EXPOSE GLOBALLY =====
window.toggleFaq = toggleFaq;

console.log('✅ FAQ Module loaded successfully');