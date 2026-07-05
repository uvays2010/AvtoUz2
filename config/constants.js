/* ========================================
   CAR-ENTERPRISE - CONSTANTS
   ======================================== */

// ===== APP CONSTANTS =====
const APP = {
    NAME: 'Car Enterprise',
    VERSION: '1.0.0',
    YEAR: new Date().getFullYear(),
    DOMAIN: 'https://car-enterprise.uz',
    EMAIL: 'info@car-enterprise.uz',
    PHONE: '+998 90 123 45 67',
    ADDRESS: 'Toshkent, Amir Temur ko\'chasi, 15-uy'
};

// ===== API CONSTANTS =====
const API_CONFIG = {
    BASE_URL: '/api',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
};

// ===== AUTH CONSTANTS =====
const AUTH = {
    TOKEN_KEY: 'authToken',
    USER_KEY: 'user',
    REMEMBER_ME_KEY: 'rememberMe',
    TOKEN_EXPIRY: 7, // days
    REFRESH_TOKEN_KEY: 'refreshToken'
};

// ===== CART CONSTANTS =====
const CART = {
    STORAGE_KEY: 'cart',
    MAX_ITEMS: 99,
    MIN_QUANTITY: 1,
    MAX_QUANTITY: 10
};

// ===== FAVORITES CONSTANTS =====
const FAVORITES = {
    STORAGE_KEY: 'favorites'
};

// ===== PAGINATION CONSTANTS =====
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
    VISIBLE_PAGES: 5
};

// ===== FILTER CONSTANTS =====
const FILTERS = {
    SORT_OPTIONS: [
        { value: 'newest', label: 'Eng yangi' },
        { value: 'oldest', label: 'Eng eski' },
        { value: 'price-low', label: 'Narxi pastdan' },
        { value: 'price-high', label: 'Narxi yuqoridan' },
        { value: 'rating', label: 'Reyting bo\'yicha' }
    ],
    FUEL_TYPES: ['Benzin', 'Dizel', 'Elektrik', 'Gibrid', 'Gaz'],
    TRANSMISSIONS: ['Avtomat', 'Mexanik', 'Robot', 'Variator'],
    CAR_CONDITIONS: ['Yangi', 'Ishlatilgan']
};

// ===== CAR CATEGORIES =====
const CAR_CATEGORIES = [
    { id: 'suv', name: 'SUV', icon: 'fa-car-side' },
    { id: 'sedan', name: 'Sedan', icon: 'fa-car' },
    { id: 'krossover', name: 'Krossover', icon: 'fa-caravan' },
    { id: 'hatchback', name: 'Hatchback', icon: 'fa-car-rear' },
    { id: 'sport', name: 'Sport', icon: 'fa-flag-checkered' },
    { id: 'luxury', name: 'Luxury', icon: 'fa-crown' },
    { id: 'universal', name: 'Universal', icon: 'fa-truck' }
];

// ===== CAR BRANDS =====
const CAR_BRANDS = [
    'BMW', 'Mercedes-Benz', 'Toyota', 'Honda', 'Lexus',
    'Audi', 'Porsche', 'Hyundai', 'KIA', 'Volkswagen',
    'Chevrolet', 'Nissan', 'Ford', 'Tesla', 'Mazda',
    'Subaru', 'Mitsubishi', 'Suzuki', 'Land Rover', 'Jaguar'
];

// ===== PAYMENT METHODS =====
const PAYMENT_METHODS = [
    { id: 'card', name: 'Karta orqali', icon: 'fa-credit-card' },
    { id: 'cash', name: 'Naqd pul', icon: 'fa-money-bill-wave' },
    { id: 'bank', name: 'Bank o\'tkazmasi', icon: 'fa-university' }
];

// ===== ORDER STATUSES =====
const ORDER_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

const ORDER_STATUS_LABELS = {
    [ORDER_STATUS.PENDING]: 'Kutilmoqda',
    [ORDER_STATUS.PROCESSING]: 'Jarayonda',
    [ORDER_STATUS.SHIPPED]: 'Yuborilgan',
    [ORDER_STATUS.DELIVERED]: 'Yetkazilgan',
    [ORDER_STATUS.CANCELLED]: 'Bekor qilingan'
};

// ===== SHIPPING CONSTANTS =====
const SHIPPING = {
    FREE_THRESHOLD: 10000000, // 10 million so'm
    STANDARD_COST: 0,
    EXPRESS_COST: 500000,
    DELIVERY_DAYS: 3
};

// ===== TAX CONSTANTS =====
const TAX = {
    RATE: 0.12, // 12%
    DISPLAY_NAME: 'QQS'
};

// ===== CURRENCY CONSTANTS =====
const CURRENCY = {
    CODE: 'UZS',
    SYMBOL: 'so\'m',
    LOCALE: 'uz-UZ',
    MIN_DECIMALS: 0,
    MAX_DECIMALS: 0
};

