import Joi from '@hapi/joi';
import { profileEdit } from '../schemas';
import { validateInputs } from '../helpers';

/**
 * Validates user inputs when he/she edit his/her profile
 *
 * @param {Object} req - ExpressJs request object
 * @param {Object} res - ExpressJs response object
 * @param {Function} next - ExpressJs next function
 * @returns {(JSON|Function)} HTTP JSON response or ExpressJs next function
 */
const validateProfileEdit = (req, res, next) => {
  const options = {
    abortEarly: false
  };

  Joi.validate(req.body, profileEdit, options, validateInputs(res, next));
};

export default validateProfileEdit;
