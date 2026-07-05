/* ========================================
   CAR-ENTERPRISE - CONTACT MODULE
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    if (!document.querySelector('.contact-section')) return;
    
    initContactForm();
});

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        // Validate
        if (!name) {
            showNotification('Iltimos, ismingizni kiriting', 'warning');
            document.getElementById('contactName').focus();
            return;
        }
        
        if (!email) {
            showNotification('Iltimos, email manzilingizni kiriting', 'warning');
            document.getElementById('contactEmail').focus();
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Iltimos, to\'g\'ri email kiriting', 'warning');
            document.getElementById('contactEmail').focus();
            return;
        }
        
        if (!subject) {
            showNotification('Iltimos, xabar mavzusini kiriting', 'warning');
            document.getElementById('contactSubject').focus();
            return;
        }
        
        if (!message) {
            showNotification('Iltimos, xabaringizni yozing', 'warning');
            document.getElementById('contactMessage').focus();
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
        
        // Simulate sending
        setTimeout(() => {
            // In production, send to API
            // API.contact.send({ name, email, subject, message })
            
            showNotification('Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.', 'success');
            
            // Reset form
            form.reset();
            
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            
        }, 1500);
    });
}

console.log('✅ Contact Module loaded successfully');