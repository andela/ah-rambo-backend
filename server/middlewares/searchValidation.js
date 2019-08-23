import Joi from '@hapi/joi';
import { searchSchema } from '../schemas';
import { validateInputs } from '../helpers/validationHelper';

/**
 * @name searchPagination
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @param {Object} next express function for calling next middleware
 * @returns {Function} Joi validation function
 */
const searchPagination = (req, res, next) => {
  const options = {
    abortEarly: false
  };

  Joi.validate(req.query, searchSchema, options, validateInputs(res, next));
};

export default searchPagination;
