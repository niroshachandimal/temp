const mongoose = require('mongoose');

const dotenv = require('dotenv');
const logger = require('../utils/logger');

dotenv.config();

const mongoURI = process.env.MONGODB_URL;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(mongoURI, {});
        logger.info('MongoDB connected successfully');
    } catch (err) {
        logger.error('MongoDB connection error:', err);
    }
};

module.exports = {
    connectToDatabase,
    mongoose,
};
