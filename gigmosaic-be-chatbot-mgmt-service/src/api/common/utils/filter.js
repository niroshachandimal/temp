const buildQueryFilter = (search, ProviderId, customerId) => {
    const query = {};

    // Add search filter using $regex for matching category or ProviderId
    if (search) {
        query.$or = [
            { categoryName: { $regex: search, $options: 'i' } },
            { categorySlug: { $regex: search, $options: 'i' } },
            { subCategoryName: { $regex: search, $options: 'i' } },
            { subCategorySlug: { $regex: search, $options: 'i' } },
            { categoryId: { $regex: search, $options: 'i' } },
            { referenceCode: { $regex: search, $options: 'i' } },
        ];
    }

    if (ProviderId) {
        query.providerId = ProviderId;
    }

    if (customerId) {
        query.customerId = customerId;
    }

    return query;
};

/**
 * Parses and validates pagination and sorting parameters.
 * @param {string} page - The page number from the request.
 * @param {string} limit - The number of items per page from the request.
 * @param {string} sortOrder - The sort order ('asc' or 'desc').
 * @returns {Object} An object containing validated and parsed values.
 * @throws {Error} If any of the parameters are invalid.
 */
const validateAndParseParams = (page, limit, sortOrder) => {
    // Parse page and limit
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    // Validate pagination parameters
    if (isNaN(pageNum) || pageNum < 1) {
        throw new Error('Invalid page number');
    }

    if (isNaN(limitNum) || limitNum < 1) {
        throw new Error('Invalid limit number');
    }

    // Determine sorting direction
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Return validated and parsed values
    return {
        pageNum,
        limitNum,
        sortDirection,
    };
};

module.exports = {
    buildQueryFilter,
    validateAndParseParams,
};
