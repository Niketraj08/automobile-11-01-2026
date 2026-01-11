const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const logFile = 'connection_test.log';
fs.writeFileSync(logFile, 'Starting connection test...\n');

const test = async () => {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/singh-automobile';
    // Mask password in log
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    const startMsg = `Attempting to connect to: ${maskedUri}`;
    fs.appendFileSync(logFile, startMsg + '\n');
    console.log(startMsg);

    try {
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        });
        const successMsg = '✅ Successfully connected to MongoDB!';
        fs.appendFileSync(logFile, successMsg + '\n');
        console.log(successMsg);

        // Try a simple operation
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionsMsg = `Found ${collections.length} collections`;
        fs.appendFileSync(logFile, collectionsMsg + '\n');
        console.log(collectionsMsg);

        await mongoose.connection.close();
    } catch (err) {
        const failMsg = `❌ Connection failed: ${err.message}`;
        fs.appendFileSync(logFile, failMsg + '\n');
        console.error(failMsg);
        if (err.reason) {
            const reasonMsg = `Reason: ${JSON.stringify(err.reason)}`;
            fs.appendFileSync(logFile, reasonMsg + '\n');
            console.error(reasonMsg);
        }
    }
    process.exit(0);
};

test();

