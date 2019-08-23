import models from '../database/models';
import {
  serverResponse,
  serverError,
  removeSpecialCharacters,
  formatTag,
  removeDuplicateTags
} from '../helpers';

const { Tag, Article } = models;

/**
 * @export
 * @class Tags
 */
class Tags {
  /**
   * @name getAll
   * @async
   * @static
   * @memberof Tags
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with list of tags
   */
  static async getAll(req, res) {
    try {
      const allTags = await Tag.findAll({ attributes: ['name'] });
      const tags = allTags.map(({ name }) => name);
      return serverResponse(res, 200, { tags });
    } catch (error) {
      serverError(res);
    }
  }

  /**
   * @name create
   * @async
   * @static
   * @memberof Tags
   * @param {String} tagList list of tags
   * @returns {Array} array with accurate tag details
   */
  static async create(tagList) {
    if (!tagList || tagList.length < 1) return null;
    const tagArray = tagList.split(',');
    if (tagArray.some(tag => tag.length < 2) || tagArray.length > 15) return false;
    const plainTags = tagArray
      .map(eachTag => formatTag(eachTag))
      .filter(tag => tag !== '');
    const uniquePlainTags = removeDuplicateTags(plainTags);
    const allTag = await Tag.findAll();
    const SaveOrGetTagDetails = await Promise.all(
      uniquePlainTags.map(async (eachTag) => {
        const existingTag = allTag.find(
          tag => removeSpecialCharacters(tag.dataValues.name)
            === removeSpecialCharacters(eachTag)
        );
        if (!existingTag) {
          const newTag = await Promise.resolve(Tag.create({ name: eachTag }));
          return newTag.dataValues;
        }
        return existingTag.dataValues;
      })
    );
    return SaveOrGetTagDetails;
  }

  /**
   * @name associateArticle
   * @async
   * @static
   * @memberof Tags
   * @param {Integer} articleId id of article to associate
   * @param {Array} tagArray array of tags
   * @returns {null} null
   */
  static async associateArticle(articleId, tagArray) {
    if (!articleId || !tagArray) return false;
    const article = await Article.findById(articleId);
    const arrayOfTagId = tagArray.map(({ id }) => id);
    await article.addTags(arrayOfTagId);
    return tagArray.map(({ name }) => name);
  }
}

export default Tags;
