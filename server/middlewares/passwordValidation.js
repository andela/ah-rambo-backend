import Joi from '@hapi/joi';
import passwordChange from '../schemas/passwordChange';
import { validateInputs } from '../helpers';

const options = {
  abortEarly: false
};

/**
 * Validates user registration/signup input
 *
 * @param {string} req - ExpressJs request object
 * @param {string} res - ExpressJs response object
 * @param {string} next - ExpressJs next function
 * @returns {(JSON|function)} HTTP JSON response or ExpressJs next function
 */
const validateUserPassword = (req, res, next) => {
  Joi.validate(req.body, passwordChange, options, validateInputs(res, next));
};
export default validateUserPassword;
