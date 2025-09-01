// services/userServiceClient.js
const axios = require('axios');

const AUTH_DOMAIN = process.env.AUTH_DOMAIN;

async function getUserById(userId) {
    try {
        const url = `${AUTH_DOMAIN}/v1/user/${userId}`; // Or fix to match your actual endpoint
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('❌ Failed to fetch user:', {
            url: `${AUTH_DOMAIN}/v1/user/${userId}`,
            error: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });

        // Optionally include more debug info in the thrown error
        throw new Error(
            `Failed to fetch user from User Service: ${error.message}`
        );
    }
}

module.exports = { getUserById };
