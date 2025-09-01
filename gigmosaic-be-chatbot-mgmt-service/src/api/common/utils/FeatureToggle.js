// const { initialize } = require('unleash-client');
// require('dotenv').config(); // Load environment variables from .env file

// const unleashClient = initialize({
//     url: process.env.UNLEASH_URL || 'https://unleash.aplicy.com/api/frontend',
//     appName:
//         process.env.UNLEASH_APP_NAME || 'gigmosaic-be-product-mgmt-service',
//     customHeaders: {
//         Authorization:
//             process.env.UNLEASH_API_TOKEN ||
//             'default:development.unleash-insecure-api-token',
//     },
//     environment: process.env.UNLEASH_ENVIRONMENT || 'development',
// });

// unleashClient.on('ready', () => {
//     console.info('Unleash client is ready!');
// });

// unleashClient.on('error', (err) => {
//     console.error('Unleash client error:', err);
// });

// /**
//  * Check if a feature flag is enabled.
//  * @param {string} featureName - The name of the feature flag.
//  * @param {object} context - Optional context for user-specific toggling.
//  * @returns {boolean} - True if the feature is enabled, false otherwise.
//  */
// const isFeatureEnabled = (featureName, context = {}) => {
//     return unleashClient.isEnabled(featureName, context);
// };

// module.exports = { isFeatureEnabled };
