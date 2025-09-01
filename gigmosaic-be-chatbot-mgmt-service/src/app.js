const express = require('express');

const bodyParser = require('body-parser');

const cors = require('cors');

const dotenv = require('dotenv');

const cookieParser = require('cookie-parser');

const routes = require('./api/router');

const YAML = require('yamljs');

const swaggerUi = require('swagger-ui-express');

const path = require('path');

const logger = require('./api/common/utils/logger');

dotenv.config();

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, 'OpenAPI.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json());

app.use(cookieParser());

const corsOptions = {
    origin: process.env.FRONTEND_DOMAIN,
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization, X-user-type',
    credentials: true,
};

app.use(cors(corsOptions));

app.use('/api', routes);

app.get('/test', (req, res) => {
    res.send('Hello World!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend server is running' });
});

app.use((req, res, next) => {
    logger.info('Request received:', req.method, req.ip);
    next();
});

module.exports = app;
