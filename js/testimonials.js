document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.testimonials-section')) return;
    
    initTestimonials();
});

// ===== TESTIMONIALS DATA =====
const testimonialsData = [
    {
        id: 1,
        name: "Alisher Karimov",
        position: "Biznesmen",
        rating: 5,
        text: "Car Enterprise dan BMW X5 sotib oldim. Juda mamnunman! Mashina ajoyib holatda, xizmat esa yuqori darajada. Barchaga tavsiya qilaman.",
        car: "BMW X5",
        avatar: "A",
        date: "2026-01-15"
    },
    {
        id: 2,
        name: "Dilnoza Abdullaeva",
        position: "Marketing mutaxassisi",
        rating: 5,
        text: "Mercedes S-Class ni Car Enterprise dan sotib olganimdan juda xursandman. Ular bilan ishlash juda oson va qulay. Mashina mukammal!",
        car: "Mercedes S-Class",
        avatar: "D",
        date: "2026-01-12"
    },
    {
        id: 3,
        name: "Javlon Abdullayev",
        position: "Muhandis",
        rating: 4,
        text: "Toyota Camry ni Car Enterprise dan sotib oldim. Yaxshi narx va sifat. Xizmat a'lo darajada. Kredit olishda ham yordam berishdi.",
        car: "Toyota Camry",
        avatar: "J",
        date: "2026-01-10"
    },
    {
        id: 4,
        name: "Madina Tursunova",
        position: "O'qituvchi",
        rating: 5,
        text: "Honda Accord ni Car Enterprise dan sotib oldim. Juda mamnunman! Mashina juda tejamkor va qulay. Xodimlar juda mehribon va yordamchi.",
        car: "Honda Accord",
        avatar: "M",
        date: "2026-01-08"
    },
    {
        id: 5,
        name: "Sherzod Rahimov",
        position: "Dasturchi",
        rating: 5,
        text: "Lexus RX 350 ni Car Enterprise dan sotib oldim. Bu mening orzudagi mashinam edi! Ular menga eng yaxshi variantni taklif qilishdi. Rahmat!",
        car: "Lexus RX 350",
        avatar: "S",
        date: "2026-01-05"
    },
    {
        id: 6,
        name: "Gulnora Saidova",
        position: "Dizayner",
        rating: 4,
        text: "Audi Q7 ni Car Enterprise dan sotib oldim. Katta va qulay oilaviy mashina. Narxi ham maqbul. Tavsiya qilaman!",
        car: "Audi Q7",
        avatar: "G",
        date: "2026-01-03"
    },
    {
        id: 7,
        name: "Rustam Norov",
        position: "Tadbirkor",
        rating: 5,
        text: "Porsche Cayenne ni Car Enterprise dan sotib oldim. Bu haqiqiy sport avtomobili! Xizmat a'lo darajada. Barchaga tavsiya qilaman.",
        car: "Porsche Cayenne",
        avatar: "R",
        date: "2025-12-28"
    },
    {
        id: 8,
        name: "Nodira Azimova",
        position: "Shifokor",
        rating: 4,
        text: "Hyundai Santa Fe ni Car Enterprise dan sotib oldim. Juda qulay va ishonchli mashina. Xodimlar juda professional va yordamchi.",
        car: "Hyundai Santa Fe",
        avatar: "N",
        date: "2025-12-25"
    },
    {
        id: 9,
        name: "Bekzod Toshmatov",
        position: "Sportchi",
        rating: 5,
        text: "KIA Sportage ni Car Enterprise dan sotib oldim. Juda zo'r mashina! Narxi ham arzon, sifati ham a'lo. Rahmat Car Enterprise jamoasi!",
        car: "KIA Sportage",
        avatar: "B",
        date: "2025-12-20"
    }
];

let currentFilter = 'all';

// ===== INIT =====
function initTestimonials() {
    renderTestimonials(testimonialsData);
    initFilters();
    animateStats();
}

// ===== RENDER TESTIMONIALS =====
function renderTestimonials(testimonials) {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;
    
    let filtered = testimonials;
    if (currentFilter !== 'all') {
        filtered = testimonials.filter(t => t.rating === parseInt(currentFilter));
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-star" style="font-size: 60px; color: #dee2e6; margin-bottom: 20px;"></i>
                <h3>Bu reytingda sharhlar topilmadi</h3>
                <p>Iltimos, boshqa filtrni tanlang</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(testimonial => `
        <div class="testimonial-card" data-aos="fade-up" data-rating="${testimonial.rating}">
            <div class="testimonial-quote">&ldquo;</div>
            <div class="testimonial-header">
                <div class="testimonial-avatar">
                    <div class="avatar-placeholder">${testimonial.avatar}</div>
                </div>
                <div class="testimonial-author-info">
                    <h4>${testimonial.name}</h4>
                    <span>${testimonial.position}</span>
                </div>
            </div>
            <div class="testimonial-rating">${renderStars(testimonial.rating)}</div>
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-car">
                <i class="fas fa-car"></i>
                <span>${testimonial.car}</span>
                <span style="margin-left: auto; font-size: var(--font-xs); color: var(--gray-400);">${formatDate(testimonial.date)}</span>
            </div>
        </div>
    `).join('');
}

// ===== RENDER STARS =====
function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += '<i class="fas fa-star"></i>';
        } else {
            html += '<i class="far fa-star"></i>';
        }
    }
    return html;
}

// ===== FILTERS =====
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTestimonials(testimonialsData);
        });
    });
}

// ===== ANIMATE STATS =====
function animateStats() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;
    
    function animateCounter(counter) {
        const target = parseFloat(counter.dataset.count);
        const duration = 2000;
        const isFloat = target % 1 !== 0;
        let start = 0;
        const step = Math.max(1, Math.floor(target / 60));
        
        const interval = setInterval(function() {
            start += step;
            if (start >= target) {
                start = target;
                clearInterval(interval);
            }
            counter.textContent = isFloat ? start.toFixed(1) : start;
            if (start >= target) {
                counter.textContent = target;
            }
        }, duration / 60);
    }
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(function(stat) {
        observer.observe(stat);
    });
}

console.log('✅ Testimonials Module loaded');