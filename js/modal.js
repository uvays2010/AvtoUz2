/* ========================================
   CAR-ENTERPRISE - MODAL MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initModals();
});

// ===== MODAL CONFIG =====
const modalConfig = {
    closeOnOverlay: true,
    closeOnEscape: true,
    animationDuration: 300
};

// ===== INIT MODALS =====
function initModals() {
    // Modal triggers
    const triggers = document.querySelectorAll('[data-modal]');
    
    triggers.forEach(function(trigger) {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.dataset.modal;
            openModal(modalId);
        });
    });
    
    // Modal close buttons
    const closeBtns = document.querySelectorAll('.modal-close, .modal [data-close]');
    
    closeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Close on overlay click
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (modalConfig.closeOnOverlay && e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalConfig.closeOnEscape) {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

// ===== OPEN MODAL =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Close any open modals first
    document.querySelectorAll('.modal.active').forEach(function(m) {
        closeModal(m.id, true);
    });
    
    // Show modal
    modal.classList.remove('animate-out');
    modal.classList.add('active', 'animate-in');
    document.body.style.overflow = 'hidden';
    
    // Trigger open event
    const event = new CustomEvent('modalOpen', { detail: { modalId: modalId } });
    document.dispatchEvent(event);
    
    // Focus trap
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) {
        setTimeout(function() {
            focusable[0].focus();
        }, 100);
    }
}

// ===== CLOSE MODAL =====
function closeModal(modalId, instant = false) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    if (instant) {
        modal.classList.remove('active', 'animate-in', 'animate-out');
        document.body.style.overflow = '';
    } else {
        modal.classList.remove('animate-in');
        modal.classList.add('animate-out');
        setTimeout(function() {
            modal.classList.remove('active', 'animate-out');
            document.body.style.overflow = '';
        }, modalConfig.animationDuration);
    }
    
    // Trigger close event
    const event = new CustomEvent('modalClose', { detail: { modalId: modalId } });
    document.dispatchEvent(event);
}

// ===== CREATE MODAL =====
function createModal(options) {
    const {
        id,
        title,
        content,
        size = 'md',
        closeable = true,
        actions = [],
        className = ''
    } = options;
    
    // Check if modal already exists
    if (document.getElementById(id)) {
        return document.getElementById(id);
    }
    
    const modal = document.createElement('div');
    modal.className = `modal ${size} ${className}`;
    modal.id = id;
    
    let actionsHtml = '';
    if (actions.length) {
        actionsHtml = `
            <div class="modal-footer">
                ${actions.map(action => `
                    <button class="btn ${action.class || 'btn-secondary'}" 
                            data-action="${action.id || 'action'}"
                            ${action.onclick ? `onclick="${action.onclick}"` : ''}>
                        ${action.label}
                    </button>
                `).join('')}
            </div>
        `;
    }
    
    modal.innerHTML = `
        <div class="modal-content">
            ${title ? `
                <div class="modal-header">
                    <h3>${title}</h3>
                    ${closeable ? '<button class="modal-close" data-close>&times;</button>' : ''}
                </div>
            ` : ''}
            <div class="modal-body">
                ${content}
            </div>
            ${actionsHtml}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add close functionality
    if (closeable) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                closeModal(id);
            });
        }
    }
    
    return modal;
}

// ===== CONFIRM MODAL =====
function confirmModal(options) {
    const {
        title = 'Tasdiqlang',
        message = 'Bu amalni bajarishga ishonchingiz komilmi?',
        confirmText = 'Tasdiqlash',
        cancelText = 'Bekor qilish',
        confirmClass = 'btn-danger',
        onConfirm = null,
        onCancel = null
    } = options;
    
    const modalId = 'confirm-modal-' + Date.now();
    
    const modal = createModal({
        id: modalId,
        title: title,
        content: `<p style="text-align:center;font-size:var(--font-lg);">${message}</p>`,
        size: 'sm',
        className: 'confirm',
        actions: [
            { label: cancelText, class: 'btn-outline', onclick: `closeModal('${modalId}')` },
            { label: confirmText, class: confirmClass, id: 'confirm-action' }
        ]
    });
    
    openModal(modalId);
    
    const confirmBtn = modal.querySelector('#confirm-action');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            closeModal(modalId);
            if (onConfirm && typeof onConfirm === 'function') {
                onConfirm();
            }
        });
    }
    
    if (onCancel && typeof onCancel === 'function') {
        modal.addEventListener('modalClose', function(e) {
            if (e.detail.modalId === modalId) {
                onCancel();
            }
        });
    }
    
    return modal;
}

// ===== ALERT MODAL =====
function alertModal(options) {
    const {
        title = 'Xabar',
        message,
        icon = 'info',
        buttonText = 'OK',
        buttonClass = 'btn-primary',
        onClose = null
    } = options;
    
    const modalId = 'alert-modal-' + Date.now();
    
    const iconMap = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    const iconClassMap = {
        success: 'success',
        error: 'danger',
        warning: 'warning',
        info: 'info'
    };
    
    const iconHtml = icon ? `<span class="modal-icon ${iconClassMap[icon] || 'info'}">${iconMap[icon] || 'ℹ️'}</span>` : '';
    
    const modal = createModal({
        id: modalId,
        title: title,
        content: `${iconHtml}<p style="text-align:center;font-size:var(--font-md);">${message}</p>`,
        size: 'sm',
        className: icon ? icon : '',
        actions: [
            { label: buttonText, class: buttonClass, id: 'alert-action' }
        ]
    });
    
    openModal(modalId);
    
    const alertBtn = modal.querySelector('#alert-action');
    if (alertBtn) {
        alertBtn.addEventListener('click', function() {
            closeModal(modalId);
            if (onClose && typeof onClose === 'function') {
                onClose();
            }
        });
    }
    
    return modal;
}

// ===== SUCCESS MODAL =====
function successModal(options) {
    const {
        title = 'Muvaffaqiyatli!',
        message = 'Amal muvaffaqiyatli bajarildi!',
        buttonText = 'OK',
        onClose = null
    } = options;
    
    return alertModal({
        title,
        message,
        icon: 'success',
        buttonText,
        buttonClass: 'btn-success',
        onClose
    });
}

// ===== ERROR MODAL =====
function errorModal(options) {
    const {
        title = 'Xatolik!',
        message = 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
        buttonText = 'OK',
        onClose = null
    } = options;
    
    return alertModal({
        title,
        message,
        icon: 'error',
        buttonText,
        buttonClass: 'btn-danger',
        onClose
    });
}

// ===== EXPOSE GLOBALLY =====
window.openModal = openModal;
window.closeModal = closeModal;
window.createModal = createModal;
window.confirmModal = confirmModal;
window.alertModal = alertModal;
window.successModal = successModal;
window.errorModal = errorModal;

console.log('✅ Modal Module loaded successfully');