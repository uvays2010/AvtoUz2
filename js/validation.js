/* ========================================
   CAR-ENTERPRISE - VALIDATION MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initValidation();
});

// ===== VALIDATION CONFIG =====
const VALIDATION_CONFIG = {
    STORAGE_KEY: 'validation_rules',
    DEFAULT_MESSAGES: {
        required: 'Bu maydon to\'ldirilishi shart',
        email: 'Iltimos, to\'g\'ri email kiriting',
        phone: 'Iltimos, to\'g\'ri telefon raqam kiriting',
        min: 'Bu maydon kamida {min} belgi bo\'lishi kerak',
        max: 'Bu maydon ko\'pi bilan {max} belgi bo\'lishi kerak',
        minNumber: 'Bu maydon kamida {min} bo\'lishi kerak',
        maxNumber: 'Bu maydon ko\'pi bilan {max} bo\'lishi kerak',
        pattern: 'Bu maydon noto\'g\'ri formatda',
        match: 'Maydonlar mos kelmadi',
        unique: 'Bu qiymat allaqachon mavjud',
        url: 'Iltimos, to\'g\'ri URL kiriting',
        date: 'Iltimos, to\'g\'ri sana kiriting',
        number: 'Iltimos, son kiriting',
        integer: 'Iltimos, butun son kiriting',
        boolean: 'Iltimos, true yoki false tanlang'
    }
};

// ===== INIT VALIDATION =====
function initValidation() {
    // Auto-validate forms with data-validate attribute
    const forms = document.querySelectorAll('[data-validate]');
    forms.forEach(function(form) {
        initFormValidation(form);
    });
}

// ===== INIT FORM VALIDATION =====
function initFormValidation(form) {
    // Skip if already initialized
    if (form.dataset.validationInitialized) return;
    form.dataset.validationInitialized = 'true';
    
    // Real-time validation on input
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(function(input) {
        // Skip if already has validation
        if (input.dataset.validationAdded) return;
        input.dataset.validationAdded = 'true';
        
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Validate on input (with debounce)
        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                // Only validate if field has been touched
                if (this.dataset.touched === 'true') {
                    validateField(this);
                }
            }.bind(this), 300);
        });
        
        // Mark as touched
        input.addEventListener('focus', function() {
            this.dataset.touched = 'true';
        });
    });
    
    // Validate on submit
    form.addEventListener('submit', function(e) {
        const isValid = validateForm(this);
        if (!isValid) {
            e.preventDefault();
            // Focus first invalid field
            const firstInvalid = this.querySelector('.invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            showNotification('Iltimos, barcha xatoliklarni tuzating', 'warning');
        }
    });
}

// ===== VALIDATE FORM =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    
    inputs.forEach(function(input) {
        // Skip if no validation rules
        if (!input.dataset.validate) return;
        
        const fieldValid = validateField(input);
        if (!fieldValid) {
            isValid = false;
        }
    });
    
    return isValid;
}

// ===== VALIDATE FIELD =====
function validateField(input) {
    const rules = input.dataset.validate ? input.dataset.validate.split(' ') : [];
    const value = input.value;
    const errors = [];
    
    // Remove old validation state
    removeValidationState(input);
    
    // Skip validation if field is not required and empty
    if (!rules.includes('required') && !value) {
        return true;
    }
    
    // Check each rule
    rules.forEach(function(rule) {
        const [ruleName, ruleParam] = rule.split(':');
        
        switch (ruleName) {
            case 'required':
                if (!value || value.trim() === '') {
                    errors.push(getMessage('required'));
                }
                break;
                
            case 'email':
                if (value && !isValidEmail(value)) {
                    errors.push(getMessage('email'));
                }
                break;
                
            case 'phone':
                if (value && !isValidPhone(value)) {
                    errors.push(getMessage('phone'));
                }
                break;
                
            case 'min':
                if (value && value.length < parseInt(ruleParam)) {
                    errors.push(getMessage('min').replace('{min}', ruleParam));
                }
                break;
                
            case 'max':
                if (value && value.length > parseInt(ruleParam)) {
                    errors.push(getMessage('max').replace('{max}', ruleParam));
                }
                break;
                
            case 'minNumber':
                if (value && parseFloat(value) < parseFloat(ruleParam)) {
                    errors.push(getMessage('minNumber').replace('{min}', ruleParam));
                }
                break;
                
            case 'maxNumber':
                if (value && parseFloat(value) > parseFloat(ruleParam)) {
                    errors.push(getMessage('maxNumber').replace('{max}', ruleParam));
                }
                break;
                
            case 'pattern':
                if (value && !new RegExp(ruleParam).test(value)) {
                    errors.push(getMessage('pattern'));
                }
                break;
                
            case 'match':
                const matchField = document.getElementById(ruleParam);
                if (matchField && value !== matchField.value) {
                    errors.push(getMessage('match'));
                }
                break;
                
            case 'url':
                if (value && !isValidUrl(value)) {
                    errors.push(getMessage('url'));
                }
                break;
                
            case 'date':
                if (value && !isValidDate(value)) {
                    errors.push(getMessage('date'));
                }
                break;
                
            case 'number':
                if (value && isNaN(parseFloat(value))) {
                    errors.push(getMessage('number'));
                }
                break;
                
            case 'integer':
                if (value && !Number.isInteger(parseFloat(value))) {
                    errors.push(getMessage('integer'));
                }
                break;
        }
    });
    
    // Update validation state
    if (errors.length > 0) {
        setValidationError(input, errors);
        return false;
    } else {
        setValidationSuccess(input);
        return true;
    }
}

// ===== SET VALIDATION ERROR =====
function setValidationError(input, errors) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    input.setAttribute('aria-invalid', 'true');
    
    // Find or create error message element
    let errorEl = input.parentElement.querySelector('.validation-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'validation-error';
        input.parentElement.appendChild(errorEl);
    }
    
    errorEl.textContent = errors.join('. ');
    errorEl.style.display = 'block';
    
    // Add error class to parent
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('has-error');
        formGroup.classList.remove('has-success');
    }
}

// ===== SET VALIDATION SUCCESS =====
function setValidationSuccess(input) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    input.removeAttribute('aria-invalid');
    
    // Remove error message
    const errorEl = input.parentElement.querySelector('.validation-error');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
    
    // Update parent
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error');
        formGroup.classList.add('has-success');
    }
}

// ===== REMOVE VALIDATION STATE =====
function removeValidationState(input) {
    input.classList.remove('invalid', 'valid');
    input.removeAttribute('aria-invalid');
    
    const errorEl = input.parentElement.querySelector('.validation-error');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
    
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.classList.remove('has-error', 'has-success');
    }
}

// ===== GET MESSAGE =====
function getMessage(key) {
    return VALIDATION_CONFIG.DEFAULT_MESSAGES[key] || 'Xatolik yuz berdi';
}

// ===== VALIDATION FUNCTIONS =====

/**
 * Validate email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone (Uzbekistan format)
 */
