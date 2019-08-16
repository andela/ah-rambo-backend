import Joi from '@hapi/joi';
import { paginationSchema } from '../schemas';
import { validateInputs } from '../helpers/validationHelper';

/**
 * @name validatePagination
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @param {Object} next express function for calling next middleware
 * @returns {Function} Joi validation function
 */
const validatePagination = (req, res, next) => {
  const options = {
    abortEarly: false
  };

  Joi.validate(req.query, paginationSchema, options, validateInputs(res, next));
};

export default validatePagination;
