const { AppError } = require('../utils/AppError');

/**
 * Handle Mongoose CastError (Invalid ObjectId)
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose Duplicate Key Error
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${field} '${value}' already exists. Please use another value.`;
  return new AppError(message, 409);
};

/**
 * Handle Mongoose Validation Error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = 'Validation failed';
  return new AppError(message, 422, errors);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = () => new AppError('Invalid token. Please login again.', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please login again.', 401);

/**
 * Send error response in development mode
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    errors: err.errors,
    stack: err.stack,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send error response in production mode
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      timestamp: new Date().toISOString(),
    });
  } else {
    // Programming or unknown error: don't leak error details
    console.error('💥 ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || 'error';

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Error:', {
      name: err.name,
      message: err.message,
      statusCode: error.statusCode,
      stack: err.stack,
    });
  }

  // Handle specific error types
  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // Send response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
