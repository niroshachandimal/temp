const http = require('http');

const app = require('./app');

const { connectToDatabase } = require('./api/common/config/db');

const logger = require('./api/common/utils/logger');

connectToDatabase();

const server = http.createServer(app);

const port = process.env.PORT || 3040;

server.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
