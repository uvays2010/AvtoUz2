/* ========================================
   CAR-ENTERPRISE - API MODULE
   ======================================== */

const API = {
    baseURL: '/api',
    
    // ===== HTTP METHODS =====
    async get(endpoint, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = `${this.baseURL}${endpoint}${queryString ? '?' + queryString : ''}`;
        return this.request(url, { method: 'GET' });
    },
    
    async post(endpoint, data = {}) {
        const url = `${this.baseURL}${endpoint}`;
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    async put(endpoint, data = {}) {
        const url = `${this.baseURL}${endpoint}`;
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    async delete(endpoint) {
        const url = `${this.baseURL}${endpoint}`;
        return this.request(url, { method: 'DELETE' });
    },
    
    // ===== REQUEST HANDLER =====
    async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        };
        
        // Add auth token if exists
        const token = localStorage.getItem('authToken');
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, finalOptions);
            
            // Handle 401 unauthorized
            if (response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
                return null;
            }
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Xatolik yuz berdi');
            }
            
            return data;
        } catch (error) {
            console.error('API Error:', error);
            showNotification(error.message || 'Server bilan bog\'lanishda xatolik', 'error');
            throw error;
        }
    },
    
    // ===== CARS API =====
    cars: {
        // Get all cars with filters
        async getAll(filters = {}) {
            const params = {
                page: filters.page || 1,
                limit: filters.limit || 12,
                search: filters.search || '',
                brand: filters.brand || '',
                category: filters.category || '',
                minPrice: filters.minPrice || '',
                maxPrice: filters.maxPrice || '',
                year: filters.year || '',
                sort: filters.sort || 'newest'
            };
            return API.get('/cars', params);
        },
        
        // Get single car by ID
        async getById(id) {
            return API.get(`/cars/${id}`);
        },
        
        // Create new car
        async create(carData) {
            return API.post('/cars', carData);
        },
        
        // Update car
        async update(id, carData) {
            return API.put(`/cars/${id}`, carData);
        },
        
        // Delete car
        async delete(id) {
            return API.delete(`/cars/${id}`);
        },
        
        // Get featured cars
        async getFeatured() {
            return API.get('/cars/featured');
        },
        
        // Get car brands
        async getBrands() {
            return API.get('/cars/brands');
        },
        
        // Get car categories
        async getCategories() {
            return API.get('/cars/categories');
        }
    },
    
    // ===== AUTH API =====
    auth: {
        // Login user
        async login(email, password) {
            const data = await API.post('/auth/login', { email, password });
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                API.setAuthToken(data.token);
            }
            return data;
        },
        
        // Register user
        async register(userData) {
            const data = await API.post('/auth/register', userData);
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                API.setAuthToken(data.token);
            }
            return data;
        },
        
        // Logout user
        logout() {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            API.setAuthToken(null);
            window.location.href = '/login.html';
        },
        
        // Get current user
        getCurrentUser() {
            try {
                return JSON.parse(localStorage.getItem('user'));
            } catch {
                return null;
            }
        },
        
        // Check if user is authenticated
        isAuthenticated() {
            return !!localStorage.getItem('authToken');
        }
    },
    
    // ===== ORDERS API =====
    orders: {
        // Get all orders
        async getAll() {
            return API.get('/orders');
        },
        
        // Get single order
        async getById(id) {
            return API.get(`/orders/${id}`);
        },
        
        // Create order
        async create(orderData) {
            return API.post('/orders', orderData);
        },
        
        // Update order status
        async updateStatus(id, status) {
            return API.put(`/orders/${id}/status`, { status });
        },
        
        // Cancel order
        async cancel(id) {
            return API.put(`/orders/${id}/cancel`);
        }
    },
    
    // ===== USERS API =====
    users: {
        // Get all users (admin only)
        async getAll() {
            return API.get('/users');
        },
        
        // Get user by ID
        async getById(id) {
            return API.get(`/users/${id}`);
        },
        
        // Update user
        async update(id, userData) {
            return API.put(`/users/${id}`, userData);
        },
        
        // Delete user
        async delete(id) {
            return API.delete(`/users/${id}`);
        }
    },
    
    // ===== BLOG API =====
    blog: {
        // Get all posts
        async getAll(params = {}) {
            return API.get('/blog', params);
        },
        
        // Get single post
        async getById(id) {
            return API.get(`/blog/${id}`);
        },
        
        // Create post
        async create(postData) {
            return API.post('/blog', postData);
        },
        
        // Update post
        async update(id, postData) {
            return API.put(`/blog/${id}`, postData);
        },
        
        // Delete post
        async delete(id) {
            return API.delete(`/blog/${id}`);
        }
    },
    
    // ===== FAVORITES API =====
    favorites: {
        // Get user favorites
        async get() {
            return API.get('/favorites');
        },
        
        // Add to favorites
        async add(carId) {
            return API.post('/favorites', { carId });
        },
        
        // Remove from favorites
        async remove(carId) {
            return API.delete(`/favorites/${carId}`);
        },
        
        // Check if car is favorite
        async check(carId) {
            return API.get(`/favorites/check/${carId}`);
        }
    },
    
    // ===== SET AUTH TOKEN =====
    setAuthToken(token) {
        if (token) {
            this.defaultHeaders['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.defaultHeaders['Authorization'];
        }
    },
    
    defaultHeaders: {}
};

