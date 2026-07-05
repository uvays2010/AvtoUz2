/* ========================================
   CAR-ENTERPRISE - ANIMATIONS MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initScrollAnimations();
    initCounterAnimations();
    initHoverAnimations();
    initLoadingAnimations();
});

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Elements with scroll animation classes
    const elements = document.querySelectorAll('.scroll-fade, .scroll-fade-left, .scroll-fade-right, .scroll-zoom');
    
    if (elements.length === 0) return;
    
    // Create intersection observer
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add delay if specified
                const delay = entry.target.dataset.delay || 0;
                if (delay > 0) {
                    entry.target.style.transitionDelay = delay + 'ms';
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(function(el) {
        observer.observe(el);
    });
}

// ===== COUNTER ANIMATIONS =====
function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter-number, .stat-number[data-count]');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.dataset.count);
    const duration = 2000;
    const isFloat = target % 1 !== 0;
    const step = Math.max(1, Math.floor(target / 60));
    let current = 0;
    
    element.classList.add('animated');
    
    const interval = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        element.textContent = isFloat ? current.toFixed(1) : current;
        if (current >= target) {
            element.textContent = target;
            // Add plus sign if target > 100
            if (target > 100) {
                element.textContent = target + '+';
            }
        }
    }, duration / 60);
}

// ===== HOVER ANIMATIONS =====
function initHoverAnimations() {
    // Cards with hover lift
    const cards = document.querySelectorAll('.hover-lift, .car-card, .feature-card, .blog-card, .testimonial-card, .service-card, .product-card');
    
    cards.forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });
    
    // Buttons with ripple effect
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
    
    // Images with zoom effect
    const images = document.querySelectorAll('.zoom-in-image, .car-image img, .blog-image img, .product-image img');
    
    images.forEach(function(img) {
        img.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.5s ease';
        });
    });
}

// ===== RIPPLE EFFECT =====
function createRipple(event, button) {
    const ripple = document.createElement('span');
    ripple.classList.add('btn-ripple');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(function() {
        ripple.remove();
    }, 600);
}

// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Loading dots
    const loadingDots = document.querySelectorAll('.loading-dots');
    
    loadingDots.forEach(function(el) {
        let dots = 0;
        setInterval(function() {
            dots = (dots + 1) % 4;
            el.textContent = '.'.repeat(dots);
        }, 500);
    });
    
    // Progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(function(bar) {
        const target = bar.dataset.progress || 0;
        setTimeout(function() {
            bar.style.width = target + '%';
        }, 100);
    });
}

// ===== TYPEWRITER EFFECT =====
function typewriter(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== PARALLAX EFFECT =====
function initParallax() {
    const elements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        elements.forEach(function(el) {
            const speed = el.dataset.speed || 0.5;
            const offset = scrolled * speed;
            el.style.transform = 'translateY(' + offset + 'px)';
        });
    });
}

// ===== FADE IN SEQUENCE =====
function fadeInSequence(container, delay = 100) {
    const children = container.children;
    
    Array.from(children).forEach(function(child, index) {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(function() {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
        }, index * delay + 100);
    });
}

// ===== ANIMATE ON SCROLL =====
function animateOnScroll(selector, animationClass) {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add(animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(function(el) {
        observer.observe(el);
    });
}

// ===== TYPING EFFECT =====
function initTypingEffect() {
    const elements = document.querySelectorAll('.text-typing, .text-typing-blink');
    
    elements.forEach(function(el) {
        const text = el.dataset.text || el.textContent;
        const speed = el.dataset.speed || 100;
        const delay = el.dataset.delay || 0;
        
        el.textContent = '';
        el.style.width = '0';
        el.style.display = 'inline-block';
        el.style.overflow = 'hidden';
        el.style.whiteSpace = 'nowrap';
        
        setTimeout(function() {
            typewriter(el, text, speed);
        }, delay);
    });
}

// ===== PARTICLE BACKGROUND =====
function createParticles(container, count = 50) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 5}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

// ===== CONFETTI ANIMATION =====
function createConfetti() {
    const colors = ['#e74c3c', '#f39c12', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c'];
    const container = document.body;
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 8 + 4}px;
            height: ${Math.random() * 8 + 4}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
            animation-delay: ${Math.random() * 2}s;
            pointer-events: none;
            z-index: 9999;
        `;
        container.appendChild(confetti);
        
        setTimeout(function() {
            confetti.remove();
        }, 5000);
    }
}

// ===== KEYFRAMES FOR PARTICLES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
        50% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
    }
    
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg) scale(0.5); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== EXPOSE GLOBALLY =====
window.typewriter = typewriter;
window.fadeInSequence = fadeInSequence;
window.animateOnScroll = animateOnScroll;
window.createParticles = createParticles;
window.createConfetti = createConfetti;
window.initTypingEffect = initTypingEffect;
window.initParallax = initParallax;

console.log('✅ Animations Module loaded successfully');