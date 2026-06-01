const express = require('express');
const router = express.Router();
const Appointment = require('../models/appointment');

// GET all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('doctor', 'name specialization')
            .sort({ createdAt: -1 });
        res.json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST create appointment
router.post('/', async (req, res) => {
    try {
        console.log('Creating appointment:', req.body);
        const appointment = await Appointment.create(req.body);
        await appointment.populate('doctor', 'name specialization');
        res.status(201).json({ 
            success: true, 
            message: 'Appointment booked successfully!',
            data: appointment 
        });
    } catch (error) {
        console.error('Appointment error:', error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// PATCH update status
router.patch('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;