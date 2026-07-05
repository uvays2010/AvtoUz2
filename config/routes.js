/* ========================================
   CAR-ENTERPRISE - ROUTES CONFIG
   ======================================== */

// ===== API ROUTES =====
const API_ROUTES = {
    // Auth routes
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        CHANGE_PASSWORD: '/auth/change-password',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password'
    },
    
    // Car routes
    CARS: {
        BASE: '/cars',
        GET_ALL: '/cars',
        GET_ONE: '/cars/:id',
        CREATE: '/cars',
        UPDATE: '/cars/:id',
        DELETE: '/cars/:id',
        FEATURED: '/cars/featured',
        BRANDS: '/cars/brands',
        CATEGORIES: '/cars/categories',
        SEARCH: '/cars/search',
        FILTER: '/cars/filter'
    },
    
    // User routes
    USERS: {
        BASE: '/users',
        GET_ALL: '/users',
        GET_ONE: '/users/:id',
        UPDATE: '/users/:id',
        DELETE: '/users/:id',
        PROFILE: '/users/profile',
        AVATAR: '/users/avatar'
    },
    
    // Order routes
    ORDERS: {
        BASE: '/orders',
        GET_ALL: '/orders',
        GET_ONE: '/orders/:id',
        CREATE: '/orders',
        UPDATE: '/orders/:id',
        DELETE: '/orders/:id',
        STATUS: '/orders/:id/status',
        CANCEL: '/orders/:id/cancel',
        USER_ORDERS: '/orders/user/:userId'
    },
    
    // Blog routes
    BLOG: {
        BASE: '/blog',
        GET_ALL: '/blog',
        GET_ONE: '/blog/:id',
        CREATE: '/blog',
        UPDATE: '/blog/:id',
        DELETE: '/blog/:id',
        CATEGORIES: '/blog/categories',
        TAGS: '/blog/tags'
    },
    
    // Review routes
    REVIEWS: {
        BASE: '/reviews',
        GET_ALL: '/reviews',
        GET_ONE: '/reviews/:id',
        CREATE: '/reviews',
        UPDATE: '/reviews/:id',
        DELETE: '/reviews/:id',
        CAR_REVIEWS: '/reviews/car/:carId'
    },
    
    // Favorites routes
    FAVORITES: {
        BASE: '/favorites',
        GET_ALL: '/favorites',
        ADD: '/favorites',
        REMOVE: '/favorites/:id',
        CHECK: '/favorites/check/:carId'
    },
    
    // Cart routes (client-side)
    CART: {
        BASE: '/cart',
        GET: '/cart',
        ADD: '/cart/add',
        REMOVE: '/cart/remove',
        UPDATE: '/cart/update',
        CLEAR: '/cart/clear'
    },
    
    // Testimonials routes
    TESTIMONIALS: {
        BASE: '/testimonials',
        GET_ALL: '/testimonials',
        CREATE: '/testimonials',
        DELETE: '/testimonials/:id'
    },
    
    // FAQ routes
    FAQ: {
        BASE: '/faq',
        GET_ALL: '/faq',
        GET_ONE: '/faq/:id',
        CREATE: '/faq',
        UPDATE: '/faq/:id',
        DELETE: '/faq/:id',
        CATEGORIES: '/faq/categories'
    },
    
    // Settings routes
    SETTINGS: {
        BASE: '/settings',
        GET: '/settings',
        UPDATE: '/settings',
        SOCIAL: '/settings/social',
        SEO: '/settings/seo'
    }
};

// ===== PAGE ROUTES =====
const PAGE_ROUTES = {
    HOME: '/',
    ABOUT: '/pages/about.html',
    CARS: '/pages/cars.html',
    CAR_DETAIL: '/pages/car-detail.html',
    BLOG: '/pages/blog.html',
    BLOG_DETAIL: '/pages/blog-detail.html',
    GALLERY: '/pages/gallery.html',
    SHOP: '/pages/shop.html',
    SHOP_DETAIL: '/pages/shop-detail.html',
    CONTACT: '/pages/contact.html',
    SERVICES: '/pages/services.html',
    TESTIMONIALS: '/pages/testimonials.html',
    FAQ: '/pages/faq.html',
    CART: '/pages/cart.html',
    CHECKOUT: '/pages/checkout.html',
    LOGIN: '/pages/login.html',
    REGISTER: '/pages/register.html',
    DASHBOARD: '/pages/dashboard.html',
    ADD_CAR: '/pages/add-car.html',
    EDIT_CAR: '/pages/edit-car.html',
    PROFILE: '/pages/profile.html',
    NOT_FOUND: '/pages/404.html'
};

// ===== ROUTE MIDDLEWARE =====
const ROUTE_MIDDLEWARE = {
    // Public routes (no auth required)
    PUBLIC: [
        API_ROUTES.AUTH.LOGIN,
        API_ROUTES.AUTH.REGISTER,
        API_ROUTES.AUTH.FORGOT_PASSWORD,
        API_ROUTES.AUTH.RESET_PASSWORD,
        API_ROUTES.CARS.GET_ALL,
        API_ROUTES.CARS.GET_ONE,
        API_ROUTES.CARS.FEATURED,
        API_ROUTES.CARS.BRANDS,
        API_ROUTES.CARS.CATEGORIES,
        API_ROUTES.CARS.SEARCH,
        API_ROUTES.BLOG.GET_ALL,
        API_ROUTES.BLOG.GET_ONE,
        API_ROUTES.TESTIMONIALS.GET_ALL,
        API_ROUTES.FAQ.GET_ALL
    ],
    
    // Admin only routes
    ADMIN_ONLY: [
        API_ROUTES.USERS.GET_ALL,
        API_ROUTES.USERS.DELETE,
        API_ROUTES.CARS.DELETE,
        API_ROUTES.BLOG.DELETE,
        API_ROUTES.REVIEWS.DELETE,
        API_ROUTES.SETTINGS.UPDATE
    ]
};

// ===== ROUTE HELPERS =====
function isPublicRoute(path) {
    return ROUTE_MIDDLEWARE.PUBLIC.some(route => path.includes(route));
}

function isAdminRoute(path) {
    return ROUTE_MIDDLEWARE.ADMIN_ONLY.some(route => path.includes(route));
}

function getRouteParams(route, path) {
    const routeParts = route.split('/');
    const pathParts = path.split('/');
    const params = {};
    
    routeParts.forEach((part, index) => {
        if (part.startsWith(':')) {
            const key = part.slice(1);
            params[key] = pathParts[index];
        }
    });
    
    return params;
}

// ===== EXPORTS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_ROUTES,
        PAGE_ROUTES,
        ROUTE_MIDDLEWARE,
        isPublicRoute,
        isAdminRoute,
        getRouteParams
    };
}

if (typeof window !== 'undefined') {
    window.API_ROUTES = API_ROUTES;
    window.PAGE_ROUTES = PAGE_ROUTES;
    window.isPublicRoute = isPublicRoute;
    window.isAdminRoute = isAdminRoute;
}