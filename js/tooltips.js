/* ========================================
   CAR-ENTERPRISE - TOOLTIPS MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initTooltips();
});

// ===== TOOLTIPS CONFIG =====
const TOOLTIPS_CONFIG = {
    DEFAULT_PLACEMENT: 'top',
    DEFAULT_TRIGGER: 'hover',
    DEFAULT_DELAY: 200,
    DEFAULT_DURATION: 300,
    DEFAULT_OFFSET: 8,
    STORAGE_KEY: 'tooltips_enabled'
};

// ===== TOOLTIPS STATE =====
let tooltipsEnabled = true;
let activeTooltips = [];

// ===== INIT TOOLTIPS =====
function initTooltips() {
    // Load tooltips preference
    loadTooltipsPreference();
    
    // Init tooltip triggers
    initTooltipTriggers();
    
    // Init dynamic tooltips
    initDynamicTooltips();
}

// ===== LOAD TOOLTIPS PREFERENCE =====
function loadTooltipsPreference() {
    try {
        const saved = localStorage.getItem(TOOLTIPS_CONFIG.STORAGE_KEY);
        if (saved !== null) {
            tooltipsEnabled = saved === 'true';
        }
    } catch (error) {
        console.error('Failed to load tooltips preference:', error);
    }
}

// ===== SAVE TOOLTIPS PREFERENCE =====
function saveTooltipsPreference() {
    try {
        localStorage.setItem(TOOLTIPS_CONFIG.STORAGE_KEY, String(tooltipsEnabled));
    } catch (error) {
        console.error('Failed to save tooltips preference:', error);
    }
}

// ===== INIT TOOLTIP TRIGGERS =====
function initTooltipTriggers() {
    const triggers = document.querySelectorAll('[data-tooltip]');
    
    triggers.forEach(function(trigger) {
        // Skip if already initialized
        if (trigger.dataset.tooltipInitialized) return;
        trigger.dataset.tooltipInitialized = 'true';
        
        const content = trigger.dataset.tooltip;
        const placement = trigger.dataset.tooltipPlacement || TOOLTIPS_CONFIG.DEFAULT_PLACEMENT;
        const triggerType = trigger.dataset.tooltipTrigger || TOOLTIPS_CONFIG.DEFAULT_TRIGGER;
        const delay = parseInt(trigger.dataset.tooltipDelay) || TOOLTIPS_CONFIG.DEFAULT_DELAY;
        
        let tooltip = null;
        let timeoutId = null;
        
        // Hover trigger
        if (triggerType === 'hover' || triggerType === 'both') {
            trigger.addEventListener('mouseenter', function() {
                if (!tooltipsEnabled) return;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    tooltip = createTooltip(trigger, content, placement);
                }, delay);
            });
            
            trigger.addEventListener('mouseleave', function() {
                clearTimeout(timeoutId);
                if (tooltip) {
                    removeTooltip(tooltip);
                    tooltip = null;
                }
            });
        }
        
        // Click trigger
        if (triggerType === 'click' || triggerType === 'both') {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                if (!tooltipsEnabled) return;
                
                if (tooltip) {
                    removeTooltip(tooltip);
                    tooltip = null;
                } else {
                    tooltip = createTooltip(trigger, content, placement);
                    
                    // Close on outside click
                    const closeHandler = function(e) {
                        if (!tooltip.contains(e.target)) {
                            removeTooltip(tooltip);
                            tooltip = null;
                            document.removeEventListener('click', closeHandler);
                        }
                    };
                    setTimeout(function() {
                        document.addEventListener('click', closeHandler);
                    }, 10);
                }
            });
        }
        
        // Focus trigger (for accessibility)
        trigger.addEventListener('focus', function() {
            if (!tooltipsEnabled) return;
            if (triggerType === 'hover' || triggerType === 'both') {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(function() {
                    tooltip = createTooltip(trigger, content, placement);
                }, delay);
            }
        });
        
        trigger.addEventListener('blur', function() {
            if (triggerType === 'hover' || triggerType === 'both') {
                clearTimeout(timeoutId);
                if (tooltip) {
                    removeTooltip(tooltip);
                    tooltip = null;
                }
            }
        });
    });
}

// ===== CREATE TOOLTIP =====
function createTooltip(trigger, content, placement) {
    // Remove any existing tooltip for this trigger
    const existingTooltip = document.querySelector(`.tooltip[data-for="${trigger.id || 'unknown'}"]`);
    if (existingTooltip) {
        removeTooltip(existingTooltip);
    }
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'false');
    tooltip.dataset.for = trigger.id || 'unknown';
    
    // Set content
    tooltip.innerHTML = content;
    
    // Add arrow
    const arrow = document.createElement('div');
    arrow.className = 'tooltip-arrow';
    tooltip.appendChild(arrow);
    
    // Add to body
    document.body.appendChild(tooltip);
    
    // Position tooltip
    positionTooltip(tooltip, trigger, placement);
    
    // Add to active tooltips
    activeTooltips.push(tooltip);
    
    // Animate in
    requestAnimationFrame(function() {
        tooltip.classList.add('visible');
    });
    
    // Add close on escape
    const escapeHandler = function(e) {
        if (e.key === 'Escape' && tooltip.classList.contains('visible')) {
            removeTooltip(tooltip);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    return tooltip;
}

// ===== POSITION TOOLTIP =====
function positionTooltip(tooltip, trigger, placement) {
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const offset = TOOLTIPS_CONFIG.DEFAULT_OFFSET;
    
    let top, left;
    
    switch (placement) {
        case 'top':
            top = triggerRect.top - tooltipRect.height - offset + window.pageYOffset;
            left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + window.pageXOffset;
            break;
        case 'bottom':
            top = triggerRect.bottom + offset + window.pageYOffset;
            left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + window.pageXOffset;
            break;
        case 'left':
            top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2) + window.pageYOffset;
            left = triggerRect.left - tooltipRect.width - offset + window.pageXOffset;
            break;
        case 'right':
            top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2) + window.pageYOffset;
            left = triggerRect.right + offset + window.pageXOffset;
            break;
        default:
            top = triggerRect.top - tooltipRect.height - offset + window.pageYOffset;
            left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + window.pageXOffset;
    }
    
    // Keep tooltip within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
    }
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10;
    }
    
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
    
    // Update arrow position
    const arrow = tooltip.querySelector('.tooltip-arrow');
    if (arrow) {
        const arrowSize = 8;
        let arrowTop, arrowLeft;
        
        switch (placement) {
            case 'top':
                arrowTop = tooltipRect.height;
                arrowLeft = (tooltipRect.width / 2) - (arrowSize);
                break;
            case 'bottom':
                arrowTop = -arrowSize;
                arrowLeft = (tooltipRect.width / 2) - (arrowSize);
                break;
            case 'left':
                arrowTop = (tooltipRect.height / 2) - (arrowSize);
                arrowLeft = tooltipRect.width;
                break;
            case 'right':
                arrowTop = (tooltipRect.height / 2) - (arrowSize);
                arrowLeft = -arrowSize;
                break;
            default:
                arrowTop = tooltipRect.height;
                arrowLeft = (tooltipRect.width / 2) - (arrowSize);
        }
        
        arrow.style.top = arrowTop + 'px';
        arrow.style.left = arrowLeft + 'px';
    }
}

// ===== REMOVE TOOLTIP =====
function removeTooltip(tooltip) {
    if (!tooltip || !tooltip.parentNode) return;
    
    tooltip.classList.remove('visible');
    tooltip.setAttribute('aria-hidden', 'true');
    
    // Remove from active tooltips
    activeTooltips = activeTooltips.filter(t => t !== tooltip);
    
    setTimeout(function() {
        if (tooltip.parentNode) {
            tooltip.remove();
        }
    }, TOOLTIPS_CONFIG.DEFAULT_DURATION);
}

// ===== REMOVE ALL TOOLTIPS =====
function removeAllTooltips() {
    activeTooltips.forEach(function(tooltip) {
        removeTooltip(tooltip);
    });
    activeTooltips = [];
}

// ===== ENABLE TOOLTIPS =====
function enableTooltips() {
    tooltipsEnabled = true;
    saveTooltipsPreference();
}

// ===== DISABLE TOOLTIPS =====
function disableTooltips() {
    tooltipsEnabled = false;
    removeAllTooltips();
    saveTooltipsPreference();
}

// ===== TOGGLE TOOLTIPS =====
function toggleTooltips() {
    if (tooltipsEnabled) {
        disableTooltips();
    } else {
        enableTooltips();
    }
    return tooltipsEnabled;
}

// ===== ARE TOOLTIPS ENABLED =====
function areTooltipsEnabled() {
    return tooltipsEnabled;
}

// ===== INIT DYNAMIC TOOLTIPS =====
function initDynamicTooltips() {
    // Observer for dynamically added elements with data-tooltip
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) {
                        // Check if the node itself has data-tooltip
                        if (node.hasAttribute && node.hasAttribute('data-tooltip')) {
                            // Re-initialize tooltips
                            initTooltipTriggers();
                        }
                        // Check for children with data-tooltip
                        const children = node.querySelectorAll ? node.querySelectorAll('[data-tooltip]') : [];
                        if (children.length > 0) {
                            initTooltipTriggers();
                        }
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ===== EXPOSE GLOBALLY =====
window.createTooltip = createTooltip;
window.removeTooltip = removeTooltip;
window.removeAllTooltips = removeAllTooltips;
window.enableTooltips = enableTooltips;
window.disableTooltips = disableTooltips;
window.toggleTooltips = toggleTooltips;
window.areTooltipsEnabled = areTooltipsEnabled;

console.log('✅ Tooltips Module loaded successfully');