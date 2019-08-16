import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

export default {
  firstName: Joi.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
    .error(setCustomMessage('first name')),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
    .error(setCustomMessage('last name')),
  userName: Joi.string()
    .min(6)
    .max(15)
    .alphanum()
    .error(setCustomMessage('username')),
  email: Joi.string()
    .min(3)
    .max(254)
    .regex(/^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/)
    .error(setCustomMessage('email')),
  avatarUrl: Joi.string()
    .uri()
    .error(setCustomMessage('avatar url')),
  bio: Joi.string()
    .max(160)
    .error(setCustomMessage('user bio')),
  identifiedBy: Joi.string()
    .valid('fullname', 'username', 'Fullname', 'Username')
    .error(setCustomMessage('user', 'profile edit')),
  location: Joi.string().error(setCustomMessage('user location')),
  occupation: Joi.string()
    .regex(/^[a-zA-Z ]*$/)
    .error(setCustomMessage('user occupation', 'profile edit')),
  role: Joi.string()
    .min(2)
    .max(20)
    .regex(/^[a-zA-Z]*$/)
    .error(setCustomMessage('role'))
};
