import Joi from '@hapi/joi';
import { validateInputs } from '../helpers';
import resetPasswordSchema from '../schemas/resetPassword';

const options = {
  abortEarly: false
};

const { email, newPassword } = resetPasswordSchema;

/**
 * Validates All User Inputs for Reset Password
 *
 * @param {object} schema - Joi Validation Schema
 * @returns {(JSON|function)} HTTP JSON response or ExpressJs next function
 */
const validate = schema => (req, res, next) => {
  Joi.validate(req.body, schema, options, validateInputs(res, next));
};

export default {
  email: validate(email),
  newPassword: validate(newPassword)
};
