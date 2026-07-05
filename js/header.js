/* ========================================
   CAR-ENTERPRISE - HEADER MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initHeader();
});

// ===== HEADER CONFIG =====
const HEADER_CONFIG = {
    SCROLL_THRESHOLD: 50,
    STORAGE_KEY: 'theme',
    DEFAULT_THEME: 'light'
};

// ===== INIT HEADER =====
function initHeader() {
    initScrollEffect();
    initMobileMenu();
    initSearchModal();
    initThemeToggle();
    initCartCount();
    initActiveLink();
}

// ===== SCROLL EFFECT =====
function initScrollEffect() {
    const header = document.getElementById('header');
    if (!header) return;
    
    let lastScroll = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                // Add scrolled class
                if (currentScroll > HEADER_CONFIG.SCROLL_THRESHOLD) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Hide/show header on scroll down/up
                if (currentScroll > lastScroll && currentScroll > 100) {
                    header.style.transform = 'translateY(-100%)';
                    header.style.transition = 'transform 0.3s ease';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Reset transform on mouse enter
    header.addEventListener('mouseenter', function() {
        if (window.pageYOffset > 100) {
            this.style.transform = 'translateY(0)';
        }
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    
    if (!menuToggle || !mainNav) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    // Close menu on link click
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            body.style.overflow = 'auto';
        });
    });
    
    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
    
    // Close menu on resize to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992 && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
}

// ===== SEARCH MODAL =====
function initSearchModal() {
    const searchToggle = document.getElementById('searchToggle');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchSubmit = document.getElementById('searchSubmit');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    if (!searchToggle || !searchModal) return;
    
    // Open search
    function openSearch() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (searchInput) {
            setTimeout(function() {
                searchInput.focus();
            }, 300);
        }
    }
    
    // Close search
    function closeSearch() {
        searchModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (searchInput) {
            searchInput.value = '';
        }
        if (searchSuggestions) {
            searchSuggestions.innerHTML = '';
        }
    }
    
    // Toggle search
    searchToggle.addEventListener('click', openSearch);
    
    // Close button
    if (searchClose) {
        searchClose.addEventListener('click', closeSearch);
    }
    
    // Close on overlay click
    searchModal.addEventListener('click', function(e) {
        if (e.target === searchModal) {
            closeSearch();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape to close
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeSearch();
        }
        // Ctrl+K or Cmd+K to open
        if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            openSearch();
        }
    });
    
    // Search input
    if (searchInput) {
        // Debounce search suggestions
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(function() {
                    getSearchSuggestions(query);
                }, 300);
            } else {
                if (searchSuggestions) {
                    searchSuggestions.innerHTML = '';
                }
            }
        });
        
        // Enter to submit
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });
    }
    
    // Submit button
    if (searchSubmit) {
        searchSubmit.addEventListener('click', function() {
            if (searchInput) {
                performSearch(searchInput.value);
            }
        });
    }
}

// ===== GET SEARCH SUGGESTIONS =====
function getSearchSuggestions(query) {
    const suggestions = document.getElementById('searchSuggestions');
    if (!suggestions) return;
    
    // In production: API.cars.search(query)
    // Mock suggestions
    const mockSuggestions = [
        { name: 'BMW X5', type: 'car' },
        { name: 'Mercedes S-Class', type: 'car' },
        { name: 'Toyota Camry', type: 'car' },
        { name: 'Porsche Cayenne', type: 'car' }
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    
    if (mockSuggestions.length === 0) {
        suggestions.innerHTML = `
            <div class="suggestion-item" style="color:var(--text-muted);cursor:default;">
                <i class="fas fa-search"></i> Hech narsa topilmadi
            </div>
        `;
        return;
    }
    
    suggestions.innerHTML = mockSuggestions.map(item => `
        <div class="suggestion-item" onclick="performSearch('${item.name}')">
            <i class="fas fa-car"></i> ${item.name}
        </div>
    `).join('');
}

// ===== PERFORM SEARCH =====
function performSearch(query) {
    if (!query || query.trim() === '') {
        showNotification('Iltimos, qidiruv so\'zini kiriting', 'warning');
        return;
    }
    
    // Close search modal
    const searchModal = document.getElementById('searchModal');
    if (searchModal) {
        searchModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Redirect to cars page with search query
    window.location.href = `pages/cars.html?search=${encodeURIComponent(query.trim())}`;
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');
    
    // Check saved theme
    const savedTheme = localStorage.getItem(HEADER_CONFIG.STORAGE_KEY);
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
        updateThemeIcon('dark');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem(HEADER_CONFIG.STORAGE_KEY, newTheme);
        updateThemeIcon(newTheme);
        
        showNotification(`Mavzu ${newTheme === 'dark' ? 'qorong\'i' : 'yorug\''} rejimga o'zgartirildi`, 'success');
    });
    
    // Update icon
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// ===== CART COUNT =====
function initCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (!cartCount) return;
    
    function updateCount() {
        const cart = Cart.getItems();
        const total = cart.reduce(function(sum, item) {
            return sum + item.quantity;
        }, 0);
        cartCount.textContent = total;
    }
    
    // Initial update
    updateCount();
    
    // Listen for cart updates
    document.addEventListener('cartUpdated', updateCount);
    
    // Also update when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateCount();
        }
    });
}

// ===== ACTIVE LINK =====
function initActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(function(link) {
        const linkHref = link.getAttribute('href');
        if (linkHref) {
            // Get the last part of the href
            const linkPage = linkHref.split('/').pop();
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// ===== DROPDOWN MENUS =====
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(function(dropdown) {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown on outside click
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
        
        // Close on escape
        dropdown.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                toggle.focus();
            }
        });
    });
}

// ===== USER MENU =====
function initUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    if (!userMenu) return;
    
    // Check if user is logged in
    const user = API.auth.getCurrentUser();
    if (user) {
        const userName = user.name || 'Foydalanuvchi';
        const avatar = user.avatar || 'default-avatar.jpg';
        
        userMenu.innerHTML = `
            <button class="user-menu-toggle">
                <img src="images/users/${avatar}" alt="${userName}" class="user-avatar">
                <span>${userName}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="user-dropdown">
                <a href="pages/dashboard.html"><i class="fas fa-user"></i> Profil</a>
                <a href="pages/dashboard.html?tab=orders"><i class="fas fa-shopping-bag"></i> Buyurtmalar</a>
                <a href="pages/dashboard.html?tab=favorites"><i class="fas fa-heart"></i> Sevimlilar</a>
                <a href="pages/dashboard.html?tab=cars"><i class="fas fa-car"></i> Mashinalar</a>
                <a href="#" onclick="logoutUser()"><i class="fas fa-sign-out-alt"></i> Chiqish</a>
            </div>
        `;
        
        // Init dropdown
        initDropdownMenus();
    }
}

// ===== LOGOUT =====
function logoutUser() {
    if (confirm('Haqiqatan ham chiqmoqchimisiz?')) {
        API.auth.logout();
        window.location.href = 'index.html';
    }
}

// ===== EXPOSE GLOBALLY =====
window.performSearch = performSearch;
window.logoutUser = logoutUser;

console.log('✅ Header Module loaded successfully');