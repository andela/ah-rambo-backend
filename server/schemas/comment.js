import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

export default {
  comment: Joi.string()
    .required()
    .min(2)
    .max(5000)
    .error(setCustomMessage('comment'))
};
