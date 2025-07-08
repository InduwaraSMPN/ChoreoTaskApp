/**
 * Global error handling middleware for the Task Management API
 * Provides consistent error responses and logging
 */

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error('❌ Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    user: req.user ? req.user.sub : 'anonymous'
  })

  // Default error response
  let statusCode = 500
  const errorResponse = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    requestId: req.headers['x-request-id'] || 'unknown'
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400
    errorResponse.error = 'Validation Error'
    errorResponse.message = err.message
    errorResponse.details = err.details
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401
    errorResponse.error = 'Unauthorized'
    errorResponse.message = 'Authentication required'
  } else if (err.name === 'ForbiddenError') {
    statusCode = 403
    errorResponse.error = 'Forbidden'
    errorResponse.message = 'Insufficient permissions'
  } else if (err.name === 'NotFoundError') {
    statusCode = 404
    errorResponse.error = 'Not Found'
    errorResponse.message = err.message || 'Resource not found'
  } else if (err.name === 'ConflictError') {
    statusCode = 409
    errorResponse.error = 'Conflict'
    errorResponse.message = err.message || 'Resource conflict'
  } else if (err.statusCode) {
    // Handle errors with explicit status codes
    statusCode = err.statusCode
    errorResponse.error = err.name || 'Error'
    errorResponse.message = err.message
  }

  // Don't expose internal error details in production
  if (process.env.NODE_ENV === 'production') {
    delete errorResponse.stack

    // For 5xx errors, use generic message
    if (statusCode >= 500) {
      errorResponse.message = 'An internal server error occurred'
    }
  } else {
    // Include stack trace in development
    errorResponse.stack = err.stack
  }

  // Send error response
  res.status(statusCode).json(errorResponse)
}

/**
 * Custom error classes for better error handling
 */
class ValidationError extends Error {
  constructor(message, details = null) {
    super(message)
    this.name = 'ValidationError'
    this.details = details
  }
}

class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

class UnauthorizedError extends Error {
  constructor(message = 'Authentication required') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message)
    this.name = 'ConflictError'
  }
}

module.exports = {
  errorHandler,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError
}
