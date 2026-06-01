const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    dateOfBirth: Date,
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
patientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
patientSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Patient', patientSchema);