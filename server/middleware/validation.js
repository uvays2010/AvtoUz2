/* ========================================
   CAR-ENTERPRISE - VALIDATION MIDDLEWARE
   ======================================== */

const { validationResult } = require('express-validator');

// ===== VALIDATE REQUEST =====
function validateRequest(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }

    next();
}

// ===== SANITIZE INPUT =====
function sanitizeInput(req, res, next) {
    // Sanitize body
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        });
    }

    // Sanitize query
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (typeof req.query[key] === 'string') {
                req.query[key] = req.query[key].trim();
            }
        });
    }

    next();
}

// ===== VALIDATE ID =====
function validateId(req, res, next) {
    const id = req.params.id || req.params.userId || req.params.carId;
    
    if (id && !/^\d+$/.test(id)) {
        return res.status(400).json({
            success: false,
            message: 'ID noto\'g\'ri formatda'
        });
    }

    next();
}

// ===== VALIDATE EMAIL =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== VALIDATE PHONE =====
function validatePhone(phone) {
    const re = /^\+998[0-9]{9}$/;
    return re.test(phone);
}

// ===== VALIDATE PASSWORD =====
function validatePassword(password) {
    return password.length >= 6;
}

// ===== VALIDATE NAME =====
function validateName(name) {
    return name.length >= 2 && name.length <= 50;
}

// ===== VALIDATE URL =====
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ===== VALIDATE DATE =====
function validateDate(date) {
    return !isNaN(new Date(date).getTime());
}

// ===== VALIDATE NUMBER =====
function validateNumber(value, min = 0, max = Infinity) {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
}

// ===== VALIDATE ARRAY =====
function validateArray(value, minLength = 0, maxLength = Infinity) {
    return Array.isArray(value) && 
           value.length >= minLength && 
           value.length <= maxLength;
}

// ===== VALIDATE OBJECT =====
function validateObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ===== VALIDATE BOOLEAN =====
function validateBoolean(value) {
    return typeof value === 'boolean' || value === 'true' || value === 'false';
}

// ===== EXPORTS =====
module.exports = {
    validateRequest,
    sanitizeInput,
    validateId,
    validateEmail,
    validatePhone,
    validatePassword,
    validateName,
    validateUrl,
    validateDate,
    validateNumber,
    validateArray,
    validateObject,
    validateBoolean
};