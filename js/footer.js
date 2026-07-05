/* ========================================
   CAR-ENTERPRISE - FOOTER MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initFooter();
});

// ===== FOOTER CONFIG =====
const FOOTER_CONFIG = {
    NEWSLETTER_STORAGE_KEY: 'newsletter_subscribed',
    SOCIAL_LINKS: {
        facebook: 'https://facebook.com/carenterprise',
        instagram: 'https://instagram.com/carenterprise',
        youtube: 'https://youtube.com/carenterprise',
        telegram: 'https://t.me/carenterprise',
        whatsapp: 'https://wa.me/998901234567'
    }
};

// ===== INIT FOOTER =====
function initFooter() {
    initNewsletterForm();
    initFooterLinks();
    initBackToTop();
    initCurrentYear();
}

// ===== NEWSLETTER FORM =====
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    
    if (!input || !button) return;
    
    // Check if already subscribed
    const subscribed = localStorage.getItem(FOOTER_CONFIG.NEWSLETTER_STORAGE_KEY);
    if (subscribed === 'true') {
        input.value = 'Siz allaqachon obuna bo'lgansiz';
        input.disabled = true;
        button.disabled = true;
        button.textContent = 'Obuna bo'lingan';
        button.style.background = 'var(--success)';
        return;
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = input.value.trim();
        
        if (!email) {
            showNotification('Iltimos, email manzilingizni kiriting', 'warning');
            input.focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Iltimos, to\'g\'ri email kiriting', 'warning');
            input.focus();
            return;
        }
        
        // Show loading
        const originalText = button.textContent;
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Simulate API call
        setTimeout(function() {
            // Save subscription
            localStorage.setItem(FOOTER_CONFIG.NEWSLETTER_STORAGE_KEY, 'true');
            
            // Update UI
            input.value = 'Siz muvaffaqiyatli obuna bo\'ldingiz!';
            input.disabled = true;
            button.textContent = 'Obuna bo\'lingan';
            button.style.background = 'var(--success)';
            button.disabled = true;
            
            showNotification('Obuna bo\'ldingiz! Rahmat! 📧', 'success');
            
            // Track subscription
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_subscribe', {
                    'event_category': 'engagement',
                    'event_label': email
                });
            }
        }, 1500);
    });
    
    // Input validation on blur
    input.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
            this.style.borderColor = 'var(--danger)';
        } else {
            this.style.borderColor = '';
        }
    });
    
    input.addEventListener('input', function() {
        this.style.borderColor = '';
    });
}

// ===== FOOTER LINKS =====
function initFooterLinks() {
    // Smooth scroll for footer links
    const footerLinks = document.querySelectorAll('.footer a[href^="#"]');
    footerLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Open external links in new tab
    const externalLinks = document.querySelectorAll('.footer a[href^="http"]');
    externalLinks.forEach(function(link) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    // Show/hide button
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Keyboard support
    backToTopBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(function(el) {
        el.textContent = currentYear;
    });
}

// ===== FOOTER STATS =====
function initFooterStats() {
    // You can add real-time stats here
    // For example: total cars, total customers, etc.
}

// ===== EXPOSE GLOBALLY =====
window.initFooter = initFooter;

console.log('✅ Footer Module loaded successfully');