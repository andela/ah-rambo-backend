import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

export default {
  firstName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
    .error(setCustomMessage('first name')),
  lastName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
    .error(setCustomMessage('last name')),
  userName: Joi.string()
    .required()
    .min(6)
    .max(15)
    .alphanum()
    .error(setCustomMessage('username')),
  email: Joi.string()
    .required()
    .min(3)
    .max(254)
    .regex(/^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/)
    .error(setCustomMessage('email')),
  password: Joi.string()
    .required()
    .min(8)
    .max(254)
    .regex(/\s/, { invert: true })
    .error(setCustomMessage('password'))
};
