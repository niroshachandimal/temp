const { validationResult } = require('express-validator');

const faqService = require('./faqService');

const errorUtil = require('../../common/utils/error');

const logger = require('../../common/utils/logger');

// Get all FAQs
const getAllFaqs = async (req, res) => {
    try {
        const { includeDisabled } = req.query;
        const faqs = await faqService.getAllFaqs(includeDisabled);

        return res.status(200).json({
            success: true,
            faqs,
            count: faqs.length,
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error fetching all FAQs: ${err.message}`, { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            [],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

// Get FAQs by category
const getFaqsByCategory = async (req, res) => {
    try {
        const { category, includeDisabled } = req.query;

        if (
            !category ||
            !['customer', 'provider', 'general'].includes(category)
        ) {
            const errorId = errorUtil.generateErrorId();
            logger.warn('Invalid category parameter', { errorId, category });
            const errorResponse = errorUtil.createErrorResponse(
                [
                    {
                        field: 'category',
                        message:
                            'Category must be customer, provider, or general',
                    },
                ],
                errorUtil.ERROR_TYPES.VALIDATION_ERROR,
                400,
                errorId
            );
            return res.status(400).json(errorResponse);
        }

        const faqs = await faqService.getFaqsByCategory(
            category,
            includeDisabled
        );

        return res.status(200).json({
            success: true,
            faqs,
            count: faqs.length,
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error fetching FAQs by category: ${err.message}`, {
            errorId,
        });
        const errorResponse = errorUtil.createErrorResponse(
            [],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

// Search FAQs
const searchFaqs = async (req, res) => {
    try {
        const { category, query } = req.query;

        if (!category || !['customer', 'provider'].includes(category)) {
            const errorId = errorUtil.generateErrorId();
            logger.warn('Invalid category parameter for search', {
                errorId,
                category,
            });
            const errorResponse = errorUtil.createErrorResponse(
                [
                    {
                        field: 'category',
                        message: 'Category must be customer or provider',
                    },
                ],
                errorUtil.ERROR_TYPES.VALIDATION_ERROR,
                400,
                errorId
            );
            return res.status(400).json(errorResponse);
        }

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            const errorId = errorUtil.generateErrorId();
            logger.warn('Invalid search query', { errorId, query });
            const errorResponse = errorUtil.createErrorResponse(
                [
                    {
                        field: 'query',
                        message: 'Search query is required and cannot be empty',
                    },
                ],
                errorUtil.ERROR_TYPES.VALIDATION_ERROR,
                400,
                errorId
            );
            return res.status(400).json(errorResponse);
        }

        const faqs = await faqService.searchFaqs(category, query);

        return res.status(200).json({
            success: true,
            faqs,
            count: faqs.length,
            query: query.trim(),
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error searching FAQs: ${err.message}`, { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            [],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

// Get FAQ by ID
const getFaqById = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await faqService.getFaqById(id);

        if (!faq) {
            const errorId = errorUtil.generateErrorId();
            logger.warn('FAQ not found', { errorId, id });
            const errorResponse = errorUtil.createErrorResponse(
                [{ field: 'id', message: 'FAQ not found' }],
                errorUtil.ERROR_TYPES.NOT_FOUND,
                404,
                errorId
            );
            return res.status(404).json(errorResponse);
        }

        return res.status(200).json({
            success: true,
            faq,
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error fetching FAQ by ID: ${err.message}`, { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            [],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

// Add new FAQ
const addFaq = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorId = errorUtil.generateErrorId();
        logger.warn('Validation error in FAQ creation', { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            errors.array(),
            errorUtil.ERROR_TYPES.VALIDATION_ERROR,
            400,
            errorId
        );
        return res.status(400).json(errorResponse);
    }

    try {
        const { category, question, answer, user } = req.body;
        const faq = await faqService.createFaq(
            category,
            question,
            answer,
            user
        );

        return res.status(201).json({
            success: true,
            faq,
            message: 'FAQ created successfully',
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error creating FAQ: ${err.message}`, { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            [{ field: 'faq', message: err.message }],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

// Update FAQ
const updateFaq = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorId = errorUtil.generateErrorId();
        logger.warn('Validation error in FAQ update', { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            errors.array(),
            errorUtil.ERROR_TYPES.VALIDATION_ERROR,
            400,
            errorId
        );
        return res.status(400).json(errorResponse);
    }

    try {
        const { id } = req.params;
        const { category, question, answer, user } = req.body;
        const updatedFaq = await faqService.updateFaq(
            id,
            category,
            question,
            answer,
            user
        );

        if (!updatedFaq) {
            const errorId = errorUtil.generateErrorId();
            logger.warn('FAQ not found for update', { errorId, id });
            const errorResponse = errorUtil.createErrorResponse(
                [{ field: 'id', message: 'FAQ not found' }],
                errorUtil.ERROR_TYPES.NOT_FOUND,
                404,
                errorId
            );
            return res.status(404).json(errorResponse);
        }

        return res.status(200).json({
            success: true,
            faq: updatedFaq,
            message: 'FAQ updated successfully',
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error updating FAQ: ${err.message}`, { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            [{ field: 'faq', message: err.message }],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

// Toggle FAQ status
const toggleFaqStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const faq = await faqService.toggleFaqStatus(id);

        if (!faq) {
            const errorId = errorUtil.generateErrorId();
            logger.warn('FAQ not found for status toggle', { errorId, id });
            const errorResponse = errorUtil.createErrorResponse(
                [{ field: 'id', message: 'FAQ not found' }],
                errorUtil.ERROR_TYPES.NOT_FOUND,
                404,
                errorId
            );
            return res.status(404).json(errorResponse);
        }

        return res.status(200).json({
            success: true,
            faq,
            message: `FAQ ${faq.isEnabled ? 'enabled' : 'disabled'} successfully`,
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error toggling FAQ status: ${err.message}`, { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            [{ field: 'faq', message: err.message }],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

// Delete FAQ
const deleteFaq = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedFaq = await faqService.deleteFaq(id);

        if (!deletedFaq) {
            const errorId = errorUtil.generateErrorId();
            logger.warn('FAQ not found for deletion', { errorId, id });
            const errorResponse = errorUtil.createErrorResponse(
                [{ field: 'id', message: 'FAQ not found' }],
                errorUtil.ERROR_TYPES.NOT_FOUND,
                404,
                errorId
            );
            return res.status(404).json(errorResponse);
        }

        return res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully',
            deletedFaq,
        });
    } catch (err) {
        const errorId = errorUtil.generateErrorId();
        logger.error(`Error deleting FAQ: ${err.message}`, { errorId });
        const errorResponse = errorUtil.createErrorResponse(
            [{ field: 'faq', message: err.message }],
            errorUtil.ERROR_TYPES.INTERNAL_SERVER_ERROR,
            500,
            errorId
        );
        return res.status(500).json(errorResponse);
    }
};

module.exports = {
    getAllFaqs,
    getFaqsByCategory,
    searchFaqs,
    getFaqById,
    addFaq,
    updateFaq,
    toggleFaqStatus,
    deleteFaq,
};
