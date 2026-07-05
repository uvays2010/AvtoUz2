document.addEventListener('DOMContentLoaded', function () {
    // Check if on auth page
    if (!document.querySelector('.auth-page')) return;

    initAuth();
});

// ===== INIT AUTH =====
function initAuth() {
    const form = document.querySelector('.auth-form');
    if (!form) return;

    const formType = form.id === 'loginForm' ? 'login' : 'register';

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (formType === 'login') {
            handleLogin();
        } else {
            handleRegister();
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            validateField(this);
        });
        input.addEventListener('input', function () {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// ===== HANDLE LOGIN =====
async function handleLogin() {
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const remember = document.getElementById('rememberMe');
    const submitBtn = document.querySelector('.submit-btn');

    // Validate
    if (!validateField(email) || !validateField(password)) {
        return;
    }

    // Show loading
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kutilmoqda...';

    try {
        // In production: await API.auth.login(email.value, password.value)
        // Demo: simulate login
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock user data
        const user = {
            id: 1,
            name: 'Alisher Karimov',
            email: email.value,
            phone: '+998 90 123 45 67',
            joined: new Date().toISOString(),
            rating: 4.8
        };

        // Save auth token
        localStorage.setItem('authToken', 'mock-token-123456');
        localStorage.setItem('user', JSON.stringify(user));

        showNotification('Tizimga muvaffaqiyatli kirdingiz! 🎉', 'success');

        // Redirect
        const redirect = getUrlParams().redirect || 'dashboard.html';
        setTimeout(() => {
            window.location.href = redirect;
        }, 1000);

    } catch (error) {
        showNotification(error.message || 'Kirishda xatolik yuz berdi', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ===== HANDLE REGISTER =====
async function handleRegister() {
    const name = document.getElementById('registerName');
    const email = document.getElementById('registerEmail');
    const password = document.getElementById('registerPassword');
    const confirm = document.getElementById('registerConfirm');
    const terms = document.getElementById('registerTerms');
    const submitBtn = document.querySelector('.submit-btn');

    // Validate
    if (!validateField(name) || !validateField(email) || !validateField(password) || !validateField(confirm)) {
        return;
    }

    // Check password match
    if (password.value !== confirm.value) {
        showNotification('Parollar mos kelmadi', 'warning');
        confirm.classList.add('error');
        confirm.focus();
        return;
    }

    // Check terms
    if (!terms.checked) {
        showNotification('Iltimos, shartlarni qabul qiling', 'warning');
        return;
    }

    // Show loading
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kutilmoqda...';

    try {
        // In production: await API.auth.register({ name, email, password })
        await new Promise(resolve => setTimeout(resolve, 1500));

        const user = {
            id: 1,
            name: name.value,
            email: email.value,
            phone: '',
            joined: new Date().toISOString(),
            rating: 0
        };

        localStorage.setItem('authToken', 'mock-token-123456');
        localStorage.setItem('user', JSON.stringify(user));

        showNotification('Ro\'yxatdan muvaffaqiyatli o\'tdingiz! 🎉', 'success');

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);

    } catch (error) {
        showNotification(error.message || 'Ro\'yxatdan o\'tishda xatolik', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// ===== VALIDATE FIELD =====
function validateField(input) {
    const errorEl = input.closest('.form-group').querySelector('.error-message');
    let isValid = true;

    // Remove old error
    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('show');

    // Check if empty
    if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        if (errorEl) {
            errorEl.textContent = 'Bu maydon to\'ldirilishi shart';
            errorEl.classList.add('show');
        }
        return false;
    }

    // Email validation
    if (input.type === 'email' && input.value.trim()) {
        if (!isValidEmail(input.value)) {
            isValid = false;
            input.classList.add('error');
            if (errorEl) {
                errorEl.textContent = 'Iltimos, to\'g\'ri email kiriting';
                errorEl.classList.add('show');
            }
            return false;
        }
    }

    // Password validation
    if (input.id === 'loginPassword' || input.id === 'registerPassword') {
        if (input.value.length > 0 && input.value.length < 6) {
            isValid = false;
            input.classList.add('error');
            if (errorEl) {
                errorEl.textContent = 'Parol kamida 6 belgi bo\'lishi kerak';
                errorEl.classList.add('show');
            }
            return false;
        }
    }

    // Name validation
    if (input.id === 'registerName' && input.value.trim()) {
        if (input.value.trim().length < 2) {
            isValid = false;
            input.classList.add('error');
            if (errorEl) {
                errorEl.textContent = 'Ism kamida 2 harf bo\'lishi kerak';
                errorEl.classList.add('show');
            }
            return false;
        }
    }

    return isValid;
}

// ===== TOGGLE PASSWORD =====
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// ===== EXPOSE =====
window.togglePassword = togglePassword;

console.log('✅ Auth Module loaded');

// Auth.js ga qo'shimcha - Register validation

document.addEventListener('DOMContentLoaded', function () {
    // Register form validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('registerName');
            const email = document.getElementById('registerEmail');
            const password = document.getElementById('registerPassword');
            const confirm = document.getElementById('registerConfirm');
            const terms = document.getElementById('registerTerms');

            // Validate name
            if (name.value.trim().length < 2) {
                showNotification('Ism kamida 2 harf bo\'lishi kerak', 'warning');
                name.focus();
                return;
            }

            // Validate email
            if (!isValidEmail(email.value)) {
                showNotification('Iltimos, to\'g\'ri email kiriting', 'warning');
                email.focus();
                return;
            }

            // Validate password
            if (password.value.length < 6) {
                showNotification('Parol kamida 6 belgi bo\'lishi kerak', 'warning');
                password.focus();
                return;
            }

            // Validate confirm password
            if (password.value !== confirm.value) {
                showNotification('Parollar mos kelmadi', 'warning');
                confirm.focus();
                return;
            }

            // Validate terms
            if (!terms.checked) {
                showNotification('Iltimos, shartlarni qabul qiling', 'warning');
                return;
            }

            // In production: API.auth.register()
            showNotification('Ro\'yxatdan o\'tdingiz! Xush kelibsiz! 🎉', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        });
    }
});

// Toggle password visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

window.togglePassword = togglePassword;