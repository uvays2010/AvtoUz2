/* ========================================
   CAR-ENTERPRISE - ORDER MODEL
   Version: 1.0.0
   ======================================== */

// ===== ORDER SCHEMA =====
const OrderSchema = {
    id: { type: Number, required: true },
    userId: { type: Number, required: true },
    items: { 
        type: Array, 
        required: true,
        items: {
            carId: { type: Number, required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true, min: 0 }
        }
    },
    total: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    status: { 
        type: String, 
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
        default: 'pending' 
    },
    paymentMethod: { 
        type: String, 
        enum: ['card', 'cash', 'bank', 'payme', 'click'],
        required: true 
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, default: '' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    notes: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    deliveredAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

// ===== ORDER STATUS LABELS =====
const ORDER_STATUS_LABELS = {
    pending: 'Kutilmoqda',
    processing: 'Jarayonda',
    shipped: 'Yuborilgan',
    delivered: 'Yetkazilgan',
    cancelled: 'Bekor qilingan',
    refunded: 'Qaytarilgan'
};

const ORDER_STATUS_COLORS = {
    pending: '#ffc107',
    processing: '#17a2b8',
    shipped: '#007bff',
    delivered: '#28a745',
    cancelled: '#dc3545',
    refunded: '#6c757d'
};

const ORDER_STATUS_ICONS = {
    pending: 'fa-clock',
    processing: 'fa-spinner',
    shipped: 'fa-truck',
    delivered: 'fa-check-circle',
    cancelled: 'fa-times-circle',
    refunded: 'fa-undo'
};

// ===== PAYMENT METHOD LABELS =====
const PAYMENT_METHOD_LABELS = {
    card: 'Karta orqali',
    cash: 'Naqd pul',
    bank: 'Bank o\'tkazmasi',
    payme: 'Payme',
    click: 'Click'
};

// ===== ORDER METHODS =====
class Order {
    constructor(data) {
        Object.assign(this, OrderSchema);
        Object.assign(this, data);
        this.calculateTotals();
    }

    // Calculate totals
    calculateTotals() {
        this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.tax = Math.round(this.subtotal * 0.12);
        this.shipping = this.subtotal > 10000000 ? 0 : 0;
        this.total = this.subtotal + this.tax + this.shipping - (this.discount || 0);
        return this;
    }

    // Get status label
    getStatusLabel() {
        return ORDER_STATUS_LABELS[this.status] || this.status;
    }

    // Get status color
    getStatusColor() {
        return ORDER_STATUS_COLORS[this.status] || '#6c757d';
    }

    // Get status icon
    getStatusIcon() {
        return ORDER_STATUS_ICONS[this.status] || 'fa-circle';
    }

    // Get payment method label
    getPaymentMethodLabel() {
        return PAYMENT_METHOD_LABELS[this.paymentMethod] || this.paymentMethod;
    }

    // Check if order is active
    isActive() {
        return !['cancelled', 'delivered', 'refunded'].includes(this.status);
    }

    // Check if order can be cancelled
    canBeCancelled() {
        return ['pending', 'processing'].includes(this.status);
    }

    // Check if order can be refunded
    canBeRefunded() {
        return this.status === 'delivered' && this.paymentStatus === 'paid';
    }

    // Get item count
    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Get formatted total
    getFormattedTotal() {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(this.total);
    }

    // Get formatted subtotal
    getFormattedSubtotal() {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(this.subtotal);
    }

    // Get formatted tax
    getFormattedTax() {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(this.tax);
    }

    // Get formatted shipping
    getFormattedShipping() {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(this.shipping);
    }

    // Get formatted discount
    getFormattedDiscount() {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(this.discount || 0);
    }

    // Get formatted date
    getFormattedDate() {
        return new Intl.DateTimeFormat('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(this.createdAt);
    }

    // Get delivery estimate
    getDeliveryEstimate() {
        if (this.status === 'delivered') return 'Yetkazilgan';
        if (this.status === 'cancelled') return 'Bekor qilingan';
        
        const created = new Date(this.createdAt);
        const estimate = new Date(created);
        estimate.setDate(estimate.getDate() + 3); // 3 days delivery
        
        return new Intl.DateTimeFormat('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(estimate);
    }

    // Get order summary
    getSummary() {
        return {
            id: this.id,
            status: this.status,
            statusLabel: this.getStatusLabel(),
            total: this.total,
            formattedTotal: this.getFormattedTotal(),
            itemCount: this.getItemCount(),
            date: this.getFormattedDate(),
            paymentMethod: this.getPaymentMethodLabel(),
            deliveryEstimate: this.getDeliveryEstimate()
        };
    }

    // Get order details for display
    getDetails() {
        return {
            ...this.getSummary(),
            items: this.items.map(item => ({
                ...item,
                formattedPrice: new Intl.NumberFormat('uz-UZ', {
                    style: 'currency',
                    currency: 'UZS',
                    minimumFractionDigits: 0
                }).format(item.price),
                formattedTotal: new Intl.NumberFormat('uz-UZ', {
                    style: 'currency',
                    currency: 'UZS',
                    minimumFractionDigits: 0
                }).format(item.price * item.quantity)
            })),
            subtotal: this.subtotal,
            formattedSubtotal: this.getFormattedSubtotal(),
            tax: this.tax,
            formattedTax: this.getFormattedTax(),
            shipping: this.shipping,
            formattedShipping: this.getFormattedShipping(),
            discount: this.discount || 0,
            formattedDiscount: this.getFormattedDiscount(),
            address: this.address,
            city: this.city,
            fullName: this.fullName,
            phone: this.phone,
            email: this.email,
            notes: this.notes,
            trackingNumber: this.trackingNumber,
            createdAt: this.createdAt,
            deliveredAt: this.deliveredAt
        };
    }

    // Convert to JSON
    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            items: this.items,
            total: this.total,
            subtotal: this.subtotal,
            tax: this.tax,
            shipping: this.shipping,
            discount: this.discount || 0,
            status: this.status,
            paymentMethod: this.paymentMethod,
            paymentStatus: this.paymentStatus,
            address: this.address,
            city: this.city,
            zipCode: this.zipCode,
            phone: this.phone,
            email: this.email,
            fullName: this.fullName,
            notes: this.notes,
            trackingNumber: this.trackingNumber,
            deliveredAt: this.deliveredAt,
            cancelledAt: this.cancelledAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Create from JSON
    static fromJSON(data) {
        return new Order(data);
    }

    // Validate order data
    static validate(data) {
        const errors = [];

        if (!data.userId || typeof data.userId !== 'number') {
            errors.push('Foydalanuvchi ID si noto\'g\'ri');
        }

        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
            errors.push('Mahsulotlar ro\'yxati bo\'sh');
        }

        data.items.forEach((item, index) => {
            if (!item.carId || typeof item.carId !== 'number') {
                errors.push(`Mahsulot ${index + 1}: Mashina ID si noto\'g\'ri`);
            }
            if (!item.quantity || item.quantity < 1) {
                errors.push(`Mahsulot ${index + 1}: Soni noto\'g\'ri`);
            }
            if (!item.price || item.price < 0) {
                errors.push(`Mahsulot ${index + 1}: Narx noto\'g\'ri`);
            }
        });

        if (!data.paymentMethod) {
            errors.push('To\'lov usuli tanlanmagan');
        }

        if (!data.address) {
            errors.push('Manzil kiritilmagan');
        }

        if (!data.city) {
            errors.push('Shahar kiritilmagan');
        }

        if (!data.fullName) {
            errors.push('Ism va familiya kiritilmagan');
        }

        if (!data.phone) {
            errors.push('Telefon raqam kiritilmagan');
        }

        if (!data.email) {
            errors.push('Email kiritilmagan');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// ===== EXPORTS =====
module.exports = Order;