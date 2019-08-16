import Joi from '@hapi/joi';
import { setCustomMessage } from '../helpers';

export default {
  description: Joi.string()
    .min(20)
    .max(500)
    .error(setCustomMessage('description')),
  title: Joi.string()
    .required()
    .min(3)
    .max(250)
    .error(setCustomMessage('title')),
  status: Joi.string()
    .required()
    .valid('publish', 'draft')
    .error(setCustomMessage('status', 'valid status')),
  articleBody: Joi.string()
    .min(2)
    .error(setCustomMessage('articleBody')),
  avatarUrl: Joi.string()
    .uri()
    .error(setCustomMessage('image')),
  tags: Joi.string()
    .optional()
    .min(2)
    .max(250)
    .error(setCustomMessage('tags'))
};
