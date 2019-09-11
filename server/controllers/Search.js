import {
  paginationValues,
  serverResponse,
  serverError,
  searchCategorizer,
  pageCounter
} from '../helpers';
import models from '../database/models';

const {
  User, Article, Tag, Category
} = models;

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
    const { page, pageItems, global } = req.query;
    if (global) return Search.globalSearch(req, res);
    const searchCategories = searchCategorizer(req.query);
    if (!searchCategories && Object.keys(req.query).includes('article')) {
      const { offset, limit } = paginationValues(req.query);
      const articles = await Article.findByPage(offset, limit, models);
      return serverResponse(res, 200, articles);
    }
    const {
      modelToSearch: { model }
    } = searchCategories;
    const { count, results } = await Search.modelSearch(req.query, res, model);
    const pageDetails = pageCounter(count, page, pageItems);
    const { totalPages, itemsOnPage, parsedPage } = pageDetails;

    return serverResponse(res, 200, {
      currentPage: parsedPage,
      totalPages,
      itemsOnPage,
      data: {
        count,
        results
      }
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
      const { offset, limit } = paginationValues(query);
      const articleOrTag = query.article || query.tag || query.category;
      const searchResult = await model.search(
        articleOrTag,
        limit,
        offset,
        searchFields,
        models
      );
      return searchResult;
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {String} model model to perform search query on
   * @returns {Object} object with result of seach
   */
  static async globalSearch(req, res) {
    const { global, page, pageItems } = req.query;
    const tables = [Article, Tag, Category];
    const { offset, limit } = paginationValues(req.query);
    const data = await tables.map(model => model.search(global, limit, offset));
    const userSearch = await Search.modelSearch(
      { user: global, page, pageItems },
      res,
      User
    );
    const allResults = await Promise.all(data);
    return serverResponse(res, 200, {
      userSearch,
      articleSearch: {
        count: allResults[0].count,
        results: allResults[0].results
      },
      tagSearch: {
        count: allResults[1].count,
        results: allResults[1].results
      },
      categorySearch: {
        count: allResults[2].count,
        results: allResults[2].results
      }
    });
  }
}

export default Search;
