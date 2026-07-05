/* ========================================
   CAR-ENTERPRISE - NOTIFICATIONS MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initNotifications();
});

// ===== NOTIFICATIONS CONFIG =====
const NOTIFICATIONS_CONFIG = {
    CONTAINER_ID: 'notificationContainer',
    DEFAULT_DURATION: 3000,
    MAX_NOTIFICATIONS: 5,
    POSITION: 'top-right'
};

// ===== NOTIFICATION TYPES =====
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// ===== NOTIFICATION ICONS =====
const NOTIFICATION_ICONS = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
};

// ===== NOTIFICATION COLORS =====
const NOTIFICATION_COLORS = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
};

// ===== INIT NOTIFICATIONS =====
function initNotifications() {
    createNotificationContainer();
    
    // Handle notification events
    document.addEventListener('notification', function(e) {
        const { message, type, duration } = e.detail || {};
        if (message) {
            showNotification(message, type, duration);
        }
    });
}

// ===== CREATE CONTAINER =====
function createNotificationContainer() {
    let container = document.getElementById(NOTIFICATIONS_CONFIG.CONTAINER_ID);
    
    if (!container) {
        container = document.createElement('div');
        container.id = NOTIFICATIONS_CONFIG.CONTAINER_ID;
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
            max-width: 400px;
            width: 100%;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    return container;
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'info', duration = null) {
    const container = document.getElementById(NOTIFICATIONS_CONFIG.CONTAINER_ID);
    if (!container) return;
    
    // Set default duration
    if (!duration) {
        duration = NOTIFICATIONS_CONFIG.DEFAULT_DURATION;
    }
    
    // Check max notifications
    const currentNotifications = container.querySelectorAll('.notification');
    if (currentNotifications.length >= NOTIFICATIONS_CONFIG.MAX_NOTIFICATIONS) {
        // Remove oldest notification
        const oldest = currentNotifications[0];
        if (oldest) {
            removeNotification(oldest, true);
        }
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.dataset.type = type;
    
    const color = NOTIFICATION_COLORS[type] || NOTIFICATION_COLORS.info;
    const icon = NOTIFICATION_ICONS[type] || NOTIFICATION_ICONS.info;
    
    notification.style.cssText = `
        background: var(--bg-card, #ffffff);
        color: var(--text-primary, #212529);
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        transform: translateX(120%);
        transition: transform 0.3s ease, opacity 0.3s ease;
        pointer-events: auto;
        border-left: 4px solid ${color};
        border: 1px solid var(--border-primary, #e9ecef);
        min-width: 280px;
        max-width: 400px;
        position: relative;
    `;
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="color: ${color}; font-size: 20px; flex-shrink: 0;"></i>
        <span style="flex: 1; font-size: 14px; line-height: 1.5;">${message}</span>
        <button style="
            background: transparent;
            border: none;
            color: var(--text-muted, #adb5bd);
            cursor: pointer;
            font-size: 16px;
            padding: 0 4px;
            transition: color 0.2s ease;
            flex-shrink: 0;
        ">&times;</button>
        <div style="
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: ${color};
            animation: notificationProgress ${duration}ms linear forwards;
            border-radius: 0 0 8px 8px;
        "></div>
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('button');
    closeBtn.addEventListener('click', function() {
        removeNotification(notification);
    });
    
    // Add to container
    container.appendChild(notification);
    
    // Trigger slide in
    setTimeout(function() {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 50);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(function() {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

// ===== REMOVE NOTIFICATION =====
function removeNotification(notification, instant = false) {
    if (!notification || !notification.parentNode) return;
    
    if (instant) {
        notification.remove();
        return;
    }
    
    notification.style.transform = 'translateX(120%)';
    notification.style.opacity = '0';
    
    setTimeout(function() {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// ===== CLEAR ALL NOTIFICATIONS =====
function clearAllNotifications() {
    const container = document.getElementById(NOTIFICATIONS_CONFIG.CONTAINER_ID);
    if (!container) return;
    
    const notifications = container.querySelectorAll('.notification');
    notifications.forEach(function(notification) {
        removeNotification(notification, true);
    });
}

// ===== NOTIFICATION TYPES HELPERS =====
function showSuccess(message, duration = null) {
    return showNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);
}

function showError(message, duration = null) {
    return showNotification(message, NOTIFICATION_TYPES.ERROR, duration);
}

function showWarning(message, duration = null) {
    return showNotification(message, NOTIFICATION_TYPES.WARNING, duration);
}

function showInfo(message, duration = null) {
    return showNotification(message, NOTIFICATION_TYPES.INFO, duration);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Clear notifications with Escape
    if (e.key === 'Escape' && e.ctrlKey) {
        clearAllNotifications();
    }
});

// ===== ADD CSS ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationProgress {
        from { width: 100%; }
        to { width: 0%; }
    }
    
    .notification {
        animation: notificationSlideIn 0.3s ease forwards;
    }
    
    @keyframes notificationSlideIn {
        from {
            transform: translateX(120%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ===== EXPOSE GLOBALLY =====
window.showNotification = showNotification;
window.showSuccess = showSuccess;
window.showError = showError;
window.showWarning = showWarning;
window.showInfo = showInfo;
window.clearAllNotifications = clearAllNotifications;

console.log('✅ Notifications Module loaded successfully');