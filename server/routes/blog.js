/* ========================================
   CAR-ENTERPRISE - BLOG ROUTES
   ======================================== */

const express = require('express');
const router = express.Router();
const { body, query, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// ===== MOCK DATA =====
const blogPosts = [
    {
        id: 1,
        title: "2026 yilning eng yaxshi avtomobillari",
        excerpt: "Yangi yilda bozorda qanday avtomobillar eng yaxshi deb topildi? Biz 2026 yilning eng yaxshi avtomobillarini tanladik...",
        content: "To'liq maqola matni... 2026 yilda avtomobil bozori yangi modellar bilan boyidi...",
        category: "Yangiliklar",
        tags: ["avtomobillar", "2026", "yangiliklar"],
        image: "blog/car-2026.jpg",
        author: "Alisher Karimov",
        authorId: 1,
        date: "2026-01-15T10:00:00Z",
        comments: 24,
        views: 1250,
        status: 'published'
    },
    {
        id: 2,
        title: "Avtomobil sotib olishda 5 ta muhim maslahat",
        excerpt: "Avtomobil sotib olishdan oldin bilishingiz kerak bo'lgan 5 ta muhim maslahat...",
        content: "To'liq maqola matni... Avtomobil sotib olish - bu muhim qaror...",
        category: "Maslahatlar",
        tags: ["maslahatlar", "sotib olish", "qo'llanma"],
        image: "blog/car-buying-tips.jpg",
        author: "Dilnoza Abdullaeva",
        authorId: 2,
        date: "2026-01-10T10:00:00Z",
        comments: 18,
        views: 890,
        status: 'published'
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

// ===== ROUTES =====

// Get all posts
router.get('/', [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 50 }),
    query('category').optional().isString(),
    query('search').optional().isString()
], (req, res) => {
    let result = [...blogPosts];
    const { category, search, page = 1, limit = 9 } = req.query;

    // Filter by category
    if (category) {
        result = result.filter(post => post.category === category);
    }

    // Search
    if (search) {
        const query = search.toLowerCase();
        result = result.filter(post =>
            post.title.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }

    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

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

// Get single post
router.get('/:id', (req, res) => {
    const post = blogPosts.find(p => p.id === parseInt(req.params.id));
    
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Maqola topilmadi'
        });
    }

    // Increment views
    post.views += 1;

    res.json({
        success: true,
        data: post
    });
});

// Create post (Admin only)
router.post('/', authMiddleware, [
    body('title').notEmpty().withMessage('Sarlavha kiritilishi shart'),
    body('content').notEmpty().withMessage('Kontent kiritilishi shart'),
    body('category').notEmpty().withMessage('Kategoriya kiritilishi shart')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const newPost = {
        id: blogPosts.length + 1,
        ...req.body,
        author: req.user.name || 'Admin',
        authorId: req.user.id,
        date: new Date().toISOString(),
        comments: 0,
        views: 0,
        status: req.body.status || 'published'
    };

    blogPosts.push(newPost);

    res.status(201).json({
        success: true,
        message: 'Maqola muvaffaqiyatli yaratildi!',
        data: newPost
    });
});

// Update post (Admin only)
router.put('/:id', authMiddleware, (req, res) => {
    const postIndex = blogPosts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Maqola topilmadi'
        });
    }

    blogPosts[postIndex] = {
        ...blogPosts[postIndex],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: 'Maqola muvaffaqiyatli yangilandi!',
        data: blogPosts[postIndex]
    });
});

// Delete post (Admin only)
router.delete('/:id', authMiddleware, (req, res) => {
    const postIndex = blogPosts.findIndex(p => p.id === parseInt(req.params.id));
    
    if (postIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Maqola topilmadi'
        });
    }

    blogPosts.splice(postIndex, 1);

    res.json({
        success: true,
        message: 'Maqola muvaffaqiyatli o\'chirildi!'
    });
});

// Get categories
router.get('/categories', (req, res) => {
    const categories = [...new Set(blogPosts.map(post => post.category))];
    res.json({
        success: true,
        data: categories
    });
});

// Get tags
router.get('/tags', (req, res) => {
    const allTags = blogPosts.flatMap(post => post.tags);
    const tagCounts = {};
    allTags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    const tags = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    res.json({
        success: true,
        data: tags
    });
});

module.exports = router;