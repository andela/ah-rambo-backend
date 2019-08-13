import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

const email = {
  email: Joi.string()
    .required()
    .min(3)
    .max(254)
    .regex(/^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/)
    .error(setCustomMessage('email'))
};

const newPassword = {
  password: Joi.string()
    .required()
    .min(8)
    .max(254)
    .regex(/\s/, { invert: true })
    .error(setCustomMessage('password')),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .error(setCustomMessage('confirm password'))
};

export default { email, newPassword };
