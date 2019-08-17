import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

export default {
  page: Joi.number()
    .optional()
    .min(1)
    .error(setCustomMessage('Page')),
  pageItems: Joi.number()
    .optional()
    .min(1)
    .error(setCustomMessage('Page Size'))
};
