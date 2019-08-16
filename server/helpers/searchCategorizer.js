import { Op } from 'sequelize';
import models from '../database/models';

const { User, Tag, Article } = models;

/**
 * @name searchCategorizer
 * @param {Object} queryParams object containing user's query
 * @returns {JSON} Search parameters
 */
const searchCategorizer = (queryParams) => {
  const queryObject = Object.keys(queryParams);
  const allowedQueries = ['article', 'user', 'tag'];

  const userQuery = allowedQueries.find(query => queryObject.includes(query));
  if (!userQuery) return null;

  const searchQuery = { [Op.iLike]: `%${queryParams[`${userQuery}`]}%` };

  const dbQueryFields = {
    article: {
      model: Article,
      fields: ['title']
    },
    user: {
      model: User,
      fields: ['firstName', 'lastName', 'userName']
    },
    tag: {
      model: Tag,
      fields: ['name']
    }
  };

  const modelToSearch = dbQueryFields[userQuery];

  const searchFields = modelToSearch.fields.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue] = searchQuery;
      return accumulator;
    },
    {}
  );

  return { searchFields, modelToSearch };
};

export default searchCategorizer;
