const mongoose = require('mongoose');

const connectDB = async () => {
    // Disable buffering so we get immediate errors if not connected
    mongoose.set('bufferCommands', false);

    const options = {

        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    };

    try {
        const mongoUri = process.env.MONGO_URI;
        if (mongoUri) {
            console.log('Attempting to connect to MONGO_URI from .env...');
            const conn = await mongoose.connect(mongoUri, options);
            console.log(`✅ MongoDB Connected (Remote): ${conn.connection.host}`);
            return;
        }

        console.log('No MONGO_URI found in environment, trying local MongoDB...');
        const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/singh-automobile', options);
        console.log(`✅ MongoDB Connected (Local): ${localConn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);

        // If we failed remote, or remote wasn't provided, and we haven't successfully connected local yet
        if (process.env.MONGO_URI) {
            console.log('Falling back to local MongoDB...');
            try {
                const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/singh-automobile', options);
                console.log(`✅ Local MongoDB Connected: ${localConn.connection.host}`);
                return;
            } catch (localError) {
                console.error(`❌ Local MongoDB Connection Error: ${localError.message}`);
            }
        }

        console.log('CRITICAL: Database not available. Server will likely fail on queries.');
        // Throw error so index.js knows we failed to connect
        // throw new Error('Could not connect to any MongoDB instance');

        // Actually, let's just log it. If the user wants the server to run anyway, we can.
        // But for debugging this specific timeout, it's better to know why it's not connecting.
    }
};

module.exports = connectDB;

