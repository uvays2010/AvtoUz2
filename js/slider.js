/* ========================================
   CAR-ENTERPRISE - SLIDER MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initHeroSlider();
    initTestimonialsSlider();
});

// ===== HERO SLIDER =====
function initHeroSlider() {
    const sliderElement = document.querySelector('.hero-slider');
    if (!sliderElement) return;
    
    // Check if Swiper is available
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded');
        return;
    }
    
    const swiper = new Swiper(sliderElement, {
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        speed: 800,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        a11y: {
            prevSlideMessage: 'Oldingi slayd',
            nextSlideMessage: 'Keyingi slayd',
            firstSlideMessage: 'Birinchi slayd',
            lastSlideMessage: 'Oxirgi slayd'
        }
    });
    
    // Pause on hover
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', function() {
            swiper.autoplay.stop();
        });
        hero.addEventListener('mouseleave', function() {
            swiper.autoplay.start();
        });
    }
    
    return swiper;
}

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
    const sliderElement = document.querySelector('.testimonials-slider');
    if (!sliderElement) return;
    
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded');
        return;
    }
    
    const swiper = new Swiper(sliderElement, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        speed: 600,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30
            }
        },
        a11y: {
            prevSlideMessage: 'Oldingi sharh',
            nextSlideMessage: 'Keyingi sharh'
        }
    });
    
    return swiper;
}

// ===== GENERIC SLIDER =====
function initSlider(selector, options = {}) {
    const sliderElement = document.querySelector(selector);
    if (!sliderElement) return null;
    
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded');
        return null;
    }
    
    const defaultOptions = {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 20,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
        },
        speed: 600,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        },
        breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 30 }
        }
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new Swiper(sliderElement, mergedOptions);
}

// ===== EXPOSE GLOBALLY =====
window.initSlider = initSlider;
window.initHeroSlider = initHeroSlider;
window.initTestimonialsSlider = initTestimonialsSlider;

console.log('✅ Slider Module loaded successfully');


// ===== HERO VIDEO LOADING =====
function initHeroVideo() {
    const videos = document.querySelectorAll('.hero-slide .hero-video');
    
    videos.forEach(function(video) {
        // Video yuklanganda
        video.addEventListener('loadeddata', function() {
            this.classList.add('loaded');
        });
        
        // Video yuklanmasa
        video.addEventListener('error', function() {
            this.style.display = 'none';
            const slide = this.closest('.hero-slide');
            if (slide) {
                slide.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
            }
        });
    });
}

// Slider init dan keyin chaqiring
document.addEventListener('DOMContentLoaded', function() {
    initHeroVideo();
});