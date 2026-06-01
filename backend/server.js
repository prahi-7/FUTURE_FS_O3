const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas connection directly
const MONGODB_URI = 'mongodb://p:p7@ac-cwbwivl-shard-00-00.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-01.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-02.2c3xeq3.mongodb.net:27017/medinova?ssl=true&replicaSet=atlas-12gjwt-shard-0&authSource=admin&appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Atlas connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));

const Doctor = require('./models/doctor');
const Appointment = require('./models/appointment');
const Patient = require('./models/patient');
const Contact = require('./models/contact');

async function findDoctorById(id) {
    let doctor = await Doctor.findById(id).catch(() => null);
    if (!doctor) { const allDoctors = await Doctor.find({}); doctor = allDoctors.find(d => d._id.toString() === id); }
    return doctor;
}

// ============ DOCTORS ============
app.get('/api/doctors', async (req, res) => {
    try {
        const { department } = req.query;
        let query = { isActive: true };
        if (department) query.department = department;
        const doctors = await Doctor.find(query).sort({ name: 1 });
        res.json({ success: true, count: doctors.length, data: doctors });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/doctors/:id', async (req, res) => {
    try {
        const doctor = await findDoctorById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        res.json({ success: true, data: doctor });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/doctors/:id/slots', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ success: false, message: 'Date is required' });
        const doctor = await findDoctorById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        const allSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'];
        const bookedAppointments = await Appointment.find({ doctor: doctor._id, appointmentDate: new Date(date), status: { $in: ['pending', 'confirmed'] } }).select('timeSlot');
        const bookedSlots = bookedAppointments.map(a => a.timeSlot);
        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
        res.json({ success: true, data: { doctor: doctor.name, date, allSlots, bookedSlots, availableSlots } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post('/api/doctors', async (req, res) => {
    try { const doctor = await Doctor.create(req.body); res.status(201).json({ success: true, data: doctor }); }
    catch (error) { res.status(400).json({ success: false, message: error.message }); }
});

app.put('/api/doctors/:id', async (req, res) => {
    try {
        const doctor = await findDoctorById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        const updatedDoctor = await Doctor.findByIdAndUpdate(doctor._id, req.body, { new: true, runValidators: true });
        res.json({ success: true, message: 'Doctor updated!', data: updatedDoctor });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
});

app.delete('/api/doctors/:id', async (req, res) => {
    try {
        const doctor = await findDoctorById(req.params.id);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
        await Doctor.findByIdAndUpdate(doctor._id, { isActive: false });
        res.json({ success: true, message: 'Doctor removed' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// ============ APPOINTMENTS ============
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('doctor', 'name specialization department').sort({ createdAt: -1 });
        res.json({ success: true, count: appointments.length, data: appointments });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post('/api/appointments', async (req, res) => {
    try {
        const { patientName, email, phone, doctor, department, appointmentDate, timeSlot, notes } = req.body;
        if (!patientName || !email || !phone || !doctor || !appointmentDate || !timeSlot) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const doctorDoc = await findDoctorById(doctor);
        if (!doctorDoc) return res.status(404).json({ success: false, message: 'Doctor not found' });
        
        const existing = await Appointment.findOne({ doctor: doctorDoc._id, appointmentDate: new Date(appointmentDate), timeSlot, status: { $in: ['pending', 'confirmed'] } });
        if (existing) {
            return res.status(409).json({ success: false, message: '❌ Slot already booked! Please choose another time.' });
        }
        
        const appointment = await Appointment.create({ patientName, email, phone, doctor: doctorDoc._id, department: department || doctorDoc.department, appointmentDate: new Date(appointmentDate), timeSlot, notes: notes || '' });
        await appointment.populate('doctor', 'name specialization department');
        console.log('✅ Appointment:', patientName, '|', doctorDoc.name, '|', appointmentDate, timeSlot);
        res.status(201).json({ success: true, message: 'Appointment booked!', data: appointment });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
});

app.patch('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('doctor', 'name specialization');
        if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
        console.log('📝 Status updated:', appointment.patientName, '->', appointment.status);
        res.json({ success: true, message: 'Updated!', data: appointment });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.put('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('doctor', 'name specialization');
        if (!appointment) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Updated!', data: appointment });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// ============ PATIENTS ============
app.get('/api/patients', async (req, res) => {
    try { const patients = await Patient.find().select('-password'); res.json({ success: true, count: patients.length, data: patients }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.post('/api/patients/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existing = await Patient.findOne({ email });
        if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });
        const patient = await Patient.create({ name, email, password, phone });
        res.status(201).json({ success: true, message: 'Registered!', data: { id: patient._id, name: patient.name, email: patient.email } });
    } catch (error) { res.status(400).json({ success: false, message: error.message }); }
});

// ============ CONTACTS ============
app.post('/api/contacts', async (req, res) => {
    try { await Contact.create(req.body); res.status(201).json({ success: true, message: 'Message sent!' }); }
    catch (error) { res.status(400).json({ success: false, message: error.message }); }
});

app.get('/api/contacts', async (req, res) => {
    try { const contacts = await Contact.find().sort({ createdAt: -1 }); res.json({ success: true, count: contacts.length, data: contacts }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// ============ DASHBOARD ============
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [totalAppointments, confirmed, pending, cancelled, totalDoctors, totalPatients] = await Promise.all([
            Appointment.countDocuments(), Appointment.countDocuments({ status: 'confirmed' }), Appointment.countDocuments({ status: 'pending' }), Appointment.countDocuments({ status: 'cancelled' }), Doctor.countDocuments({ isActive: true }), Patient.countDocuments()
        ]);
        res.json({ success: true, data: { totalAppointments, confirmedAppointments: confirmed, pendingAppointments: pending, cancelledAppointments: cancelled, totalDoctors, totalPatients } });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

app.get('/api/health', (req, res) => { res.json({ success: true, message: 'MediNova API running' }); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`🚀 Server on http://localhost:${PORT}`); });