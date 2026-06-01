const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://p:p7@ac-cwbwivl-shard-00-00.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-01.2c3xeq3.mongodb.net:27017,ac-cwbwivl-shard-00-02.2c3xeq3.mongodb.net:27017/?ssl=true&replicaSet=atlas-12gjwt-shard-0&authSource=admin&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;