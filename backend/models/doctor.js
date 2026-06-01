const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    specialization: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    experience: String,
    education: String,
    timings: String,
    rating: {
        type: Number,
        default: 4.5
    },
    patients: {
        type: Number,
        default: 0
    },
    email: {
        type: String,
        unique: true
    },
    phone: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Doctor', doctorSchema);