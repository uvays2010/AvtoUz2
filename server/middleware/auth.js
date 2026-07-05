/* ========================================
   CAR-ENTERPRISE - AUTH MIDDLEWARE
   ======================================== */

const jwt = require('jsonwebtoken');

// ===== VERIFY TOKEN =====
function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token topilmadi. Iltimos, tizimga kiring.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'car-enterprise-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token muddati tugagan. Iltimos, qayta kiring.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Token noto\'g\'ri. Iltimos, qayta kiring.'
        });
    }
}

// ===== CHECK ROLE =====
function checkRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Token topilmadi'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Ruxsat yo\'q. Bu amalni bajarish uchun yetarli huquqlaringiz yo\'q.'
            });
        }

        next();
    };
}

// ===== CHECK OWNERSHIP =====
function checkOwnership(getResourceId) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Token topilmadi'
            });
        }

        const resourceId = getResourceId(req);
        
        // Admin can access everything
        if (req.user.role === 'admin') {
            return next();
        }

        // Check if user owns the resource
        if (req.user.id !== resourceId) {
            return res.status(403).json({
                success: false,
                message: 'Ruxsat yo\'q. Bu resurs sizga tegishli emas.'
            });
        }

        next();
    };
}

// ===== RATE LIMIT =====
const rateLimit = {};

function rateLimitMiddleware(maxRequests = 100, windowMs = 60000) {
    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        
        if (!rateLimit[key]) {
            rateLimit[key] = {
                count: 0,
                resetTime: now + windowMs
            };
        }

        const limit = rateLimit[key];

        // Reset if window expired
        if (now > limit.resetTime) {
            limit.count = 0;
            limit.resetTime = now + windowMs;
        }

        limit.count++;

        if (limit.count > maxRequests) {
            return res.status(429).json({
                success: false,
                message: 'Juda ko\'p so\'rov yuborildi. Iltimos, birozdan keyin qayta urinib ko\'ring.'
            });
        }

        next();
    };
}

// ===== EXPORTS =====
module.exports = {
    verifyToken,
    checkRole,
    checkOwnership,
    rateLimitMiddleware
};