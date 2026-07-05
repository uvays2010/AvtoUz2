document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.dashboard-section')) return;
    
    initDashboard();
});

// ===== DASHBOARD DATA =====
let userData = {
    name: 'Alisher Karimov',
    email: 'alisher@example.com',
    phone: '+998 90 123 45 67',
    address: 'Toshkent, Chilonzor 15',
    joined: '2026-01-01',
    rating: 4.8
};

let userCars = [
    { id: 1, brand: 'BMW', model: 'X5', year: 2024, price: 85000000, image: 'cars/bmw-x5-1.jpg', status: 'Aktiv' },
    { id: 2, brand: 'Mercedes-Benz', model: 'S-Class', year: 2024, price: 120000000, image: 'cars/mercedes-s-class-1.jpg', status: 'Sotilgan' }
];

let userOrders = [
    { id: 1001, date: '2026-01-15', total: 85000000, status: 'delivered', items: [{ name: 'BMW X5', quantity: 1 }] },
    { id: 1002, date: '2026-01-10', total: 120000000, status: 'processing', items: [{ name: 'Mercedes S-Class', quantity: 1 }] }
];

// ===== INIT =====
function initDashboard() {
    // Check if user is logged in
    if (!API.auth.isAuthenticated()) {
        window.location.href = 'login.html?redirect=dashboard.html';
        return;
    }
    
    loadUserData();
    initTabs();
    initProfileForm();
    initPasswordForm();
    renderUserCars();
    renderUserOrders();
    renderFavorites();
    updateStats();
}

// ===== LOAD USER DATA =====
function loadUserData() {
    const user = API.auth.getCurrentUser();
    if (user) {
        userData = { ...userData, ...user };
    }
    
    document.getElementById('userName').textContent = userData.name;
    document.getElementById('userEmail').textContent = userData.email;
    document.getElementById('userPhone').textContent = userData.phone;
    document.getElementById('userJoined').textContent = formatDate(userData.joined);
    
    // Fill profile form
    document.getElementById('profileName').value = userData.name;
    document.getElementById('profileEmail').value = userData.email;
    document.getElementById('profilePhone').value = userData.phone;
    document.getElementById('profileAddress').value = userData.address || '';
}

// ===== UPDATE STATS =====
function updateStats() {
    document.getElementById('statCars').textContent = userCars.length;
    document.getElementById('statOrders').textContent = userOrders.length;
    
    const favorites = Favorites.getItems();
    document.getElementById('statFavorites').textContent = favorites.length;
    document.getElementById('statRating').textContent = userData.rating || 0;
}

// ===== TABS =====
function initTabs() {
    const tabs = document.querySelectorAll('.dashboard-tab');
    const contents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            contents.forEach(c => c.classList.toggle('active', c.dataset.content === target));
        });
    });
}

// ===== PROFILE FORM =====
function initProfileForm() {
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('profileName').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        const phone = document.getElementById('profilePhone').value.trim();
        const address = document.getElementById('profileAddress').value.trim();
        
        if (!name) {
            showNotification('Iltimos, ismingizni kiriting', 'warning');
            return;
        }
        
        if (!email || !isValidEmail(email)) {
            showNotification('Iltimos, to\'g\'ri email kiriting', 'warning');
            return;
        }
        
        // Update user data
        userData = { ...userData, name, email, phone, address };
        
        // In production: API.users.update(userData)
        
        // Update UI
        document.getElementById('userName').textContent = name;
        document.getElementById('userEmail').textContent = email;
        document.getElementById('userPhone').textContent = phone;
        
        showNotification('Profil muvaffaqiyatli yangilandi!', 'success');
    });
}

// ===== PASSWORD FORM =====
function initPasswordForm() {
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const current = document.getElementById('currentPassword').value;
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        
        if (!current) {
            showNotification('Joriy parolni kiriting', 'warning');
            return;
        }
        
        if (newPass.length < 6) {
            showNotification('Yangi parol kamida 6 belgi bo\'lishi kerak', 'warning');
            return;
        }
        
        if (newPass !== confirmPass) {
            showNotification('Parollar mos kelmadi', 'warning');
            return;
        }
        
        // In production: API.auth.changePassword({ current, new: newPass })
        showNotification('Parol muvaffaqiyatli o\'zgartirildi!', 'success');
        this.reset();
    });
}

