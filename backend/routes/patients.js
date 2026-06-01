const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        console.log('Register request:', req.body);
        const { name, email, password, phone } = req.body;

        // Check if exists
        const existingPatient = await Patient.findOne({ email });
        if (existingPatient) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // Create patient
        const patient = await Patient.create({ name, email, password, phone });
        console.log('Patient created:', patient._id);

        // Generate token
        const token = jwt.sign(
            { id: patient._id },
            process.env.JWT_SECRET || 'medinova_secret',
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            token,
            data: {
                id: patient._id,
                name: patient.name,
                email: patient.email,
                phone: patient.phone
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const patient = await Patient.findOne({ email }).select('+password');
        
        if (!patient || !(await patient.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: patient._id },
            process.env.JWT_SECRET || 'medinova_secret',
            { expiresIn: '30d' }
        );

        res.json({ success: true, token, data: { id: patient._id, name: patient.name, email: patient.email } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET ALL PATIENTS
router.get('/', async (req, res) => {
    try {
        const patients = await Patient.find().select('-password');
        res.json({ success: true, count: patients.length, data: patients });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET SINGLE PATIENT
router.get('/:id', async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).select('-password');
        if (!patient) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: patient });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;