// ===== DATE CONSTANTS =====
const DATE = {
    FORMAT: 'YYYY-MM-DD',
    DISPLAY_FORMAT: 'DD.MM.YYYY',
    TIME_FORMAT: 'HH:mm',
    DATETIME_FORMAT: 'DD.MM.YYYY HH:mm'
};

// ===== REGEX CONSTANTS =====
const REGEX = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+998[0-9]{9}$/,
    UZS: /^[0-9,]+$/,
    NAME: /^[a-zA-Z\u0400-\u04FF\s]{2,50}$/,
    PASSWORD: /^.{6,}$/
};

// ===== MESSAGES =====
const MESSAGES = {
    SUCCESS: {
        LOGIN: 'Tizimga muvaffaqiyatli kirdingiz!',
        REGISTER: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz!',
        LOGOUT: 'Tizimdan chiqdingiz',
        CART_ADD: 'Savatga qo\'shildi',
        CART_REMOVE: 'Savatdan olib tashlandi',
        ORDER_PLACED: 'Buyurtma muvaffaqiyatli rasmiylashtirildi!',
        PROFILE_UPDATE: 'Profil muvaffaqiyatli yangilandi!',
        PASSWORD_CHANGE: 'Parol muvaffaqiyatli o\'zgartirildi!',
        CAR_ADD: 'Mashina muvaffaqiyatli qo\'shildi!',
        CAR_UPDATE: 'Mashina muvaffaqiyatli yangilandi!',
        CAR_DELETE: 'Mashina muvaffaqiyatli o\'chirildi!',
        FAVORITE_ADD: 'Sevimlilarga qo\'shildi ❤️',
        FAVORITE_REMOVE: 'Sevimlilardan olib tashlandi',
        REVIEW_ADD: 'Sharhingiz qabul qilindi! Rahmat!'
    },
    ERROR: {
        NETWORK: 'Server bilan bog\'lanishda xatolik',
        UNAUTHORIZED: 'Tizimga kirmagansiz',
        FORBIDDEN: 'Ruxsat yo\'q',
        NOT_FOUND: 'Ma\'lumot topilmadi',
        VALIDATION: 'Iltimos, barcha maydonlarni to\'g\'ri to\'ldiring',
        EMAIL_EXISTS: 'Bu email allaqachon ro\'yxatdan o\'tgan',
        INVALID_CREDENTIALS: 'Email yoki parol noto\'g\'ri',
        WEAK_PASSWORD: 'Parol juda zaif',
        CART_EMPTY: 'Savat bo\'sh',
        INVALID_PHONE: 'Telefon raqam noto\'g\'ri formatda'
    },
    WARNING: {
        DELETE: 'Bu amalni qaytarib bo\'lmaydi. Davom etasizmi?',
        CART_CLEAR: 'Savatni tozalashni xohlaysizmi?',
        LOGOUT: 'Haqiqatan ham chiqmoqchimisiz?'
    }
};

// ===== THEME CONSTANTS =====
const THEME = {
    DEFAULT: 'light',
    DARK: 'dark',
    LIGHT: 'light',
    STORAGE_KEY: 'theme'
};

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    THEME: 'theme',
    AUTH_TOKEN: 'authToken',
    USER: 'user',
    CART: 'cart',
    FAVORITES: 'favorites',
    REMEMBER_ME: 'rememberMe',
    LANGUAGE: 'language',
    NOTIFICATIONS: 'notifications'
};

// ===== EXPORTS =====
// For Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP,
        API_CONFIG,
        AUTH,
        CART,
        FAVORITES,
        PAGINATION,
        FILTERS,
        CAR_CATEGORIES,
        CAR_BRANDS,
        PAYMENT_METHODS,
        ORDER_STATUS,
        ORDER_STATUS_LABELS,
        SHIPPING,
        TAX,
        CURRENCY,
        DATE,
        REGEX,
        MESSAGES,
        THEME,
        STORAGE_KEYS
    };
}

// For browser
if (typeof window !== 'undefined') {
    window.APP = APP;
    window.API_CONFIG = API_CONFIG;
    window.AUTH = AUTH;
    window.CART = CART;
    window.FAVORITES = FAVORITES;
    window.PAGINATION = PAGINATION;
    window.FILTERS = FILTERS;
    window.CAR_CATEGORIES = CAR_CATEGORIES;
    window.CAR_BRANDS = CAR_BRANDS;
    window.PAYMENT_METHODS = PAYMENT_METHODS;
    window.ORDER_STATUS = ORDER_STATUS;
    window.ORDER_STATUS_LABELS = ORDER_STATUS_LABELS;
    window.SHIPPING = SHIPPING;
    window.TAX = TAX;
    window.CURRENCY = CURRENCY;
    window.DATE = DATE;
    window.REGEX = REGEX;
    window.MESSAGES = MESSAGES;
    window.THEME = THEME;
    window.STORAGE_KEYS = STORAGE_KEYS;
}