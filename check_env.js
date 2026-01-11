require('dotenv').config({ path: './server/.env' });
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
if (process.env.MONGO_URI) {
    console.log('MONGO_URI starts with:', process.env.MONGO_URI.substring(0, 10));
}
