/* ========================================
   CAR-ENTERPRISE - CARS ROUTES
   ======================================== */

const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');

// ===== MOCK DATA =====
const cars = [
    {
        id: 1,
        brand: 'BMW',
        model: 'X5',
        year: 2024,
        price: 85000000,
        oldPrice: 92000000,
        category: 'SUV',
        fuelType: 'Dizel',
        transmission: 'Avtomat',
        engine: '3.0L',
        power: 286,
        color: 'Qora',
        mileage: 0,
        condition: 'Yangi',
        status: 'Aktiv',
        description: 'BMW X5 - hashamatli va kuchli SUV. Zamonaviy dizayn, yuqori sifatli interyer va kuchli dvigatel.',
        features: ['Parktronik', 'Kamera', 'Sunroof', 'Iqlim nazorati', 'Ksenon', 'Sensorlar'],
        images: ['cars/bmw-x5-1.jpg', 'cars/bmw-x5-2.jpg', 'cars/bmw-x5-3.jpg'],
        rating: 4.8,
        reviews: 156,
        isFeatured: true,
        isNew: true,
        createdAt: '2026-01-01T10:00:00Z'
    },
    {
        id: 2,
        brand: 'Mercedes-Benz',
        model: 'S-Class',
        year: 2024,
        price: 120000000,
        oldPrice: null,
        category: 'Sedan',
        fuelType: 'Benzin',
        transmission: 'Avtomat',
        engine: '4.0L',
        power: 503,
        color: 'Kumush',
        mileage: 0,
        condition: 'Yangi',
        status: 'Aktiv',
        description: 'Mercedes-Benz S-Class - eng hashamatli sedan. Har bir detali mukammal ishlangan.',
        features: ['MBUX', 'Massajli o\'rindiqlar', 'Burmester audio', 'Panorama', 'Autopilot'],
        images: ['cars/mercedes-s-class-1.jpg', 'cars/mercedes-s-class-2.jpg'],
        rating: 4.9,
        reviews: 89,
        isFeatured: true,
        isNew: true,
        createdAt: '2026-01-02T10:00:00Z'
    },
    {
        id: 3,
        brand: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 35000000,
        oldPrice: 38000000,
        category: 'Sedan',
        fuelType: 'Benzin',
        transmission: 'Avtomat',
        engine: '2.5L',
        power: 206,
        color: 'Oq',
        mileage: 15000,
        condition: 'Ishlatilgan',
        status: 'Aktiv',
        description: 'Toyota Camry - ishonchli va qulay sedan. Yaxshi iqtisod va yuqori sifat.',
        features: ['Toyota Safety Sense', 'Karplay', 'Kamera', 'Iqlim nazorati'],
        images: ['cars/toyota-camry-1.jpg', 'cars/toyota-camry-2.jpg'],
        rating: 4.7,
        reviews: 234,
        isFeatured: true,
        isNew: false,
        createdAt: '2026-01-03T10:00:00Z'
    }
];

// ===== ROUTES =====

// Get all cars
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('search').optional().isString(),
    query('brand').optional().isString(),
    query('category').optional().isString(),
    query('year').optional().isInt({ min: 1900, max: 2100 }),
    query('minPrice').optional().isInt({ min: 0 }),
    query('maxPrice').optional().isInt({ min: 0 }),
    query('sort').optional().isString()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    let result = [...cars];
    const {
        search,
        brand,
        category,
        year,
        minPrice,
        maxPrice,
        sort = 'newest',
        page = 1,
        limit = 12
    } = req.query;

    // Search
    if (search) {
        const query = search.toLowerCase();
        result = result.filter(car =>
            car.brand.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            car.category.toLowerCase().includes(query) ||
            car.year.toString().includes(query)
        );
    }

    // Brand
    if (brand) {
        result = result.filter(car => car.brand === brand);
    }

    // Category
    if (category) {
        result = result.filter(car => car.category === category);
    }

    // Year
    if (year) {
        result = result.filter(car => car.year === parseInt(year));
    }

    // Price range
    if (minPrice) {
        result = result.filter(car => car.price >= parseInt(minPrice));
    }
    if (maxPrice) {
        result = result.filter(car => car.price <= parseInt(maxPrice));
    }

    // Sort
    switch (sort) {
        case 'newest':
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'oldest':
            result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
        case 'price-low':
            result.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            result.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            result.sort((a, b) => b.rating - a.rating);
            break;
        default:
            result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Pagination
    const total = result.length;
    const start = (parseInt(page) - 1) * parseInt(limit);
    const end = start + parseInt(limit);
    const paginated = result.slice(start, end);

    res.json({
        success: true,
        data: paginated,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            totalPages: Math.ceil(total / parseInt(limit))
        }
    });
});

