const mongoose = require('mongoose');

const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

const MONGODB_URI = 'mongodb://p:p7@ac-cwbwivl-shard-00-00.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-01.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-02.2c3xeq3.mongodb.net:27017/medinova?ssl=true&replicaSet=atlas-12gjwt-shard-0&authSource=admin&appName=Cluster0';

const doctors = [
    { name: 'Dr. Rajesh Kumar', specialization: 'Cardiologist', department: 'Cardiology', experience: '15+ years', education: 'MBBS, MD - AIIMS Delhi', timings: 'Mon-Fri, 9AM-3PM', rating: 4.9, email: 'rajesh.kumar@medinova.in', phone: '+91-99991', isActive: true },
    { name: 'Dr. Priya Sharma', specialization: 'Neurologist', department: 'Neurology', experience: '12+ years', education: 'MBBS, DM - PGI Chandigarh', timings: 'Tue-Sat, 10AM-4PM', rating: 4.8, email: 'priya.sharma@medinova.in', phone: '+91-99992', isActive: true },
    { name: 'Dr. Amit Patel', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', experience: '18+ years', education: 'MBBS, MS - KEM Mumbai', timings: 'Mon-Thu, 8AM-2PM', rating: 4.9, email: 'amit.patel@medinova.in', phone: '+91-99993', isActive: true },
    { name: 'Dr. Sneha Reddy', specialization: 'Pediatrician', department: 'Pediatrics', experience: '10+ years', education: 'MBBS, MD - JIPMER', timings: 'Wed-Mon, 11AM-5PM', rating: 4.7, email: 'sneha.reddy@medinova.in', phone: '+91-99994', isActive: true },
    { name: 'Dr. Vikram Singh', specialization: 'Cardiologist', department: 'Cardiology', experience: '14+ years', education: 'MBBS, DM - AIIMS Delhi', timings: 'Mon-Fri, 11AM-7PM', rating: 4.8, email: 'vikram.singh@medinova.in', phone: '+91-99995', isActive: true },
    { name: 'Dr. Ananya Gupta', specialization: 'Neurologist', department: 'Neurology', experience: '11+ years', education: 'MBBS, DM - NIMHANS', timings: 'Mon-Fri, 8AM-2PM', rating: 4.9, email: 'ananya.gupta@medinova.in', phone: '+91-99996', isActive: true },
    { name: 'Dr. Suresh Iyer', specialization: 'Cardiologist', department: 'Cardiology', experience: '20+ years', education: 'MBBS, MD - Madras Medical College', timings: 'Tue-Sat, 8AM-4PM', rating: 4.6, email: 'suresh.iyer@medinova.in', phone: '+91-99997', isActive: true },
    { name: 'Dr. Kavita Desai', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', experience: '13+ years', education: 'MBBS, MS - Grant Medical Mumbai', timings: 'Mon-Fri, 7AM-1PM', rating: 4.7, email: 'kavita.desai@medinova.in', phone: '+91-99998', isActive: true },
    { name: 'Dr. Rohan Malhotra', specialization: 'Pediatrician', department: 'Pediatrics', experience: '9+ years', education: 'MBBS, MD - AIIMS Delhi', timings: 'Mon-Fri, 9AM-3PM', rating: 4.8, email: 'rohan.malhotra@medinova.in', phone: '+91-99999', isActive: true },
    { name: 'Dr. Meera Nair', specialization: 'Neurologist', department: 'Neurology', experience: '16+ years', education: 'MBBS, DM - SCTIMST', timings: 'Wed-Sun, 9AM-5PM', rating: 4.9, email: 'meera.nair@medinova.in', phone: '+91-99910', isActive: true },
    { name: 'Dr. Arjun Menon', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', experience: '11+ years', education: 'MBBS, MS - CMC Vellore', timings: 'Tue-Sat, 10AM-6PM', rating: 4.8, email: 'arjun.menon@medinova.in', phone: '+91-99911', isActive: true },
    { name: 'Dr. Deepika Chopra', specialization: 'Cardiologist', department: 'Cardiology', experience: '17+ years', education: 'MBBS, DM - GB Pant Delhi', timings: 'Mon-Thu, 7AM-1PM', rating: 4.9, email: 'deepika.chopra@medinova.in', phone: '+91-99912', isActive: true }
];

const patients = [
    { name: 'Rahul Sharma', email: 'rahul@email.com', password: 'password123', phone: '+91-98101-0001' },
    { name: 'Neha Gupta', email: 'neha@email.com', password: 'password123', phone: '+91-98101-0002' },
    { name: 'Arun Nair', email: 'arun@email.com', password: 'password123', phone: '+91-98101-0003' },
    { name: 'Priya Patel', email: 'priya@email.com', password: 'password123', phone: '+91-98101-0004' },
    { name: 'Vikram Reddy', email: 'vikram@email.com', password: 'password123', phone: '+91-98101-0005' }
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas');

        await Doctor.deleteMany({});
        await Patient.deleteMany({});
        await Appointment.deleteMany({});
        console.log('🧹 Cleared old data');

        const createdDoctors = await Doctor.insertMany(doctors);
        console.log(`👨‍⚕️ Inserted ${createdDoctors.length} doctors`);

        const createdPatients = await Patient.insertMany(patients);
        console.log(`👥 Inserted ${createdPatients.length} patients`);

        console.log('\n✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

seedDB();