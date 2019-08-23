import { Op } from 'sequelize';
import {
  paginationValues,
  serverResponse,
  serverError,
  searchCategorizer,
  pageCounter
} from '../helpers';
import models from '../database/models';

const { User, Article } = models;

/**
 * @class
 * @exports
 */
class Search {
  /**
   * @name findQuery
   * @param {Object} req
   * @param {Object} res
   * @returns {JSON} Json object
   */
  static async findQuery(req, res) {
    const { page, pageItems } = req.query;
    const searchCategories = searchCategorizer(req.query);
    if (!searchCategories) {
      return serverResponse(res, 400, { error: 'no search query entered' });
    }
    const {
      modelToSearch: { model }
    } = searchCategories;
    const searchResponse = await Search.modelSearch(req.query, res, model);
    const pageDetails = pageCounter(searchResponse.count, page, pageItems);
    const { totalPages, itemsOnPage, parsedPage } = pageDetails;

    return serverResponse(res, 200, {
      currentPage: parsedPage,
      totalPages,
      itemsOnPage,
      data: searchResponse
    });
  }

  /**
   * @param {Object} query
   * @param {Object} res
   * @param {String} model model to perform search query on
   * @returns {Object} object with result of seach
   */
  static async modelSearch(query, res, model) {
    try {
      const { searchFields } = searchCategorizer(query);
      const isArchived = model === Article ? { isArchived: false } : '';
      let attributes;
      if (model === User) {
        attributes = [
          'firstName',
          'lastName',
          'userName',
          'identifiedBy',
          'avatarUrl',
          'bio',
          'followingsCount',
          'followersCount'
        ];
      } else if (model === Article) {
        attributes = [
          'slug',
          'title',
          'description',
          'image',
          'articleBody',
          'likesCount',
          'dislikesCount',
          'publishedAt'
        ];
      } else {
        attributes = ['name'];
      }
      const searchResult = await model.findAndCountAll({
        where: {
          [Op.or]: searchFields,
          ...isArchived
        },
        attributes,
        ...paginationValues(query)
      });
      return searchResult;
    } catch (error) {
      return serverError(res);
    }
  }
}

export default Search;