// Get featured cars
router.get('/featured', (req, res) => {
    const featured = cars.filter(car => car.isFeatured);
    res.json({
        success: true,
        data: featured
    });
});

// Get car brands
router.get('/brands', (req, res) => {
    const brands = [...new Set(cars.map(car => car.brand))];
    res.json({
        success: true,
        data: brands
    });
});

// Get car categories
router.get('/categories', (req, res) => {
    const categories = [...new Set(cars.map(car => car.category))];
    res.json({
        success: true,
        data: categories
    });
});

// Get single car
router.get('/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    
    if (!car) {
        return res.status(404).json({
            success: false,
            message: 'Mashina topilmadi'
        });
    }

    res.json({
        success: true,
        data: car
    });
});

// Create car (Admin only)
router.post('/', [
    body('brand').notEmpty().withMessage('Brend kiritilishi shart'),
    body('model').notEmpty().withMessage('Model kiritilishi shart'),
    body('year').isInt({ min: 1900, max: 2100 }).withMessage('Yil noto\'g\'ri'),
    body('price').isInt({ min: 0 }).withMessage('Narx noto\'g\'ri'),
    body('category').notEmpty().withMessage('Kategoriya kiritilishi shart'),
    body('fuelType').notEmpty().withMessage('Yoqilg\'i turi kiritilishi shart'),
    body('transmission').notEmpty().withMessage('Transmissiya kiritilishi shart'),
    body('engine').notEmpty().withMessage('Dvigatel kiritilishi shart'),
    body('power').isInt({ min: 0 }).withMessage('Quvvat noto\'g\'ri'),
    body('color').notEmpty().withMessage('Rang kiritilishi shart'),
    body('condition').notEmpty().withMessage('Holat kiritilishi shart'),
    body('description').notEmpty().withMessage('Tavsif kiritilishi shart')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const newCar = {
        id: cars.length + 1,
        ...req.body,
        mileage: req.body.mileage || 0,
        oldPrice: req.body.oldPrice || null,
        status: req.body.status || 'Aktiv',
        features: req.body.features || [],
        images: req.body.images || ['cars/default.jpg'],
        rating: 0,
        reviews: 0,
        isFeatured: req.body.isFeatured || false,
        isNew: req.body.condition === 'Yangi',
        createdAt: new Date().toISOString()
    };

    cars.push(newCar);

    res.status(201).json({
        success: true,
        message: 'Mashina muvaffaqiyatli qo\'shildi!',
        data: newCar
    });
});

// Update car (Admin only)
router.put('/:id', [
    body('brand').optional().notEmpty().withMessage('Brend kiritilishi shart'),
    body('model').optional().notEmpty().withMessage('Model kiritilishi shart'),
    body('year').optional().isInt({ min: 1900, max: 2100 }).withMessage('Yil noto\'g\'ri'),
    body('price').optional().isInt({ min: 0 }).withMessage('Narx noto\'g\'ri')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const carIndex = cars.findIndex(c => c.id === parseInt(req.params.id));
    
    if (carIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Mashina topilmadi'
        });
    }

    cars[carIndex] = {
        ...cars[carIndex],
        ...req.body,
        isNew: req.body.condition === 'Yangi' || cars[carIndex].isNew
    };

    res.json({
        success: true,
        message: 'Mashina muvaffaqiyatli yangilandi!',
        data: cars[carIndex]
    });
});

// Delete car (Admin only)
router.delete('/:id', (req, res) => {
    const carIndex = cars.findIndex(c => c.id === parseInt(req.params.id));
    
    if (carIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Mashina topilmadi'
        });
    }

    cars.splice(carIndex, 1);

    res.json({
        success: true,
        message: 'Mashina muvaffaqiyatli o\'chirildi!'
    });
});

module.exports = router;