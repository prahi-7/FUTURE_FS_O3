const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://p:p7@ac-cwbwivl-shard-00-00.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-01.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-02.2c3xeq3.mongodb.net:27017/medinova?ssl=true&replicaSet=atlas-12gjwt-shard-0&authSource=admin&appName=Cluster0';

console.log('🔄 Trying to connect...');
console.log('URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide password

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('✅ CONNECTED!');
        console.log('Database:', mongoose.connection.db.databaseName);
        
        // Try to list collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));
        
        // Try to count doctors
        const Doctor = require('./models/Doctor');
        const count = await Doctor.countDocuments();
        console.log('Doctor count:', count);
        
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ CONNECTION FAILED!');
        console.error('Error:', err.message);
        process.exit(1);
    });