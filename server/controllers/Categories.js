import models from '../database/models';
import { serverResponse, serverError } from '../helpers';

const { Category } = models;

/**
 * @export
 * @class Categories
 */
class Categories {
  /**
   * @name create
   * @async
   * @static
   * @memberof Categories
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {Json} server response
   */
  static async create(req, res) {
    try {
      const { description } = req.body;
      const name = req.body.name.toLowerCase();
      const existingCategory = await Category.findByName(name);
      if (existingCategory) {
        return serverResponse(res, 409, {
          error: `${name} category already exists`
        });
      }
      const newCategory = await Category.create({ name, description });

      return serverResponse(res, 200, {
        message: `${name} category successfully created`,
        data: newCategory.dataValues
      });
    } catch (error) {
      serverError(res);
    }
  }

  /**
   * @name getAll
   * @async
   * @static
   * @memberof Categories
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} server response
   */
  static async getAll(req, res) {
    try {
      const allCategories = await Category.findAll();
      return serverResponse(res, 200, { categories: allCategories });
    } catch (error) {
      serverError(res);
    }
  }
}

export default Categories;
