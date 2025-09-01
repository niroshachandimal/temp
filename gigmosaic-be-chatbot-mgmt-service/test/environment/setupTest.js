// stepTest.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const setupDB = async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

const teardownDB = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
};

module.exports = { setupDB, teardownDB };
