import Joi from '@hapi/joi';
import { comment } from '../schemas';
import { validateInputs } from '../helpers';

/**
 * Validates user registration/signup input
 *
 * @param {string} req - ExpressJs request object
 * @param {string} res - ExpressJs response object
 * @param {string} next - ExpressJs next function
 * @returns {(JSON|function)} HTTP JSON response or ExpressJs next function
 */
const validateCommentBody = (req, res, next) => {
  const options = {
    abortEarly: false
  };

  Joi.validate(req.body, comment, options, validateInputs(res, next));
};

export default validateCommentBody;
