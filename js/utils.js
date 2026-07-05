/* ========================================
   CAR-ENTERPRISE - UTILITY FUNCTIONS
   Version: 1.0.0
   ======================================== */

// ===== STRING UTILITIES =====

/**
 * Capitalize first letter of a string
 */
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize each word in a string
 */
function capitalizeWords(str) {
    if (!str) return '';
    return str.split(' ').map(word => capitalize(word)).join(' ');
}

/**
 * Truncate string to specified length
 */
function truncate(str, length = 50, suffix = '...') {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.slice(0, length) + suffix;
}

/**
 * Slugify a string (for URLs)
 */
function slugify(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Generate random string
 */
function randomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate random number between min and max
 */
function randomNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'id-' + Date.now() + '-' + randomString(6);
}

// ===== NUMBER UTILITIES =====

/**
 * Format number with commas
 */
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency (UZS)
 */
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return '0 so\'m';
    return new Intl.NumberFormat('uz-UZ', {
        style: 'currency',
        currency: 'UZS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount).replace('UZS', '').trim() + ' so\'m';
}

/**
 * Format currency short (UZS)
 */
function formatCurrencyShort(amount) {
    if (amount === null || amount === undefined) return '0';
    if (amount >= 1000000000) {
        return (amount / 1000000000).toFixed(1) + ' млрд';
    }
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1) + ' млн';
    }
    if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + ' минг';
    }
    return formatNumber(amount);
}

/**
 * Format percentage
 */
function formatPercentage(value) {
    return value + '%';
}

/**
 * Clamp number between min and max
 */
function clamp(num, min = 0, max = 100) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Round to decimal places
 */
function round(num, decimals = 0) {
    return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
}

// ===== DATE UTILITIES =====

/**
 * Format date
 */
function formatDate(date, format = 'default') {
    if (!date) return '';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    if (format === 'short') {
        options.month = 'short';
    }
    
    if (format === 'numeric') {
        options.month = '2-digit';
        options.day = '2-digit';
    }
    
    if (format === 'full') {
        options.weekday = 'long';
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('uz-UZ', options).format(d);
}

/**
 * Format time
 */
function formatTime(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat('uz-UZ', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(d);
}

/**
 * Format date and time
 */
function formatDateTime(date) {
    return formatDate(date, 'full');
}

/**
 * Get relative time (e.g. "3 kun oldin")
 */
function getRelativeTime(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const now = new Date();
    const diff = now - d;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    
    if (seconds < 60) return 'hozirgina';
    if (minutes < 60) return minutes + ' daqiqa oldin';
    if (hours < 24) return hours + ' soat oldin';
    if (days < 7) return days + ' kun oldin';
    if (weeks < 4) return weeks + ' hafta oldin';
    if (months < 12) return months + ' oy oldin';
    return years + ' yil oldin';
}

/**
 * Check if date is today
 */
function isToday(date) {
    if (!date) return false;
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;
    const today = new Date();
    return d.getDate() === today.getDate() &&
           d.getMonth() === today.getMonth() &&
           d.getFullYear() === today.getFullYear();
}

/**
 * Check if date is in the past
 */
function isPast(date) {
    if (!date) return false;
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;
    return d < new Date();
}

/**
 * Check if date is in the future
 */
function isFuture(date) {
    if (!date) return false;
    const d = new Date(date);
    if (isNaN(d.getTime())) return false;
    return d > new Date();
}

// ===== ARRAY UTILITIES =====

/**
 * Group array by key
 */
function groupBy(array, key) {
    return array.reduce((result, item) => {
        const groupKey = item[key];
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {});
}

/**
 * Chunk array into smaller arrays
 */
function chunk(array, size = 2) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Shuffle array (Fisher-Yates)
 */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Remove duplicates from array
 */
function unique(array) {
    return [...new Set(array)];
}

/**
 * Get difference between two arrays
 */
function arrayDiff(a, b) {
    return a.filter(item => !b.includes(item));
}

/**
 * Get intersection of two arrays
 */
function arrayIntersection(a, b) {
    return a.filter(item => b.includes(item));
}

/**
 * Sort array by key
 */
function sortBy(array, key, order = 'asc') {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

// ===== OBJECT UTILITIES =====

/**
 * Deep clone object
 */
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 */
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Get nested object value by path
 */
function getNestedValue(obj, path, defaultValue = null) {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result === null || result === undefined || !result.hasOwnProperty(key)) {
            return defaultValue;
        }
        result = result[key];
    }
    return result;
}

/**
 * Set nested object value by path
 */
function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
            current[keys[i]] = {};
        }
        current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return obj;
}

