

// General error types
const ERROR_TYPES = {
    VALIDATION_ERROR: 'validationError',
    BAD_REQUEST_ERROR: 'badRequestError',
    UNAUTHORIZED_ERROR: 'unauthorizedError',
    FORBIDDEN_ERROR: 'forbiddenError',
    NOT_FOUND_ERROR: 'notFoundError',
    INTERNAL_SERVER_ERROR: 'internalServerError',
    METHOD_NOT_ALLOWED_ERROR: 'methodNotAllowedError',
    SERVICE_UNAVAILABLE_ERROR: 'serviceUnavailableError',
    CONFLICT_ERROR: 'conflictError',
    TOO_MANY_REQUESTS_ERROR: 'tooManyRequestsError',
};

// General error messages
const ERROR_MESSAGES = {
    [ERROR_TYPES.VALIDATION_ERROR]:
        'There was an issue with the data you submitted. Please check and correct the errors.',
    [ERROR_TYPES.BAD_REQUEST_ERROR]:
        'The request was invalid. Please check the parameters and try again.',
    [ERROR_TYPES.UNAUTHORIZED_ERROR]:
        'You are not authorized to perform this action. Please login and try again.',
    [ERROR_TYPES.FORBIDDEN_ERROR]:
        'You do not have permission to access this resource.',
    [ERROR_TYPES.NOT_FOUND_ERROR]:
        'The requested resource could not be found. Please check the URL and try again.',
    [ERROR_TYPES.METHOD_NOT_ALLOWED_ERROR]:
        'The method used is not allowed for this endpoint. Please check the API documentation.',
    [ERROR_TYPES.INTERNAL_SERVER_ERROR]:
        'Something went wrong on our end. Please try again later.',
    [ERROR_TYPES.SERVICE_UNAVAILABLE_ERROR]:
        'The service is temporarily unavailable. Please try again later.',
    [ERROR_TYPES.CONFLICT_ERROR]:
        'There was a conflict with your request. Please resolve it and try again.',
    [ERROR_TYPES.TOO_MANY_REQUESTS_ERROR]:
        'You have made too many requests in a short time. Please try again later.',
};

// Booking-specific error messages
const BOOKING_ERROR_MESSAGES = {
    INVALID_BOOKING_STATUS: 'Invalid booking status provided.',
    BOOKING_NOT_FOUND: 'Booking not found.',
    STATUS_ALREADY_SET: 'The booking already has this status.',
    INVALID_STATUS_TRANSITION: (from, to) =>
        `Cannot transition status from ${from} to ${to}.`,
    INCOMPLETE_BOOKING: 'Booking data is incomplete.',
    CANNOT_CANCEL_COMPLETED: 'Completed bookings cannot be cancelled.',
    CANNOT_CANCEL_WITHIN_24_HOURS:
        'Bookings cannot be cancelled within 24 hours of the booking date.',
    SERVICE_ID_REQUIRED: 'Service ID is required to create a booking.',
    SERVICE_NOT_FOUND: 'The selected service does not exist.',
};

// Generate error ID
const generateErrorId = () => {
    const timestamp = Date.now() % 1000000;
    const random = Math.floor(Math.random() * 1000);
    return `GIG-PMS-${timestamp}-${random}`;
};

// Create standard error response object
function createErrorResponse(
    errors = [],
    errorType = ERROR_TYPES.BAD_REQUEST_ERROR,
    code = 400,
    errorId
) {
    const typeMessage =
        ERROR_MESSAGES[errorType] || 'An unexpected error occurred.';
    return {
        success: false,
        message: `${errorId} :- ${typeMessage}`,
        errors: errors,
        code: code,
    };
}

module.exports = {
    createErrorResponse,
    ERROR_TYPES,
    ERROR_MESSAGES,
    BOOKING_ERROR_MESSAGES,
    generateErrorId,
};