function isValidPhone(phone) {
    const re = /^\+998[0-9]{9}$/;
    return re.test(phone.replace(/\s/g, ''));
}

/**
 * Validate URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate date
 */
function isValidDate(date) {
    const d = new Date(date);
    return !isNaN(d.getTime());
}

/**
 * Validate number
 */
function isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Validate integer
 */
function isValidInteger(value) {
    return Number.isInteger(parseFloat(value));
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
    let score = 0;
    const checks = {
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => {
        if (check) score++;
    });
    
    return {
        score: score,
        checks: checks,
        strong: score >= 4,
        medium: score >= 3,
        weak: score < 3
    };
}

/**
 * Validate username
 */
function isValidUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
}

/**
 * Validate name
 */
function isValidName(name) {
    return name.length >= 2 && name.length <= 50;
}

/**
 * Validate password match
 */
function passwordsMatch(password, confirmPassword) {
    return password === confirmPassword;
}

// ===== EXPOSE GLOBALLY =====
window.validateField = validateField;
window.validateForm = validateForm;
window.isValidEmail = isValidEmail;
window.isValidPhone = isValidPhone;
window.isValidUrl = isValidUrl;
window.isValidDate = isValidDate;
window.isValidNumber = isValidNumber;
window.isValidInteger = isValidInteger;
window.validatePasswordStrength = validatePasswordStrength;
window.isValidUsername = isValidUsername;
window.isValidName = isValidName;
window.passwordsMatch = passwordsMatch;

console.log('✅ Validation Module loaded successfully');