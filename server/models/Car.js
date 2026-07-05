/* ========================================
   CAR-ENTERPRISE - CAR MODEL
   ======================================== */

// ===== CAR SCHEMA =====
const CarSchema = {
    id: { type: Number, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    category: { type: String, required: true },
    fuelType: { type: String, required: true },
    transmission: { type: String, required: true },
    engine: { type: String, required: true },
    power: { type: Number, required: true },
    color: { type: String, required: true },
    mileage: { type: Number, default: 0 },
    condition: { type: String, enum: ['Yangi', 'Ishlatilgan'], required: true },
    status: { type: String, enum: ['Aktiv', 'Sotilgan', 'Kutilmoqda'], default: 'Aktiv' },
    description: { type: String, required: true },
    features: { type: [String], default: [] },
    images: { type: [String], default: ['cars/default.jpg'] },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

// ===== CAR METHODS =====
class Car {
    constructor(data) {
        Object.assign(this, CarSchema);
        Object.assign(this, data);
    }

    // Get full name
    getFullName() {
        return `${this.brand} ${this.model}`;
    }

    // Get discount percentage
    getDiscountPercent() {
        if (!this.oldPrice || this.oldPrice <= this.price) return 0;
        return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
    }

    // Check if on sale
    isOnSale() {
        return this.oldPrice && this.oldPrice > this.price;
    }

    // Get formatted price
    getFormattedPrice() {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(this.price);
    }

    // Get formatted old price
    getFormattedOldPrice() {
        if (!this.oldPrice) return null;
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            minimumFractionDigits: 0
        }).format(this.oldPrice);
    }

    // Convert to JSON
    toJSON() {
        return {
            id: this.id,
            brand: this.brand,
            model: this.model,
            year: this.year,
            price: this.price,
            oldPrice: this.oldPrice,
            category: this.category,
            fuelType: this.fuelType,
            transmission: this.transmission,
            engine: this.engine,
            power: this.power,
            color: this.color,
            mileage: this.mileage,
            condition: this.condition,
            status: this.status,
            description: this.description,
            features: this.features,
            images: this.images,
            rating: this.rating,
            reviews: this.reviews,
            isFeatured: this.isFeatured,
            isNew: this.isNew,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

// ===== EXPORTS =====
module.exports = Car;