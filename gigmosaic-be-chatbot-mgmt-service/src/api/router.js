/**
 * @module router
 * @description Main API routes for the application.
 * Groups routes for FAQ management.
 */

const express = require('express');

const faqRouter = require('./v1/faq/faqRouter');

const router = express.Router();

router.use('/v1/faq', faqRouter);

module.exports = router;
