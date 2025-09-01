const winston = require('winston');

const path = require('path');

const dotenv = require('dotenv');

dotenv.config();

const CloudWatchTransport = require('winston-cloudwatch');

// Define log level colors for console output
const logLevelColors = {
    info: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'magenta',
    verbose: 'cyan',
};

// Define custom log format
const customFormat = winston.format.printf(
    ({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message} ${stack ? `\nStack: ${stack}` : ''}`;
    }
);

// Define transports (Console, File, and CloudWatch)
const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ colors: logLevelColors }),
            winston.format.simple()
        ),
    }),

    new winston.transports.File({
        filename: path.join(__dirname, 'logs/app.log'),
        maxsize: 1000000,
        maxFiles: 3,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, stack }) => {
                return `[${timestamp}] [${level.toUpperCase()}] ${message} ${stack ? `\nStack: ${stack}` : ''}`;
            })
        ),
    }),
];

// Enable CloudWatch **only if not running in development or GitHub Actions CI**
if (process.env.NODE_ENV !== 'development' && process.env.CI !== 'true') {
    transports.push(
        new CloudWatchTransport({
            logGroupName: process.env.CLOUDWATCH_LOG_GROUP || 'gigmosaic-ca-be',
            logStreamName:
                process.env.CLOUDWATCH_LOG_STREAM ||
                'gigmosaic-be-product-mgmt-stream',

            awsRegion: process.env.AWS_REGION || 'ca-central-1',
            createLogGroup: false,
            createLogStream: true,
            level: 'info',
            messageFormatter: ({ level, message, timestamp }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            },
        })
    );
}

// Create logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.colorize({ colors: logLevelColors }),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
    ),
    transports,
});

// Handle exceptions & rejections
logger.exceptions.handle(
    new winston.transports.Console({ format: winston.format.simple() })
);
logger.rejections.handle(
    new winston.transports.Console({ format: winston.format.simple() })
);

module.exports = logger;
