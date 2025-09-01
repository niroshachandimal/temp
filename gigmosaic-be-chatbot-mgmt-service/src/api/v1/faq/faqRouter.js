const express = require('express');

const router = express.Router();

const faqController = require('./faqController');

const faqMiddleware = require('./faqMiddleware');

// GET - Get all FAQs
router.get('/', faqController.getAllFaqs);

// GET - Get FAQs by category
router.get('/category', faqController.getFaqsByCategory);

// GET - Search FAQs
router.get('/search', faqController.searchFaqs);

// GET - Get FAQ by ID
router.get('/:id', faqController.getFaqById);

// POST - Add new FAQ
router.post('/', faqMiddleware.validateFaq, faqController.addFaq);

// PUT - Update FAQ
router.put('/:id', faqMiddleware.validateFaqUpdate, faqController.updateFaq);

// PATCH - Toggle FAQ status
router.patch('/:id/toggle', faqController.toggleFaqStatus);

// DELETE - Delete FAQ
router.delete('/:id', faqController.deleteFaq);

module.exports = router;
