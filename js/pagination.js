/* ========================================
   CAR-ENTERPRISE - PAGINATION MODULE
   Version: 1.0.0
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    initPagination();
});

// ===== PAGINATION CONFIG =====
const PAGINATION_CONFIG = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_VISIBLE_PAGES: 5,
    STORAGE_KEY: 'pagination'
};

// ===== PAGINATION STATE =====
let paginationState = {
    currentPage: PAGINATION_CONFIG.DEFAULT_PAGE,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: PAGINATION_CONFIG.DEFAULT_LIMIT,
    visiblePages: PAGINATION_CONFIG.MAX_VISIBLE_PAGES
};

// ===== INIT PAGINATION =====
function initPagination() {
    // Load saved state
    loadPaginationState();
    
    // Init pagination controls
    initPaginationControls();
}

// ===== LOAD PAGINATION STATE =====
function loadPaginationState() {
    try {
        const saved = localStorage.getItem(PAGINATION_CONFIG.STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            paginationState = { ...paginationState, ...parsed };
        }
    } catch (error) {
        console.error('Failed to load pagination state:', error);
    }
}

// ===== SAVE PAGINATION STATE =====
function savePaginationState() {
    try {
        localStorage.setItem(PAGINATION_CONFIG.STORAGE_KEY, JSON.stringify({
            currentPage: paginationState.currentPage,
            itemsPerPage: paginationState.itemsPerPage
        }));
    } catch (error) {
        console.error('Failed to save pagination state:', error);
    }
}

// ===== INIT PAGINATION CONTROLS =====
function initPaginationControls() {
    // Pagination container
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    
    // Items per page selector
    const limitSelect = document.getElementById('itemsPerPage');
    if (limitSelect) {
        limitSelect.value = paginationState.itemsPerPage;
        limitSelect.addEventListener('change', function() {
            paginationState.itemsPerPage = parseInt(this.value);
            paginationState.currentPage = 1;
            savePaginationState();
            updatePagination();
        });
    }
}

// ===== UPDATE PAGINATION =====
function updatePagination(totalItems, currentPage = null, itemsPerPage = null) {
    // Update state
    if (totalItems !== undefined) {
        paginationState.totalItems = totalItems;
    }
    if (currentPage !== null) {
        paginationState.currentPage = currentPage;
    }
    if (itemsPerPage !== null) {
        paginationState.itemsPerPage = itemsPerPage;
    }
    
    // Calculate total pages
    paginationState.totalPages = Math.ceil(paginationState.totalItems / paginationState.itemsPerPage);
    
    // Ensure current page is valid
    if (paginationState.currentPage > paginationState.totalPages) {
        paginationState.currentPage = paginationState.totalPages || 1;
    }
    if (paginationState.currentPage < 1) {
        paginationState.currentPage = 1;
    }
    
    // Save state
    savePaginationState();
    
    // Render pagination
    renderPagination();
    
    // Update info
    updatePaginationInfo();
    
    // Return pagination data
    return getPaginationData();
}

// ===== RENDER PAGINATION =====
function renderPagination() {
    const container = document.querySelector('.pagination');
    if (!container) return;
    
    const { currentPage, totalPages, visiblePages } = paginationState;
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // Previous button
    html += `
        <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="goToPage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}
                aria-label="Oldingi sahifa">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage < visiblePages - 1) {
        const startAdjust = Math.max(1, endPage - visiblePages + 1);
        if (startAdjust < startPage) {
            // Recalculate from start
            const newStart = Math.max(1, endPage - visiblePages + 1);
            if (newStart < startPage) {
                // We need to show more pages at the beginning
                endPage = Math.min(totalPages, startPage + visiblePages - 1);
            }
        }
    }
    
    // First page
    if (startPage > 1) {
        html += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
        if (startPage > 2) {
            html += `<span class="page-dots">...</span>`;
        }
    }
    
    // Pages
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += `<span class="page-dots">...</span>`;
        }
        html += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    html += `
        <button class="page-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="goToPage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''}
                aria-label="Keyingi sahifa">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    container.innerHTML = html;
}

// ===== UPDATE PAGINATION INFO =====
function updatePaginationInfo() {
    const infoElement = document.getElementById('paginationInfo');
    if (!infoElement) return;
    
    const { currentPage, totalPages, totalItems, itemsPerPage } = paginationState;
    
    if (totalItems === 0) {
        infoElement.textContent = 'Hech qanday ma\'lumot topilmadi';
        return;
    }
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    infoElement.textContent = `${start}-${end} / ${totalItems} ta`;
}

// ===== GET PAGINATION DATA =====
function getPaginationData() {
    const { currentPage, itemsPerPage, totalItems, totalPages } = paginationState;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalItems);
    
    return {
        currentPage,
        itemsPerPage,
        totalItems,
        totalPages,
        start,
        end,
        hasPrevious: currentPage > 1,
        hasNext: currentPage < totalPages,
        previousPage: currentPage - 1,
        nextPage: currentPage + 1,
        getPageItems: function(items) {
            return items.slice(start, end);
        }
    };
}

// ===== GO TO PAGE =====
function goToPage(page) {
    const { totalPages } = paginationState;
    
    if (page < 1 || page > totalPages || page === paginationState.currentPage) {
        return;
    }
    
    paginationState.currentPage = page;
    savePaginationState();
    renderPagination();
    updatePaginationInfo();
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Trigger event
    document.dispatchEvent(new CustomEvent('pageChanged', {
        detail: {
            page: page,
            pagination: getPaginationData()
        }
    }));
}

// ===== RESET PAGINATION =====
function resetPagination() {
    paginationState.currentPage = PAGINATION_CONFIG.DEFAULT_PAGE;
    paginationState.totalPages = 1;
    paginationState.totalItems = 0;
    savePaginationState();
    renderPagination();
    updatePaginationInfo();
}

// ===== SET ITEMS PER PAGE =====
function setItemsPerPage(limit) {
    paginationState.itemsPerPage = limit;
    paginationState.currentPage = 1;
    savePaginationState();
    updatePagination();
}

// ===== GENERATE PAGINATION FOR DATA =====
function paginateData(data, page = null, limit = null) {
    const currentPage = page || paginationState.currentPage;
    const itemsPerPage = limit || paginationState.itemsPerPage;
    
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const validPage = Math.min(Math.max(currentPage, 1), totalPages || 1);
    const start = (validPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, totalItems);
    
    return {
        data: data.slice(start, end),
        pagination: {
            currentPage: validPage,
            itemsPerPage: itemsPerPage,
            totalItems: totalItems,
            totalPages: totalPages,
            start: start,
            end: end,
            hasPrevious: validPage > 1,
            hasNext: validPage < totalPages
        }
    };
}

// ===== PAGINATION WITH DATA =====
function renderPaginatedData(container, data, renderFunction, page = null, limit = null) {
    if (!container) return;
    
    const result = paginateData(data, page, limit);
    const { data: pageData, pagination } = result;
    
    // Update pagination state
    paginationState.currentPage = pagination.currentPage;
    paginationState.totalItems = pagination.totalItems;
    paginationState.totalPages = pagination.totalPages;
    paginationState.itemsPerPage = pagination.itemsPerPage;
    
    // Render data
    container.innerHTML = pageData.map(renderFunction).join('');
    
    // Update pagination UI
    updatePagination(pagination.totalItems);
    
    return result;
}

// ===== EXPOSE GLOBALLY =====
window.goToPage = goToPage;
window.resetPagination = resetPagination;
window.setItemsPerPage = setItemsPerPage;
window.paginateData = paginateData;
window.renderPaginatedData = renderPaginatedData;
window.getPaginationData = getPaginationData;

console.log('✅ Pagination Module loaded successfully');