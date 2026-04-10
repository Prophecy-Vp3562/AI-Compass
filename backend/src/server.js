require('dotenv').config();

const app = require('./app');
const connectToDatabase = require('./config/db');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend API and Frontend running locally on http://localhost:${PORT}`);
});

if (process.env.MONGODB_URI) {
    connectToDatabase().catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });
} else {
    console.warn('MONGODB_URI is not set. Login and signup will stay unavailable until it is configured.');
}
