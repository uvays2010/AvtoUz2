/* ========================================
   CAR-ENTERPRISE - MAIN SERVER
   Version: 1.0.0
   ======================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// ===== INITIALIZE APP =====
const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5500',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '..')));

// ===== LOGGING =====
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ===== ROUTES =====
// API Routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const blogRoutes = require('./routes/blog');
const reviewRoutes = require('./routes/reviews');
const testimonialRoutes = require('./routes/testimonials');
const faqRoutes = require('./routes/faq');
const favoriteRoutes = require('./routes/favorites');

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/favorites', favoriteRoutes);

// ===== FRONTEND ROUTES =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/pages/*', (req, res) => {
    const page = req.params[0];
    res.sendFile(path.join(__dirname, '../pages', page));
});

// ===== 404 HANDLER =====
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../pages/404.html'));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server xatoligi',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ===== START SERVER =====
app.listen(PORT, () => {
    console.log(`🚀 Car Enterprise Server is running on http://localhost:${PORT}`);
    console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5500'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;