/* ========================================
   CAR-ENTERPRISE - DATABASE CONFIG
   ======================================== */

// ===== DATABASE CONFIGURATION =====
const DB_CONFIG = {
    // Development
    development: {
        host: 'localhost',
        port: 27017,
        name: 'car_enterprise',
        username: '',
        password: '',
        dialect: 'mongodb',
        logging: true
    },
    
    // Production
    production: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 27017,
        name: process.env.DB_NAME || 'car_enterprise',
        username: process.env.DB_USER || '',
        password: process.env.DB_PASS || '',
        dialect: process.env.DB_DIALECT || 'mongodb',
        logging: false
    },
    
    // Testing
    test: {
        host: 'localhost',
        port: 27017,
        name: 'car_enterprise_test',
        username: '',
        password: '',
        dialect: 'mongodb',
        logging: false
    }
};

// ===== DATABASE MODELS =====
const DB_MODELS = {
    USER: 'User',
    CAR: 'Car',
    ORDER: 'Order',
    REVIEW: 'Review',
    FAVORITE: 'Favorite',
    CATEGORY: 'Category',
    BRAND: 'Brand',
    BLOG_POST: 'BlogPost'
};

// ===== DATABASE COLLECTIONS =====
const DB_COLLECTIONS = {
    USERS: 'users',
    CARS: 'cars',
    ORDERS: 'orders',
    REVIEWS: 'reviews',
    FAVORITES: 'favorites',
    CATEGORIES: 'categories',
    BRANDS: 'brands',
    BLOG_POSTS: 'blog_posts',
    TESTIMONIALS: 'testimonials',
    FAQ: 'faq',
    SETTINGS: 'settings'
};

// ===== DATABASE INDEXES =====
const DB_INDEXES = {
    USERS: [
        { field: 'email', unique: true },
        { field: 'phone', sparse: true },
        { field: 'createdAt', descending: true }
    ],
    CARS: [
        { field: 'brand', index: true },
        { field: 'model', index: true },
        { field: 'category', index: true },
        { field: 'price', index: true },
        { field: 'year', index: true },
        { field: 'createdAt', descending: true }
    ],
    ORDERS: [
        { field: 'userId', index: true },
        { field: 'status', index: true },
        { field: 'createdAt', descending: true }
    ],
    REVIEWS: [
        { field: 'carId', index: true },
        { field: 'userId', index: true },
        { field: 'createdAt', descending: true }
    ]
};

// ===== SEED DATA =====
const SEED_DATA = {
    categories: [
        { name: 'SUV', slug: 'suv', icon: 'fa-car-side' },
        { name: 'Sedan', slug: 'sedan', icon: 'fa-car' },
        { name: 'Krossover', slug: 'krossover', icon: 'fa-caravan' },
        { name: 'Hatchback', slug: 'hatchback', icon: 'fa-car-rear' },
        { name: 'Sport', slug: 'sport', icon: 'fa-flag-checkered' },
        { name: 'Luxury', slug: 'luxury', icon: 'fa-crown' }
    ],
    brands: [
        { name: 'BMW', country: 'Germaniya', logo: 'bmw.png' },
        { name: 'Mercedes-Benz', country: 'Germaniya', logo: 'mercedes.png' },
        { name: 'Toyota', country: 'Yaponiya', logo: 'toyota.png' },
        { name: 'Honda', country: 'Yaponiya', logo: 'honda.png' },
        { name: 'Lexus', country: 'Yaponiya', logo: 'lexus.png' },
        { name: 'Audi', country: 'Germaniya', logo: 'audi.png' },
        { name: 'Porsche', country: 'Germaniya', logo: 'porsche.png' }
    ],
    admin: {
        name: 'Admin',
        email: 'admin@car-enterprise.uz',
        password: 'admin123',
        role: 'admin'
    }
};

// ===== GET DB CONFIG =====
function getDBConfig(env = 'development') {
    const config = DB_CONFIG[env] || DB_CONFIG.development;
    return config;
}

// ===== GET CONNECTION STRING =====
function getConnectionString(env = 'development') {
    const config = getDBConfig(env);
    let connectionString = '';
    
    switch (config.dialect) {
        case 'mongodb':
            connectionString = `mongodb://${config.host}:${config.port}/${config.name}`;
            if (config.username && config.password) {
                connectionString = `mongodb://${config.username}:${config.password}@${config.host}:${config.port}/${config.name}`;
            }
            break;
        case 'postgresql':
            connectionString = `postgresql://${config.username}:${config.password}@${config.host}:${config.port}/${config.name}`;
            break;
        case 'mysql':
            connectionString = `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.name}`;
            break;
        default:
            connectionString = `mongodb://${config.host}:${config.port}/${config.name}`;
    }
    
    return connectionString;
}

// ===== EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DB_CONFIG,
        DB_MODELS,
        DB_COLLECTIONS,
        DB_INDEXES,
        SEED_DATA,
        getDBConfig,
        getConnectionString
    };
}

if (typeof window !== 'undefined') {
    window.DB_CONFIG = DB_CONFIG;
    window.DB_MODELS = DB_MODELS;
    window.DB_COLLECTIONS = DB_COLLECTIONS;
    window.SEED_DATA = SEED_DATA;
}