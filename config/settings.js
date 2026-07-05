/* ========================================
   CAR-ENTERPRISE - SETTINGS
   ======================================== */

// ===== APP SETTINGS =====
const APP_SETTINGS = {
    // General
    name: 'Car Enterprise',
    description: 'Premium avtomobillar sayti',
    keywords: 'avtomobillar, premium, car enterprise',
    author: 'Car Enterprise Team',
    year: new Date().getFullYear(),
    
    // Contact
    email: 'info@car-enterprise.uz',
    phone: '+998 90 123 45 67',
    address: 'Toshkent, Amir Temur ko\'chasi, 15-uy',
    
    // Social Media
    social: {
        facebook: 'https://facebook.com/carenterprise',
        instagram: 'https://instagram.com/carenterprise',
        youtube: 'https://youtube.com/carenterprise',
        telegram: 'https://t.me/carenterprise',
        whatsapp: 'https://wa.me/998901234567',
        linkedin: 'https://linkedin.com/company/carenterprise'
    },
    
    // SEO
    seo: {
        title: 'Car Enterprise - Premium Avtomobillar',
        description: 'Eng sifatli avtomobillar, premium xizmat va ajoyib narxlar. Car Enterprise bilan hayotingizni o\'zgartiring.',
        keywords: 'avtomobillar, mashinalar, premium, car enterprise, yangi mashinalar',
        ogImage: '/images/og-image.jpg',
        ogType: 'website',
        twitterCard: 'summary_large_image'
    }
};

// ===== FEATURE SETTINGS =====
const FEATURE_SETTINGS = {
    // Auth
    auth: {
        enableRegistration: true,
        enableSocialLogin: true,
        requireEmailVerification: true,
        requirePhoneVerification: false,
        passwordMinLength: 6,
        sessionTimeout: 3600 // seconds
    },
    
    // Shopping
    shopping: {
        enableCart: true,
        enableCheckout: true,
        enableDiscounts: true,
        enableCoupons: true,
        minOrderAmount: 0,
        maxOrderAmount: 100000000
    },
    
    // Shipping
    shipping: {
        enabled: true,
        freeShippingThreshold: 10000000,
        standardCost: 0,
        expressCost: 500000,
        deliveryDays: 3
    },
    
    // Payment
    payment: {
        enabled: true,
        methods: ['card', 'cash', 'bank'],
        currencies: ['UZS'],
        defaultCurrency: 'UZS',
        taxRate: 12
    },
    
    // Cars
    cars: {
        enableReviews: true,
        enableFavorites: true,
        enableCompare: true,
        itemsPerPage: 12,
        maxImages: 10
    },
    
    // Blog
    blog: {
        enabled: true,
        enableComments: true,
        postsPerPage: 9,
        maxTags: 10
    },
    
    // Gallery
    gallery: {
        enabled: true,
        itemsPerPage: 24,
        maxUploadSize: 5242880 // 5MB
    }
};

// ===== SECURITY SETTINGS =====
const SECURITY_SETTINGS = {
    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'car-enterprise-secret-key',
        expiresIn: '7d',
        refreshExpiresIn: '30d'
    },
    
    // CORS
    cors: {
        enabled: true,
        origins: ['http://localhost:3000', 'https://car-enterprise.uz'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    
    // Rate Limiting
    rateLimit: {
        enabled: true,
        windowMs: 60000, // 1 minute
        maxRequests: 100,
        maxLoginAttempts: 5
    },
    
    // XSS Protection
    xss: {
        enabled: true,
        sanitize: true
    },
    
    // CSRF
    csrf: {
        enabled: true,
        cookie: true,
        header: 'X-CSRF-Token'
    }
};

// ===== ENVIRONMENT SETTINGS =====
const ENV_SETTINGS = {
    development: {
        debug: true,
        logging: true,
        apiUrl: 'http://localhost:3000',
        clientUrl: 'http://localhost:5500',
        email: {
            enabled: false,
            provider: 'smtp',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false
        }
    },
    
    production: {
        debug: false,
        logging: true,
        apiUrl: process.env.API_URL || 'https://api.car-enterprise.uz',
        clientUrl: process.env.CLIENT_URL || 'https://car-enterprise.uz',
        email: {
            enabled: true,
            provider: 'smtp',
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    },
    
    test: {
        debug: true,
        logging: false,
        apiUrl: 'http://localhost:3001',
        clientUrl: 'http://localhost:5501',
        email: {
            enabled: false,
            provider: 'smtp',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false
        }
    }
};

// ===== I18N SETTINGS =====
const I18N_SETTINGS = {
    defaultLanguage: 'uz',
    supportedLanguages: ['uz', 'ru', 'en'],
    fallbackLanguage: 'uz',
    translationsPath: './locales'
};

// ===== CACHE SETTINGS =====
const CACHE_SETTINGS = {
    enabled: true,
    ttl: 3600, // 1 hour
    maxSize: 100,
    redis: {
        host: 'localhost',
        port: 6379,
        password: ''
    }
};

// ===== LOGGING SETTINGS =====
const LOGGING_SETTINGS = {
    level: 'info',
    format: 'json',
    output: 'console',
    file: {
        path: './logs',
        maxSize: '10m',
        maxFiles: 5
    }
};

// ===== GET ENV SETTINGS =====
function getEnvSettings(env = 'development') {
    return ENV_SETTINGS[env] || ENV_SETTINGS.development;
}

// ===== GET APP SETTINGS =====
function getAppSettings() {
    return APP_SETTINGS;
}

// ===== GET FEATURE SETTINGS =====
function getFeatureSettings() {
    return FEATURE_SETTINGS;
}

// ===== GET SECURITY SETTINGS =====
function getSecuritySettings() {
    return SECURITY_SETTINGS;
}

// ===== EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP_SETTINGS,
        FEATURE_SETTINGS,
        SECURITY_SETTINGS,
        ENV_SETTINGS,
        I18N_SETTINGS,
        CACHE_SETTINGS,
        LOGGING_SETTINGS,
        getEnvSettings,
        getAppSettings,
        getFeatureSettings,
        getSecuritySettings
    };
}

if (typeof window !== 'undefined') {
    window.APP_SETTINGS = APP_SETTINGS;
    window.FEATURE_SETTINGS = FEATURE_SETTINGS;
    window.SECURITY_SETTINGS = SECURITY_SETTINGS;
    window.ENV_SETTINGS = ENV_SETTINGS;
    window.I18N_SETTINGS = I18N_SETTINGS;
    window.getEnvSettings = getEnvSettings;
    window.getAppSettings = getAppSettings;
}