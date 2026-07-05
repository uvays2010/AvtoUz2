/* ========================================
   CAR-ENTERPRISE - ORDERS ROUTES (UPDATED)
   ======================================== */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');

// ===== MOCK DATA =====
let orders = [
    {
        id: 1001,
        userId: 1,
        items: [
            { carId: 1, name: 'BMW X5', quantity: 1, price: 85000000 }
        ],
        subtotal: 85000000,
        tax: 10200000,
        shipping: 0,
        discount: 0,
        total: 95200000,
        status: 'delivered',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        address: 'Toshkent, Chilonzor 15',
        city: 'Toshkent',
        zipCode: '100000',
        phone: '+998 90 123 45 67',
        email: 'admin@car-enterprise.uz',
        fullName: 'Admin',
        notes: '',
        trackingNumber: 'TRK-001',
        deliveredAt: '2026-01-20T10:00:00Z',
        cancelledAt: null,
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-20T10:00:00Z'
    },
    {
        id: 1002,
        userId: 2,
        items: [
            { carId: 2, name: 'Mercedes S-Class', quantity: 1, price: 120000000 }
        ],
        subtotal: 120000000,
        tax: 14400000,
        shipping: 0,
        discount: 0,
        total: 134400000,
        status: 'processing',
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        address: 'Toshkent, Yunusobod 7',
        city: 'Toshkent',
        zipCode: '100000',
        phone: '+998 90 123 45 67',
        email: 'alisher@example.com',
        fullName: 'Alisher Karimov',
        notes: 'Ertaga yetkazib bering',
        trackingNumber: '',
        deliveredAt: null,
        cancelledAt: null,
        createdAt: '2026-01-10T10:00:00Z',
        updatedAt: '2026-01-12T10:00:00Z'
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

// Get all orders (Admin only)
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    const orderList = orders.map(order => {
        const orderObj = new Order(order);
        return orderObj.getSummary();
    });
    
    res.json({
        success: true,
        data: orderList
    });
});

// Get user orders
router.get('/user/:userId', authMiddleware, (req, res) => {
    const userId = parseInt(req.params.userId);
    
    if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Ruxsat yo\'q'
        });
    }

    const userOrders = orders
        .filter(order => order.userId === userId)
        .map(order => {
            const orderObj = new Order(order);
            return orderObj.getSummary();
        });
    
    res.json({
        success: true,
        data: userOrders
    });
});

// Get single order
router.get('/:id', authMiddleware, (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    
    if (!order) {
        return res.status(404).json({
            success: false,
            message: 'Buyurtma topilmadi'
        });
    }

    if (req.user.id !== order.userId && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Ruxsat yo\'q'
        });
    }

    const orderObj = new Order(order);
    res.json({
        success: true,
        data: orderObj.getDetails()
    });
});

