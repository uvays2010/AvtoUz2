/* ========================================
   CAR-ENTERPRISE - MAIN JAVASCRIPT
   Version: 1.0.0
   ======================================== */

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // ===== INITIALIZE ALL MODULES =====
    initPreloader();
    initHeader();
    initBackToTop();
    initThemeToggle();
    initSearchModal();
    initMobileMenu();
    initSmoothScroll();
    initCounterAnimation();
    initCartCount();
    initNotifications();
});

// ===== PRELOADER =====
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hide');
            document.body.style.overflow = 'auto';
        }, 1000);
    });
}

// ===== HEADER SCROLL EFFECT =====
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Show notification
        showNotification(
            `Mavzu ${newTheme === 'dark' ? 'qorong\'i' : 'yorug\''} rejimga o'zgartirildi`,
            'success'
        );
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===== SEARCH MODAL =====
function initSearchModal() {
    const searchToggle = document.getElementById('searchToggle');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.getElementById('searchSubmit');
    
    if (!searchToggle || !searchModal) return;
    
    function openSearch() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) {
            setTimeout(function() {
                searchInput.focus();
            }, 300);
        }
    }
    
    function closeSearch() {
        searchModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (searchInput) {
            searchInput.value = '';
        }
    }
    
    searchToggle.addEventListener('click', openSearch);
    
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }
    
    searchModal.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            closeSearch();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
        if (e.key === 'Ctrl' && e.key === 'k') {
            e.preventDefault();
            openSearch();
        }
    });
    
    if (searchSubmit && searchInput) {
        searchSubmit.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
}

function performSearch(query) {
    if (query.trim() === '') {
        showNotification('Iltimos, qidiruv so\'zini kiriting', 'warning');
        return;
    }
    
    // Redirect to search results page
    window.location.href = `cars.html?search=${encodeURIComponent(query)}`;
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close menu on link click
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
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
}

// ===== COUNTER ANIMATION =====
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    if (!counters.length) return;
    
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
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
    }
    
    // Intersection Observer
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

// ===== CART COUNT =====
function initCartCount() {
    updateCartCount();
    
    // Listen for cart updates
    document.addEventListener('cartUpdated', function() {
        updateCartCount();
    });
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    const cart = getCart();
    const totalItems = cart.reduce(function(sum, item) {
        return sum + item.quantity;
    }, 0);
    
    cartCount.textContent = totalItems;
}

function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
        return [];
    }
}

// ===== NOTIFICATIONS =====
function initNotifications() {
    // Create notification container if not exists
    if (!document.getElementById('notificationContainer')) {
        const container = document.createElement('div');
        container.id = 'notificationContainer';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            width: 100%;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: var(--white, #ffffff);
        color: var(--gray-800, #212529);
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        pointer-events: auto;
        border-left: 4px solid ${colors[type] || colors.info};
        border: 1px solid var(--gray-200, #e9ecef);
    `;
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}" style="color: ${colors[type] || colors.info}; font-size: 20px;"></i>
        <span style="flex: 1; font-size: 14px;">${message}</span>
        <button style="
            background: transparent;
            border: none;
            color: var(--gray-500, #adb5bd);
            cursor: pointer;
            font-size: 16px;
            padding: 0 4px;
        ">&times;</button>
    `;
    
    container.appendChild(notification);
    
    // Trigger slide in
    setTimeout(function() {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('button');
    closeBtn.addEventListener('click', function() {
        removeNotification(notification);
    });
    
    // Auto remove
    setTimeout(function() {
        removeNotification(notification);
    }, duration);
}

function removeNotification(notification) {
    notification.style.transform = 'translateX(120%)';
    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// ===== UTILITY FUNCTIONS =====
// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Format date
function formatDate(date) {
    return new Intl.DateTimeFormat('uz-UZ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Generate random ID
function generateId() {
    return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Get URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

// ===== EXPOSE GLOBALLY =====
window.showNotification = showNotification;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.getCart = getCart;
window.updateCartCount = updateCartCount;

// ===== CONSOLE LOGO =====
console.log('%c🚗 Car Enterprise', 'font-size: 24px; font-weight: bold; color: #e74c3c;');
console.log('%cPremium avtomobillar saytiga xush kelibsiz!', 'font-size: 14px; color: #2c3e50;');
console.log('%cVersion: 1.0.0 | 2026', 'font-size: 12px; color: #6c757d;');