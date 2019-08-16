import { Op } from 'sequelize';
import {
  paginationValues,
  serverResponse,
  serverError,
  searchCategorizer,
  pageCounter
} from '../helpers';

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
    if (searchResponse.count <= 0) {
      return serverResponse(res, 404, {
        error: 'your query did not match any results'
      });
    }
    const pageDetails = pageCounter(searchResponse.count, page, pageItems);
    const { totalPages, itemsOnPage, parsedPage } = pageDetails;
    if (!itemsOnPage) {
      return serverResponse(res, 404, { error: 'page not found', totalPages });
    }

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
      const searchResult = await model.findAndCountAll({
        where: {
          [Op.or]: searchFields
        },
        ...paginationValues(query)
      });
      return searchResult;
    } catch (error) {
      return serverError(res);
    }
  }
}

export default Search;
