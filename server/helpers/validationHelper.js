/* eslint-disable max-len */
import { serverResponse } from './serverResponse';

/**
 * Sets and returns custom validation error message
 *
 * @name setCustomMessage
 * @param {string} label - Label of the field
 * @param {string} action - Action a user wants to perform
 *
 * @returns {array} Contains Joi error object
 */
const setCustomMessage = (label, action = 'user signup') => (errors) => {
  errors.forEach((err) => {
    switch (err.type) {
    case 'any.required':
      err.message = `${label} is required`;
      break;
    case 'any.allowOnly':
      if (action === 'profile edit') {
        err.message = `${label} must only be identified by either fullname or username`;
      }
      if (action === 'valid status') {
        err.message = `${label} must be a valid status try publish or draft`;
      }
      if (action === 'user signup') {
        err.message = `${label} must match password`;
      }
      break;
    case 'string.alphanum':
      err.message = `${label} should contain only letters and numbers`;
      break;
    case 'string.min':
      err.message = `${label} should not be less than ${err.context.limit} characters`;
      break;
    case 'string.max':
      err.message = `${label} should not be more than ${err.context.limit} characters`;
      break;
    case 'string.regex.base':
      err.message = action === 'profile edit'
        ? `${label} must contain only letters and/or spaces`
        : `${label} is invalid`;
      break;
    case 'string.regex.invert.base':
      err.message = `${label} should not contain spaces`;
      break;
    case 'string.uri':
      err.message = `${label} format is invalid`;
      break;
    case 'number.base':
      err.message = `${label} must be a number`;
      break;
    case 'number.min':
      err.message = `${label} must be greater than or equal to ${err.context.limit}`;
      break;
    default:
      err.message = `${label} should be a string`;
      break;
    }
  });

  return errors;
};

/**
 * Validates inputs against a schema
 *
 * @name validateInput
 * @param {object} res - ExpressJs response object
 * @param {function} next - ExpressJs next function
 * @returns {(JSON|function)} HTTP JSON response or ExpressJs next function
 */
const validateInputs = (res, next) => (errors) => {
  const validationErrors = {};

  if (!errors) return next();

  errors.details.forEach((error) => {
    const errorClone = { ...error };
    const { key } = errorClone.context;
    validationErrors[key] = errorClone.message.replace(/"/g, '');
  });

  serverResponse(res, 422, { errors: validationErrors });
};

export { setCustomMessage, validateInputs };
