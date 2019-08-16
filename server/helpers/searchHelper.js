import { Op } from 'sequelize';
import models from '../database/models';

const { User, Tag, Article } = models;

/**
 * @name searchHelper
 * @param {Object} req Express request object
 * @returns {JSON} Search parameters
 */
const searchHelper = (req) => {
  const queryObject = Object.keys(req.query);
  const allowedQueries = ['article', 'user', 'tag'];
  const userQuery = allowedQueries.find(query => queryObject.includes(query));
  const searchQuery = { [Op.iLike]: `%${req.query[`${userQuery}`]}%` };

  const dbQueryFields = {
    article: {
      model: Article,
      search: ['title']
    },
    user: {
      model: User,
      search: ['firstName', 'lastName', 'userName']
    },
    tag: {
      model: Tag,
      search: ['name']
    }
  };

  const modelToSearch = dbQueryFields[userQuery];

  const searchFields = modelToSearch.search.reduce(
    (accumulator, currentValue) => {
      accumulator[currentValue] = searchQuery;
      return accumulator;
    },
    {}
  );

  return { searchFields, modelToSearch };
};

export default searchHelper;
