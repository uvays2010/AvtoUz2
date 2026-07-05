document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.checkout-section')) return;
    
    initCheckout();
});

// ===== CARS DATA =====
const carData = [
    { id: 1, brand: 'BMW', model: 'X5', price: 85000000, oldPrice: 92000000, image: 'cars/bmw-x5-1.jpg' },
    { id: 2, brand: 'Mercedes-Benz', model: 'S-Class', price: 120000000, oldPrice: null, image: 'cars/mercedes-s-class-1.jpg' },
    { id: 3, brand: 'Toyota', model: 'Camry', price: 35000000, oldPrice: 38000000, image: 'cars/toyota-camry-1.jpg' }
];

// ===== INIT =====
function initCheckout() {
    const cart = Cart.getItems();
    
    if (cart.length === 0) {
        showNotification('Savat bo\'sh', 'warning');
        setTimeout(() => {
            window.location.href = 'cars.html';
        }, 1500);
        return;
    }
    
    renderOrderSummary();
    initFormValidation();
    initPaymentMethod();
}

// ===== RENDER ORDER SUMMARY =====
function renderOrderSummary() {
    const cart = Cart.getItems();
    const container = document.getElementById('orderItems');
    
    let subtotal = 0;
    let totalItems = 0;
    
    const items = cart.map(item => {
        const car = carData.find(c => c.id === item.carId);
        if (car) {
            subtotal += car.price * item.quantity;
            totalItems += item.quantity;
            return { ...item, car };
        }
        return null;
    }).filter(item => item !== null);
    
    container.innerHTML = items.map(item => `
        <div class="order-item">
            <img src="../images/${item.car.image || 'cars/default.jpg'}" alt="${item.car.brand} ${item.car.model}">
            <div class="order-item-info">
                <h4>${item.car.brand} ${item.car.model}</h4>
                <span>${item.quantity} × ${formatCurrency(item.car.price)}</span>
            </div>
            <span class="order-item-price">${formatCurrency(item.car.price * item.quantity)}</span>
        </div>
    `).join('');
    
    // Update totals
    const shipping = subtotal > 0 ? 0 : 0;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + shipping + tax;
    
    document.getElementById('orderSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('orderShipping').textContent = formatCurrency(shipping);
    document.getElementById('orderTax').textContent = formatCurrency(tax);
    document.getElementById('orderTotal').textContent = formatCurrency(total);
}

// ===== PAYMENT METHOD =====
function initPaymentMethod() {
    const methods = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById('cardDetails');
    
    methods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const form = document.querySelector('.checkout-form');
    
    document.getElementById('placeOrder').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const city = document.getElementById('city').value.trim();
        const payment = document.querySelector('input[name="payment"]:checked');
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const cardExpiry = document.getElementById('cardExpiry').value.trim();
        const cardCvv = document.getElementById('cardCvv').value.trim();
        
        // Validate
        if (!fullName) {
            showNotification('Iltimos, ismingizni kiriting', 'warning');
            document.getElementById('fullName').focus();
            return;
        }
        
        if (!phone) {
            showNotification('Iltimos, telefon raqamingizni kiriting', 'warning');
            document.getElementById('phone').focus();
            return;
        }
        
        if (!email) {
            showNotification('Iltimos, email manzilingizni kiriting', 'warning');
            document.getElementById('email').focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Iltimos, to\'g\'ri email kiriting', 'warning');
            document.getElementById('email').focus();
            return;
        }
        
        if (!address) {
            showNotification('Iltimos, manzilingizni kiriting', 'warning');
            document.getElementById('address').focus();
            return;
        }
        
        if (!city) {
            showNotification('Iltimos, shaharni kiriting', 'warning');
            document.getElementById('city').focus();
            return;
        }
        
        if (!payment) {
            showNotification('Iltimos, to\'lov usulini tanlang', 'warning');
            return;
        }
        
        if (payment.value === 'card') {
            if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
                showNotification('Iltimos, to\'g\'ri karta raqamini kiriting', 'warning');
                document.getElementById('cardNumber').focus();
                return;
            }
            if (!cardExpiry || cardExpiry.length < 5) {
                showNotification('Iltimos, kartaning amal qilish muddatini kiriting', 'warning');
                document.getElementById('cardExpiry').focus();
                return;
            }
            if (!cardCvv || cardCvv.length < 3) {
                showNotification('Iltimos, CVV kodini kiriting', 'warning');
                document.getElementById('cardCvv').focus();
                return;
            }
        }
        
        // Place order
        placeOrder({
            fullName,
            phone,
            email,
            address,
            city,
            payment: payment.value,
            cardNumber: payment.value === 'card' ? cardNumber : null,
            notes: document.getElementById('notes').value.trim()
        });
    });
    
    // Format card number
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 16) value = value.slice(0, 16);
        let formatted = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += value[i];
        }
        this.value = formatted;
    });
    
    // Format expiry
    document.getElementById('cardExpiry').addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 4) value = value.slice(0, 4);
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        this.value = value;
    });
}

// ===== PLACE ORDER =====
function placeOrder(orderData) {
    const btn = document.getElementById('placeOrder');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buyurtma rasmiylashtirilmoqda...';
    
    // Simulate API call
    setTimeout(() => {
        // In production: API.orders.create(orderData)
        console.log('Order data:', orderData);
        
        // Clear cart
        Cart.clear();
        
        // Show success
        showNotification('Buyurtma muvaffaqiyatli rasmiylashtirildi! 🎉', 'success');
        
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Buyurtma qabul qilindi';
        btn.style.background = 'var(--success)';
        btn.style.borderColor = 'var(--success)';
        
        // Redirect after delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2500);
    }, 2000);
}

console.log('✅ Checkout Module loaded');