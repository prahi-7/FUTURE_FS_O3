const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST contact form
router.post('/', async (req, res) => {
    try {
        const contact = await Contact.create(req.body);
        res.status(201).json({ 
            success: true, 
            message: 'Message sent successfully!',
            data: contact 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// GET all contacts
router.get('/', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json({ success: true, count: contacts.length, data: contacts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;