import Joi from '@hapi/joi';
import { userSignup } from '../schemas';
import { validateInputs } from '../helpers';

/**
 * Validates user registration/signup input
 *
 * @param {string} req - ExpressJs request object
 * @param {string} res - ExpressJs response object
 * @param {string} next - ExpressJs next function
 * @returns {(JSON|function)} HTTP JSON response or ExpressJs next function
 */
const validateUserSignup = (req, res, next) => {
  const options = {
    abortEarly: false
  };

  Joi.validate(req.body, userSignup, options, validateInputs(res, next));
};

export default validateUserSignup;
