import model from '../database/models';
import { imageUpload, serverResponse, serverError } from '../helpers';

const { Article } = model;
/**
 * @export
 * @class Articles
 */
class Articles {
  /**
   * @name createArticle
   * @async
   * @static
   * @memberof Articles
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new article
   */
  static async createArticle(req, res) {
    try {
      let image;
      const {
        file,
        body,
        user: { id }
      } = req;
      const { status, articleBody } = body;
      const publishedAt = status === 'draft' || articleBody === undefined ? null : Date.now();
      if (file) image = await imageUpload(req);
      const myArticle = await Article.create({
        ...body,
        image,
        authorId: id,
        publishedAt
      });
      return serverResponse(res, 200, myArticle.dataValues);
    } catch (error) {
      return serverError(res);
    }
  }
}
export default Articles;
