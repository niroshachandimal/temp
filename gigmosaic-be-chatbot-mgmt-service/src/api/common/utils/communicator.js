const axios = require('axios');

const dotenv = require('dotenv');

const logger = require('../utils/logger');

dotenv.config();

const authDomain = process.env.AUTH_DOMAIN;

const messageDomain = process.env.MESSAGE_DOMAIN;

if (!authDomain) {
    console.error('Error: AUTH_DOMAIN is not defined in the .env file.');
    process.exit(1);
}

// Base request function for each type
const fetchDataFromAuthService = async (endpoint, token) => {
    try {
        const response = await axios.get(`${authDomain}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error.message);
        throw error;
    }
};

// Middleware factory
const fetchAuthDataMiddleware = (type) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    error: 'Authorization token is required',
                });
            }

            let endpoint;
            switch (type) {
                case 'allUsersData':
                    endpoint = '/v1/auth/verifiedTokenAllUser';
                    break;
                case 'providerData':
                    endpoint = '/v1/auth/verifiedTokenProvider';
                    break;
                case 'adminData':
                    endpoint = '/v1/auth/verifiedTokenAdmin';
                    break;
                default:
                    return res.status(400).json({
                        error: `Unknown data type: ${type}`,
                    });
            }

            const data = await fetchDataFromAuthService(endpoint, token);
            req.userData = data;
            return next();
        } catch {
            return res.status(500).json({
                error: `Failed to fetch data from Auth service for ${type}`,
            });
        }
    };
};

async function connectMessage(
    serviceId,
    serviceName,
    appointmentDate,
    appointmentTimeFrom,
    appointmentTimeTo,
    total,
    bookingStatus
) {
    const messageData = {
        serviceId,
        serviceName,
        date: appointmentDate,
        time: `${appointmentTimeFrom} - ${appointmentTimeTo}`,
        price: total,
        status: bookingStatus,
    };

    logger.info('Preparing to send booking message:', messageData);
    logger.info('Target message endpoint:', messageDomain);

    try {
        const response = await axios.post(messageDomain, messageData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        logger.info('Message sent successfully:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            logger.info('Preparing to send booking message:', messageData);

            logger.error('HTTP error when sending message:', {
                status: error.response.status,
                data: error.response.data,
            });
        } else if (error.request) {
            logger.error(
                'No response received when sending message:',
                error.request
            );
        } else {
            logger.error('Error setting up message request:', error.message);
        }
        return null;
    }
}

// Export middleware variants
module.exports = {
    fetchAuthAllDataMiddleware: fetchAuthDataMiddleware('allUsersData'),
    fetchAuthProviderDataMiddleware: fetchAuthDataMiddleware('providerData'),
    fetchAuthAdminDataMiddleware: fetchAuthDataMiddleware('adminData'),
    connectMessage,
};
