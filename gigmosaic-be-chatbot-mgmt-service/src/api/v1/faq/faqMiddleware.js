const { body, param, query } = require('express-validator');

// Validation for creating new FAQ
const validateFaq = [
    body('category')
        .isIn(['customer', 'provider', 'general'])
        .withMessage('Category must be customer, provider, or general'),
    body('question')
        .isString()
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Question must be between 1 and 1000 characters'),
    body('answer')
        .isString()
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Answer must be between 1 and 5000 characters'),
    body('user')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('User must be between 1 and 100 characters'),
];

// Validation for updating FAQ
const validateFaqUpdate = [
    param('id').isMongoId().withMessage('Invalid FAQ ID format'),
    body('category')
        .optional()
        .isIn(['customer', 'provider', 'general'])
        .withMessage('Category must be customer, provider, or general'),
    body('question')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Question must be between 1 and 1000 characters'),
    body('answer')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 5000 })
        .withMessage('Answer must be between 1 and 5000 characters'),
    body('user')
        .optional()
        .isString()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('User must be between 1 and 100 characters'),
];

// Validation for FAQ ID parameter
const validateFaqId = [
    param('id').isMongoId().withMessage('Invalid FAQ ID format'),
];

// Validation for category query parameter
const validateCategoryQuery = [
    query('category')
        .isIn(['customer', 'provider', 'general'])
        .withMessage('Category must be customer, provider, or general'),
];

// Validation for search query parameters
const validateSearchQuery = [
    query('category')
        .isIn(['customer', 'provider'])
        .withMessage('Category must be customer or provider'),
    query('query')
        .isString()
        .trim()
        .isLength({ min: 1, max: 200 })
        .withMessage('Search query must be between 1 and 200 characters'),
];

module.exports = {
    validateFaq,
    validateFaqUpdate,
    validateFaqId,
    validateCategoryQuery,
    validateSearchQuery,
};
