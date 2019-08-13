import model from '../database/models';
import { imageUpload, serverResponse } from '../helpers';

const { Article } = model;
/**
 * @export
 * @class Auth
 */
class Articles {
  /**
   * @name createArticle
   * @async
   * @static
   * @memberof Auth
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new user
   */
  static async createArticle(req, res) {
    let image;
    const {
      file,
      body,
      user: { id }
    } = req;
    const { status } = body;
    const publishedAt = status === 'publish' ? Date.now() : null;
    if (file) image = await imageUpload(req);
    const myArticle = await Article.create({
      ...body,
      image,
      authorId: id,
      publishedAt
    });
    serverResponse(res, 200, myArticle.dataValues);
  }
}

export default Articles;
