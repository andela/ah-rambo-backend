import Joi from '@hapi/joi';
import { article } from '../schemas';
import { validateInputs } from '../helpers';

const options = {
  abortEarly: false
};

/**
 * Validates user article input
 *
 * @param {string} req - ExpressJs request object
 * @param {string} res - ExpressJs response object
 * @param {string} next - ExpressJs next function
 * @returns {(JSON|function)} HTTP JSON response or ExpressJs next function
 */
const articleValidation = (req, res, next) => {
  Joi.validate(req.body, article, options, validateInputs(res, next));
};
export default articleValidation;
