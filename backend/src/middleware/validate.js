const { validationResult } = require('express-validator');
const { ValidationError } = require('../utils/AppError');

/**
 * Validation Middleware
 * Checks for validation errors from express-validator and formats them
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    const errorMessage = formattedErrors
      .map((err) => `${err.field}: ${err.message}`)
      .join(', ');

    return next(new ValidationError(errorMessage, formattedErrors));
  }

  next();
};

module.exports = validate;
