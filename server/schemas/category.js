import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

export default {
  name: Joi.string()
    .required()
    .min(2)
    .max(20)
    .regex(/\w/)
    .error(setCustomMessage('category name')),
  description: Joi.string()
    .optional()
    .min(2)
    .max(100)
    .regex(/\w/)
    .error(setCustomMessage('category description'))
};
