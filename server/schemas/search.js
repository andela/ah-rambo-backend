import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

export default {
  user: Joi.string()
    .optional()
    .min(1)
    .error(setCustomMessage('User')),
  article: Joi.string()
    .optional()
    .min(1)
    .error(setCustomMessage('Article')),
  tag: Joi.string()
    .optional()
    .min(1)
    .error(setCustomMessage('Tag')),
  global: Joi.string()
    .optional()
    .min(1)
    .error(setCustomMessage('Global')),
  category: Joi.string()
    .optional()
    .min(1)
    .error(setCustomMessage('Global')),
  page: Joi.number()
    .optional()
    .min(1)
    .error(setCustomMessage('Page')),
  pageItems: Joi.number()
    .optional()
    .min(1)
    .error(setCustomMessage('Page Size'))
};
