/* ========================================
   CAR-ENTERPRISE - AUTH ROUTES
   ======================================== */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ===== MOCK DATA =====
const users = [
    {
        id: 1,
        name: 'Admin',
        email: 'admin@car-enterprise.uz',
        password: '$2a$10$X9y7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r', // admin123
        role: 'admin',
        phone: '+998 90 123 45 67',
        avatar: 'admin.jpg',
        joined: new Date().toISOString(),
        rating: 5.0
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
        rating: 4.8
    }
];

// ===== HELPERS =====
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'car-enterprise-secret-key',
        { expiresIn: '7d' }
    );
}

function hashPassword(password) {
    return bcrypt.hashSync(password, 10);
}

function comparePassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// ===== ROUTES =====

// Register
router.post('/register', [
    body('name').notEmpty().withMessage('Ism kiritilishi shart'),
    body('email').isEmail().withMessage('Email noto\'g\'ri'),
    body('password').isLength({ min: 6 }).withMessage('Parol kamida 6 belgi bo\'lishi kerak')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({
            success: false,
            message: 'Bu email allaqachon ro\'yxatdan o\'tgan'
        });
    }

    // Create user
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashPassword(password),
        role: 'user',
        phone: '',
        avatar: 'default.jpg',
        joined: new Date().toISOString(),
        rating: 0
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({
        success: true,
        message: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz!',
        token,
        user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone,
            avatar: newUser.avatar,
            joined: newUser.joined,
            rating: newUser.rating
        }
    });
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Email noto\'g\'ri'),
    body('password').notEmpty().withMessage('Parol kiritilishi shart')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Email yoki parol noto\'g\'ri'
        });
    }

    // Check password
    if (!comparePassword(password, user.password)) {
        return res.status(401).json({
            success: false,
            message: 'Email yoki parol noto\'g\'ri'
        });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
        success: true,
        message: 'Tizimga muvaffaqiyatli kirdingiz!',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            avatar: user.avatar,
            joined: user.joined,
            rating: user.rating
        }
    });
});

// Logout
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Tizimdan chiqdingiz'
    });
});

// Get current user
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token topilmadi'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'car-enterprise-secret-key');
        const user = users.find(u => u.id === decoded.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Foydalanuvchi topilmadi'
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                avatar: user.avatar,
                joined: user.joined,
                rating: user.rating
            }
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token noto\'g\'ri'
        });
    }
});

// Change password
router.put('/change-password', [
    body('currentPassword').notEmpty().withMessage('Joriy parol kiritilishi shart'),
    body('newPassword').isLength({ min: 6 }).withMessage('Yangi parol kamida 6 belgi bo\'lishi kerak')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token topilmadi'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'car-enterprise-secret-key');
        const user = users.find(u => u.id === decoded.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Foydalanuvchi topilmadi'
            });
        }

        const { currentPassword, newPassword } = req.body;

        if (!comparePassword(currentPassword, user.password)) {
            return res.status(400).json({
                success: false,
                message: 'Joriy parol noto\'g\'ri'
            });
        }

        user.password = hashPassword(newPassword);

        res.json({
            success: true,
            message: 'Parol muvaffaqiyatli o\'zgartirildi!'
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token noto\'g\'ri'
        });
    }
});

// Forgot password
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Email noto\'g\'ri')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Bu email bilan ro\'yxatdan o\'tgan foydalanuvchi topilmadi'
        });
    }

    // In production: send reset email
    res.json({
        success: true,
        message: 'Parolni tiklash havolasi email manzilingizga yuborildi'
    });
});

module.exports = router;