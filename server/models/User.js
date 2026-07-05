/* ========================================
   CAR-ENTERPRISE - USER MODEL
   ======================================== */

const bcrypt = require('bcryptjs');

// ===== USER SCHEMA =====
const UserSchema = {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'moderator'], default: 'user' },
    phone: { type: String, default: '' },
    avatar: { type: String, default: 'default.jpg' },
    address: { type: String, default: '' },
    joined: { type: Date, default: Date.now },
    rating: { type: Number, default: 0 },
    favorites: { type: [Number], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
};

// ===== USER METHODS =====
class User {
    constructor(data) {
        Object.assign(this, UserSchema);
        Object.assign(this, data);
    }

    // Hash password
    static async hashPassword(password) {
        return bcrypt.hash(password, 10);
    }

    // Compare password
    async comparePassword(password) {
        return bcrypt.compare(password, this.password);
    }

    // Check if admin
    isAdmin() {
        return this.role === 'admin';
    }

    // Get full name
    getFullName() {
        return this.name;
    }

    // Get initials
    getInitials() {
        return this.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Get formatted join date
    getFormattedJoinDate() {
        return new Intl.DateTimeFormat('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(this.joined);
    }

    // Convert to JSON (exclude password)
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            phone: this.phone,
            avatar: this.avatar,
            address: this.address,
            joined: this.joined,
            rating: this.rating,
            favorites: this.favorites,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Safe JSON (exclude sensitive data)
    toSafeJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            phone: this.phone,
            avatar: this.avatar,
            address: this.address,
            joined: this.joined,
            rating: this.rating
        };
    }
}

// ===== EXPORTS =====
module.exports = User;