/**
 * Pick specific keys from object
 */
function pick(obj, keys) {
    const result = {};
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    });
    return result;
}

/**
 * Omit specific keys from object
 */
function omit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}

// ===== DOM UTILITIES =====

/**
 * Get element by selector (with error handling)
 */
function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Get all elements by selector
 */
function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Add multiple event listeners
 */
function addEvents(element, events) {
    Object.keys(events).forEach(event => {
        element.addEventListener(event, events[event]);
    });
}

/**
 * Toggle class on element
 */
function toggleClass(element, className) {
    element.classList.toggle(className);
}

/**
 * Add class to element
 */
function addClass(element, className) {
    element.classList.add(className);
}

/**
 * Remove class from element
 */
function removeClass(element, className) {
    element.classList.remove(className);
}

/**
 * Check if element has class
 */
function hasClass(element, className) {
    return element.classList.contains(className);
}

/**
 * Get element offset
 */
function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset,
        width: rect.width,
        height: rect.height
    };
}

/**
 * Check if element is visible
 */
function isVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

// ===== URL UTILITIES =====

/**
 * Get URL parameters
 */
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

/**
 * Get single URL parameter
 */
function getUrlParam(key) {
    const params = getUrlParams();
    return params[key] || null;
}

/**
 * Build URL with parameters
 */
function buildUrl(baseUrl, params) {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });
    return url.toString();
}

/**
 * Get current URL without parameters
 */
function getBaseUrl() {
    return window.location.origin + window.location.pathname;
}

// ===== BROWSER UTILITIES =====

/**
 * Check if device is mobile
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Check if device is tablet
 */
function isTablet() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Check if device is desktop
 */
function isDesktop() {
    return window.innerWidth > 1024;
}

/**
 * Get browser name
 */
function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1) return 'Chrome';
    if (ua.indexOf('Firefox') > -1) return 'Firefox';
    if (ua.indexOf('Safari') > -1) return 'Safari';
    if (ua.indexOf('Edge') > -1) return 'Edge';
    if (ua.indexOf('Opera') > -1) return 'Opera';
    return 'Unknown';
}

/**
 * Check if touch device
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Copy to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
    return Promise.resolve();
}

// ===== EXPOSE GLOBALLY =====
window.capitalize = capitalize;
window.capitalizeWords = capitalizeWords;
window.truncate = truncate;
window.slugify = slugify;
window.randomString = randomString;
window.randomNumber = randomNumber;
window.generateId = generateId;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;
window.formatCurrencyShort = formatCurrencyShort;
window.formatPercentage = formatPercentage;
window.clamp = clamp;
window.round = round;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.formatDateTime = formatDateTime;
window.getRelativeTime = getRelativeTime;
window.isToday = isToday;
window.isPast = isPast;
window.isFuture = isFuture;
window.groupBy = groupBy;
window.chunk = chunk;
window.shuffle = shuffle;
window.unique = unique;
window.arrayDiff = arrayDiff;
window.arrayIntersection = arrayIntersection;
window.sortBy = sortBy;
window.deepClone = deepClone;
window.isEmpty = isEmpty;
window.getNestedValue = getNestedValue;
window.setNestedValue = setNestedValue;
window.pick = pick;
window.omit = omit;
window.$ = $;
window.$$ = $$;
window.addEvents = addEvents;
window.toggleClass = toggleClass;
window.addClass = addClass;
window.removeClass = removeClass;
window.hasClass = hasClass;
window.getOffset = getOffset;
window.isVisible = isVisible;
window.getUrlParams = getUrlParams;
window.getUrlParam = getUrlParam;
window.buildUrl = buildUrl;
window.getBaseUrl = getBaseUrl;
window.isMobile = isMobile;
window.isTablet = isTablet;
window.isDesktop = isDesktop;
window.getBrowser = getBrowser;
window.isTouchDevice = isTouchDevice;
window.copyToClipboard = copyToClipboard;

console.log('✅ Utils Module loaded successfully');