// ===== RENDER USER CARS =====
function renderUserCars() {
    const container = document.getElementById('userCarsList');
    
    if (userCars.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-car"></i>
                <h4>Siz hali mashina qo'shmagansiz</h4>
                <p>Birinchi mashinangizni qo'shing</p>
                <a href="add-car.html" class="btn btn-primary">Mashina qo'shish</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userCars.map(car => `
        <div class="car-item">
            <img src="../images/${car.image || 'cars/default.jpg'}" alt="${car.brand} ${car.model}">
            <div class="car-item-info">
                <h4>${car.brand} ${car.model}</h4>
                <p>${car.year} • <span class="price">${formatCurrency(car.price)}</span></p>
                <p style="font-size: var(--font-xs);">
                    <span style="color: ${car.status === 'Aktiv' ? 'var(--success)' : 'var(--gray-400)'};">●</span> ${car.status}
                </p>
            </div>
            <div class="car-item-actions">
                <a href="edit-car.html?id=${car.id}" class="btn btn-sm btn-outline">
                    <i class="fas fa-edit"></i>
                </a>
                <button class="btn btn-sm btn-danger" onclick="deleteCar(${car.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== RENDER USER ORDERS =====
function renderUserOrders() {
    const container = document.getElementById('userOrdersList');
    
    if (userOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h4>Hali buyurtmalar yo'q</h4>
                <p>Avtomobillar sahifasidan mashina xarid qiling</p>
                <a href="cars.html" class="btn btn-primary">Mashinalarni ko'rish</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userOrders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <span class="order-id">#${order.id}</span>
                <span class="order-status status-${order.status}">
                    ${order.status === 'delivered' ? 'Yetkazilgan' : 
                      order.status === 'processing' ? 'Jarayonda' : 
                      order.status === 'pending' ? 'Kutilmoqda' : 'Bekor qilingan'}
                </span>
                <span class="order-date">${formatDate(order.date)}</span>
                <span class="order-total">${formatCurrency(order.total)}</span>
            </div>
            <div style="font-size: var(--font-sm); color: var(--gray-500);">
                ${order.items.map(item => `${item.name} x ${item.quantity}`).join(', ')}
            </div>
        </div>
    `).join('');
}

// ===== RENDER FAVORITES =====
function renderFavorites() {
    const container = document.getElementById('userFavoritesList');
    const favorites = Favorites.getItems();
    
    // Get car details for favorites
    const favCars = favorites.map(id => {
        // In production: fetch from API
        return userCars.find(c => c.id === id);
    }).filter(c => c);
    
    if (favCars.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <h4>Sevimli mashinalar yo'q</h4>
                <p>Mashinalarni ko'rib, sevimlilarga qo'shing</p>
                <a href="cars.html" class="btn btn-primary">Mashinalarni ko'rish</a>
            </div>
        `;
        return;
    }
    
    container.innerHTML = favCars.map(car => `
        <div class="car-item">
            <img src="../images/${car.image || 'cars/default.jpg'}" alt="${car.brand} ${car.model}">
            <div class="car-item-info">
                <h4>${car.brand} ${car.model}</h4>
                <p>${car.year} • <span class="price">${formatCurrency(car.price)}</span></p>
            </div>
            <div class="car-item-actions">
                <a href="car-detail.html?id=${car.id}" class="btn btn-sm btn-outline">
                    <i class="fas fa-eye"></i>
                </a>
                <button class="btn btn-sm btn-danger" onclick="removeFavorite(${car.id})">
                    <i class="fas fa-heart-broken"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== DELETE CAR =====
function deleteCar(carId) {
    if (confirm('Mashinani o\'chirishni xohlaysizmi?')) {
        userCars = userCars.filter(c => c.id !== carId);
        renderUserCars();
        updateStats();
        showNotification('Mashina o\'chirildi', 'info');
    }
}

// ===== REMOVE FAVORITE =====
function removeFavorite(carId) {
    Favorites.remove(carId);
    renderFavorites();
    updateStats();
}

// ===== LOGOUT =====
function logoutUser() {
    if (confirm('Haqiqatan ham chiqmoqchimisiz?')) {
        API.auth.logout();
        window.location.href = '../index.html';
    }
}

// ===== EXPOSE =====
window.deleteCar = deleteCar;
window.removeFavorite = removeFavorite;
window.logoutUser = logoutUser;

console.log('✅ Dashboard Module loaded');