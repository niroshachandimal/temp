const AWS = require('aws-sdk');

const dotenv = require('dotenv');
const logger = require('../config/logger');
dotenv.config();

const REGION = process.env.REGION;
const ACCESSKEY_ID = process.env.ACCESSKEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRETACCESSKEY;
const AWS_SQS_URL = process.env.AWS_SQS_URL;

AWS.config.update({
    region: REGION,
    credentials: new AWS.Credentials({
        accessKeyId: ACCESSKEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    }),
});
const sqs = new AWS.SQS();

/**
 * Function to send a message to an SQS queue.
 * @param {Object} messageBody - The message body to send to SQS.
 * @returns {Promise} - A promise that resolves if the message is sent successfully, otherwise rejects.
 */

const sendRecordToSQS = async (messageBody) => {
    const params = {
        MessageBody: JSON.stringify(messageBody),
        QueueUrl: AWS_SQS_URL,
    };

    return new Promise((resolve, reject) => {
        sqs.sendMessage(params, (err, data) => {
            if (err) {
                logger.error('Error sending message:', err);
                reject(err);
            } else {
                logger.log('Message sent successfully:', data.MessageId);
                resolve(data);
            }
        });
    });
};

module.exports = sendRecordToSQS;
