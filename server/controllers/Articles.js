import model from '../database/models';
import { imageUpload, serverResponse, serverError } from '../helpers';
import Tags from './Tags';

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
      const { status, articleBody, tags } = body;

      const publishedAt = status === 'draft' || articleBody === undefined ? null : Date.now();
      let createTags;
      if (tags) {
        createTags = await Tags.create(tags);
        const error = Articles.canTag(createTags);
        if (error) return serverResponse(res, error.status, error.message);
      }
      if (file) image = await imageUpload(req);
      const myArticle = await Article.create({
        ...body,
        image,
        authorId: id,
        publishedAt
      });

      const associateTags = (await Tags.associateArticle(myArticle.id, createTags)) || [];
      myArticle.dataValues.tagList = associateTags;
      return serverResponse(res, 200, myArticle.dataValues);
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @name canTag
   * @async
   * @static
   * @memberof Articles
   * @param {Array} tagArray array of tags
   * @returns {Object} response object
   */
  static canTag(tagArray) {
    if (tagArray === false) {
      return {
        status: 400,
        message: {
          error: 'each tag must be more than a character'
        }
      };
    }
    if (tagArray === null || tagArray.length < 1 || !tagArray[0].id) {
      return {
        status: 400,
        message: {
          error: 'tags should be an array of valid strings'
        }
      };
    }
  }
}
export default Articles;