// ===== LOCAL STORAGE HELPERS =====
const Storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

// ===== CART HELPERS =====
const Cart = {
    // Get cart items
    getItems() {
        return Storage.get('cart', []);
    },
    
    // Add item to cart
    addItem(carId, quantity = 1) {
        const cart = this.getItems();
        const existing = cart.find(item => item.carId === carId);
        
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ carId, quantity });
        }
        
        Storage.set('cart', cart);
        this.updateCartCount();
        document.dispatchEvent(new CustomEvent('cartUpdated'));
        showNotification('Mashina savatga qo\'shildi!', 'success');
    },
    
    // Remove item from cart
    removeItem(carId) {
        let cart = this.getItems();
        cart = cart.filter(item => item.carId !== carId);
        Storage.set('cart', cart);
        this.updateCartCount();
        document.dispatchEvent(new CustomEvent('cartUpdated'));
        showNotification('Mashina savatdan olib tashlandi', 'info');
    },
    
    // Update item quantity
    updateQuantity(carId, quantity) {
        const cart = this.getItems();
        const item = cart.find(item => item.carId === carId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            Storage.set('cart', cart);
            this.updateCartCount();
            document.dispatchEvent(new CustomEvent('cartUpdated'));
        }
    },
    
    // Clear cart
    clear() {
        Storage.remove('cart');
        this.updateCartCount();
        document.dispatchEvent(new CustomEvent('cartUpdated'));
    },
    
    // Get total items
    getTotalItems() {
        const cart = this.getItems();
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    // Get total price
    getTotalPrice() {
        // This would need car prices from API
        // For now, return 0
        return 0;
    },
    
    // Update cart count badge
    updateCartCount() {
        const count = this.getTotalItems();
        const badge = document.getElementById('cartCount');
        if (badge) {
            badge.textContent = count;
        }
    }
};

// ===== FAVORITES HELPERS =====
const Favorites = {
    // Get favorites
    getItems() {
        return Storage.get('favorites', []);
    },
    
    // Add to favorites
    add(carId) {
        const favorites = this.getItems();
        if (!favorites.includes(carId)) {
            favorites.push(carId);
            Storage.set('favorites', favorites);
            showNotification('Sevimlilarga qo\'shildi! ❤️', 'success');
        }
    },
    
    // Remove from favorites
    remove(carId) {
        let favorites = this.getItems();
        favorites = favorites.filter(id => id !== carId);
        Storage.set('favorites', favorites);
        showNotification('Sevimlilardan olib tashlandi', 'info');
    },
    
    // Check if favorite
    isFavorite(carId) {
        const favorites = this.getItems();
        return favorites.includes(carId);
    },
    
    // Toggle favorite
    toggle(carId) {
        if (this.isFavorite(carId)) {
            this.remove(carId);
            return false;
        } else {
            this.add(carId);
            return true;
        }
    }
};

// ===== EXPOSE GLOBALLY =====
window.API = API;
window.Storage = Storage;
window.Cart = Cart;
window.Favorites = Favorites;

console.log('✅ API Module loaded successfully');
console.log('✅ Cart Module loaded successfully');
console.log('✅ Favorites Module loaded successfully');