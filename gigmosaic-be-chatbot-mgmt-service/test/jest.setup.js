const clientS3 = require('@aws-sdk/client-s3');
const credential = require('@aws-sdk/credential-provider-ini');
/* eslint-disable no-undef */
require('dotenv').config(); // Load environment variables

jest.mock(clientS3, () => {
    return {
        S3Client: jest.fn(() => ({
            send: jest.fn().mockResolvedValue({}),
        })),
    };
});

jest.mock(credential, () => ({
    fromIni: jest.fn().mockReturnValue({}),
}));

// Mock Elasticsearch Client to prevent real API calls
jest.mock('@elastic/elasticsearch', () => {
    return {
        Client: jest.fn(() => ({
            search: jest.fn().mockResolvedValue({ hits: { hits: [] } }),
            index: jest.fn().mockResolvedValue({}),
            delete: jest.fn().mockResolvedValue({}),
        })),
    };
});