// Create order
router.post('/', authMiddleware, [
    body('items').isArray({ min: 1 }).withMessage('Mahsulotlar ro\'yxati kiritilishi shart'),
    body('items.*.carId').isInt().withMessage('Mashina ID si noto\'g\'ri'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Soni noto\'g\'ri'),
    body('items.*.name').notEmpty().withMessage('Mahsulot nomi kiritilishi shart'),
    body('items.*.price').isInt({ min: 0 }).withMessage('Narx noto\'g\'ri'),
    body('paymentMethod').notEmpty().withMessage('To\'lov usuli kiritilishi shart'),
    body('address').notEmpty().withMessage('Manzil kiritilishi shart'),
    body('city').notEmpty().withMessage('Shahar kiritilishi shart'),
    body('fullName').notEmpty().withMessage('Ism va familiya kiritilishi shart'),
    body('phone').notEmpty().withMessage('Telefon raqam kiritilishi shart'),
    body('email').isEmail().withMessage('Email noto\'g\'ri')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { items, paymentMethod, address, city, zipCode, phone, email, fullName, notes } = req.body;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const tax = Math.round(subtotal * 0.12);
    const shipping = subtotal > 10000000 ? 0 : 0;
    const total = subtotal + tax + shipping;

    const newOrderData = {
        id: orders.length + 1001,
        userId: req.user.id,
        items,
        subtotal,
        tax,
        shipping,
        discount: 0,
        total,
        status: 'pending',
        paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
        address,
        city,
        zipCode: zipCode || '',
        phone,
        email,
        fullName,
        notes: notes || '',
        trackingNumber: '',
        deliveredAt: null,
        cancelledAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    const newOrder = new Order(newOrderData);
    orders.push(newOrderData);

    res.status(201).json({
        success: true,
        message: 'Buyurtma muvaffaqiyatli rasmiylashtirildi!',
        data: newOrder.getDetails()
    });
});

// Update order status (Admin only)
router.put('/:id/status', authMiddleware, adminMiddleware, [
    body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
        .withMessage('Status noto\'g\'ri')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (orderIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Buyurtma topilmadi'
        });
    }

    const { status } = req.body;
    const order = orders[orderIndex];
    
    // Update status
    order.status = status;
    order.updatedAt = new Date().toISOString();

    // Set special dates
    if (status === 'delivered') {
        order.deliveredAt = new Date().toISOString();
        order.paymentStatus = 'paid';
    }

    if (status === 'cancelled') {
        order.cancelledAt = new Date().toISOString();
        order.paymentStatus = 'refunded';
    }

    const updatedOrder = new Order(order);
    res.json({
        success: true,
        message: 'Buyurtma statusi yangilandi!',
        data: updatedOrder.getDetails()
    });
});

// Update payment status (Admin only)
router.put('/:id/payment', authMiddleware, adminMiddleware, [
    body('paymentStatus').isIn(['pending', 'paid', 'failed', 'refunded'])
        .withMessage('To\'lov statusi noto\'g\'ri')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (orderIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Buyurtma topilmadi'
        });
    }

    orders[orderIndex].paymentStatus = req.body.paymentStatus;
    orders[orderIndex].updatedAt = new Date().toISOString();

    const updatedOrder = new Order(orders[orderIndex]);
    res.json({
        success: true,
        message: 'To\'lov statusi yangilandi!',
        data: updatedOrder.getDetails()
    });
});

// Cancel order
router.put('/:id/cancel', authMiddleware, (req, res) => {
    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (orderIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Buyurtma topilmadi'
        });
    }

    const order = orders[orderIndex];

    if (req.user.id !== order.userId && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Ruxsat yo\'q'
        });
    }

    if (!['pending', 'processing'].includes(order.status)) {
        return res.status(400).json({
            success: false,
            message: 'Bu buyurtmani bekor qilib bo\'lmaydi'
        });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date().toISOString();
    order.paymentStatus = 'refunded';
    order.updatedAt = new Date().toISOString();

    const cancelledOrder = new Order(order);
    res.json({
        success: true,
        message: 'Buyurtma bekor qilindi!',
        data: cancelledOrder.getDetails()
    });
});

// Add tracking number (Admin only)
router.put('/:id/tracking', authMiddleware, adminMiddleware, [
    body('trackingNumber').notEmpty().withMessage('Tracking raqam kiritilishi shart')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.id));
    
    if (orderIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Buyurtma topilmadi'
        });
    }

    orders[orderIndex].trackingNumber = req.body.trackingNumber;
    orders[orderIndex].updatedAt = new Date().toISOString();

    const updatedOrder = new Order(orders[orderIndex]);
    res.json({
        success: true,
        message: 'Tracking raqam qo\'shildi!',
        data: updatedOrder.getDetails()
    });
});

// Get order statistics (Admin only)
router.get('/stats', authMiddleware, adminMiddleware, (req, res) => {
    const totalOrders = orders.length;
    const totalRevenue = orders
        .filter(o => o.status === 'delivered' || o.status === 'processing')
        .reduce((sum, o) => sum + o.total, 0);
    
    const statusCounts = {};
    orders.forEach(o => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    res.json({
        success: true,
        data: {
            totalOrders,
            totalRevenue,
            statusCounts,
            averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
        }
    });
});

module.exports = router;