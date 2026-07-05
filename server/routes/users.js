/* ========================================
   CAR-ENTERPRISE - USERS ROUTES
   ======================================== */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// ===== MOCK DATA =====
const users = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@car-enterprise.uz',
        password: '$2a$10$X9y7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r',
        role: 'admin',
        phone: '+998 90 123 45 67',
        avatar: 'admin.jpg',
        joined: new Date().toISOString(),
        rating: 5.0,
        address: 'Toshkent, Chilonzor 15'
    },
    {
        id: 2,
        name: 'Alisher Karimov',
        email: 'alisher@example.com',
        password: '$2a$10$X9y7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r',
        role: 'user',
        phone: '+998 90 123 45 67',
        avatar: 'user1.jpg',
        joined: new Date().toISOString(),
        rating: 4.8,
        address: 'Toshkent, Yunusobod 7'
    }
];

// ===== MIDDLEWARE =====
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token topilmadi'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'car-enterprise-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token noto\'g\'ri'
        });
    }
}

function adminMiddleware(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Ruxsat yo\'q'
        });
    }
    next();
}

// ===== ROUTES =====

// Get all users (Admin only)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    const safeUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        joined: user.joined,
        rating: user.rating,
        address: user.address
    }));
    
    res.json({
        success: true,
        data: safeUsers
    });
});

// Get single user
router.get('/:id', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Foydalanuvchi topilmadi'
        });
    }

    // Check permission
    if (req.user.id !== user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Ruxsat yo\'q'
        });
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            joined: user.joined,
            rating: user.rating,
            address: user.address
        }
    });
});

// Update user
router.put('/:id', authMiddleware, [
    body('name').optional().notEmpty().withMessage('Ism kiritilishi shart'),
    body('phone').optional().isString(),
    body('address').optional().isString()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Foydalanuvchi topilmadi'
        });
    }

    // Check permission
    if (req.user.id !== users[userIndex].id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Ruxsat yo\'q'
        });
    }

    users[userIndex] = {
        ...users[userIndex],
        ...req.body
    };

    res.json({
        success: true,
        message: 'Profil muvaffaqiyatli yangilandi!',
        data: {
            id: users[userIndex].id,
            name: users[userIndex].name,
            email: users[userIndex].email,
            role: users[userIndex].role,
            phone: users[userIndex].phone,
            avatar: users[userIndex].avatar,
            joined: users[userIndex].joined,
            rating: users[userIndex].rating,
            address: users[userIndex].address
        }
    });
});

// Delete user (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    
    if (userIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Foydalanuvchi topilmadi'
        });
    }

    // Prevent deleting admin
    if (users[userIndex].role === 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Adminni o\'chirib bo\'lmaydi'
        });
    }

    users.splice(userIndex, 1);

    res.json({
        success: true,
        message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi!'
    });
});

// Get profile
router.get('/profile', authMiddleware, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Foydalanuvchi topilmadi'
        });
    }

    res.json({
        success: true,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            joined: user.joined,
            rating: user.rating,
            address: user.address
        }
    });
});

module.exports = router;