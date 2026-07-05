document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.cart-section')) return;
    
    initCartPage();
});

// ===== CARS DATA =====
const carData = [
    { id: 1, brand: 'BMW', model: 'X5', price: 85000000, oldPrice: 92000000, image: 'cars/bmw-x5-1.jpg', year: 2024, color: 'Qora', fuelType: 'Dizel' },
    { id: 2, brand: 'Mercedes-Benz', model: 'S-Class', price: 120000000, oldPrice: null, image: 'cars/mercedes-s-class-1.jpg', year: 2024, color: 'Kumush', fuelType: 'Benzin' },
    { id: 3, brand: 'Toyota', model: 'Camry', price: 35000000, oldPrice: 38000000, image: 'cars/toyota-camry-1.jpg', year: 2023, color: 'Oq', fuelType: 'Benzin' },
    { id: 4, brand: 'Honda', model: 'Accord', price: 32000000, oldPrice: null, image: 'cars/honda-accord-1.jpg', year: 2023, color: "Ko'k", fuelType: 'Benzin' },
    { id: 5, brand: 'Lexus', model: 'RX 350', price: 95000000, oldPrice: 100000000, image: 'cars/lexus-rx-1.jpg', year: 2024, color: 'Oltin', fuelType: 'Benzin' }
];

// ===== INIT =====
function initCartPage() {
    renderCart();
    initCartActions();
}

// ===== RENDER CART =====
function renderCart() {
    const cart = Cart.getItems();
    const container = document.getElementById('cartItems');
    const empty = document.getElementById('cartEmpty');
    const content = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        empty.style.display = 'block';
        content.style.display = 'none';
        updateCartCount();
        return;
    }
    
    empty.style.display = 'none';
    content.style.display = 'block';
    
    // Get car details for each cart item
    const cartItems = cart.map(item => {
        const car = carData.find(c => c.id === item.carId);
        return { ...item, car };
    }).filter(item => item.car);
    
    if (cartItems.length === 0) {
        empty.style.display = 'block';
        content.style.display = 'none';
        return;
    }
    
    container.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item" data-index="${index}" data-car-id="${item.carId}">
            <div class="cart-item-info">
                <img src="../images/${item.car.image || 'cars/default.jpg'}" alt="${item.car.brand} ${item.car.model}">
                <div class="item-details">
                    <h4><a href="car-detail.html?id=${item.carId}">${item.car.brand} ${item.car.model}</a></h4>
                    <div class="item-specs">
                        <span><i class="fas fa-calendar"></i> ${item.car.year}</span>
                        <span><i class="fas fa-paint-bucket"></i> ${item.car.color}</span>
                        <span><i class="fas fa-gas-pump"></i> ${item.car.fuelType}</span>
                    </div>
                </div>
            </div>
            <div class="cart-item-price">
                ${formatCurrency(item.car.price)}
                ${item.car.oldPrice ? `<span class="old-price">${formatCurrency(item.car.oldPrice)}</span>` : ''}
            </div>
            <div class="cart-item-quantity">
                <button class="qty-btn" onclick="updateQuantity(${item.carId}, 'decrease')">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.carId}, 'increase')">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="cart-item-total">
                ${formatCurrency(item.car.price * item.quantity)}
            </div>
            <button class="cart-item-remove" onclick="removeItem(${item.carId})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    updateSummary();
    updateCartCount();
}

// ===== UPDATE QUANTITY =====
function updateQuantity(carId, action) {
    const cart = Cart.getItems();
    const item = cart.find(i => i.carId === carId);
    
    if (!item) return;
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            Cart.removeItem(carId);
            renderCart();
            return;
        }
    }
    
    Storage.set('cart', cart);
    document.dispatchEvent(new CustomEvent('cartUpdated'));
    renderCart();
}

// ===== REMOVE ITEM =====
function removeItem(carId) {
    if (confirm('Mashinani savatdan olib tashlashni xohlaysizmi?')) {
        Cart.removeItem(carId);
        renderCart();
        showNotification('Mashina savatdan olib tashlandi', 'info');
    }
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
    const cart = Cart.getItems();
    let subtotal = 0;
    let totalItems = 0;
    
    cart.forEach(item => {
        const car = carData.find(c => c.id === item.carId);
        if (car) {
            subtotal += car.price * item.quantity;
            totalItems += item.quantity;
        }
    });
    
    const shipping = subtotal > 0 ? 0 : 0;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + shipping + tax;
    
    document.getElementById('summaryItems').textContent = totalItems;
    document.getElementById('summarySubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summaryShipping').textContent = formatCurrency(shipping);
    document.getElementById('summaryTax').textContent = formatCurrency(tax);
    document.getElementById('summaryTotal').textContent = formatCurrency(total);
}

// ===== UPDATE CART COUNT =====
function updateCartCount() {
    const cart = Cart.getItems();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = total;
}

// ===== CART ACTIONS =====
function initCartActions() {
    // Clear cart
    document.getElementById('clearCart').addEventListener('click', function() {
        if (confirm('Savatni tozalashni xohlaysizmi?')) {
            Cart.clear();
            renderCart();
            showNotification('Savat tozalandi', 'info');
        }
    });
    
    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        const cart = Cart.getItems();
        if (cart.length === 0) {
            showNotification('Savat bo\'sh', 'warning');
            return;
        }
        window.location.href = 'checkout.html';
    });
}

// ===== EXPOSE GLOBALLY =====
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

console.log('✅ Cart Module loaded');