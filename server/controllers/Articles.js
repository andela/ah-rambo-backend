import models from '../database/models';
import { imageUpload, serverResponse, serverError } from '../helpers';
import Tags from './Tags';

const { Article, Like, Dislike } = models;

/**
 * Returns server response for the article like/dislike operation
 *
 * @name customArticleResponse
 * @param {Object} res - ExpressJS response object
 * @param {Number} statusCode - Response status code
 * @param {String} slug - Article slug
 * @param {String|Number} userId - Id of the user
 * @param {String} userAction - Action user wants to perform (like/dislike)
 * @param {String} message - Custom response message for the client
 * @returns {JSON} JSON object with details of the liked/disliked article
 */
const customArticleResponse = async (
  res,
  statusCode,
  slug,
  userId,
  userAction,
  message
) => {
  const includeLikeOrDislike = userAction === 'like'
    ? [{ model: Like, as: 'likes', where: { userId } }]
    : [{ model: Dislike, as: 'dislikes', where: { userId } }];

  const article = userAction === 'removeLikeOrDislike'
    ? await Article.findOne({
      where: { slug }
    })
    : await Article.findOne({
      where: { slug },
      include: includeLikeOrDislike
    });

  return serverResponse(res, statusCode, {
    message,
    article
  });
};

/**
 * Create like or dislike for an article
 *
 * @name createLikeOrDislike
 * @param {String} userAction - Action user wants to perform (like/dislike)
 * @param {String|Number} userId - Id of the user
 * @param {Object} article - selected article object
 * @returns {JSON} JSON object with details of the liked/disliked article
 */
const createLikeOrDislike = async (userAction, userId, article) => {
  const articleIdFilter = { where: { id: article.id } };
  const model = userAction === 'like' ? Dislike : Like;
  await model.destroy({
    where: {
      userId,
      contentType: 'article',
      contentId: article.id
    }
  });

  if (userAction === 'like') {
    const dislikesCount = await article.countDislikes();
    await Article.update({ dislikesCount }, { where: { id: article.id } });

    await article.createLike({ userId });
    const likesCount = await article.countLikes();
    await Article.update({ likesCount }, articleIdFilter);
  } else {
    const likesCount = await article.countLikes();
    await Article.update({ likesCount }, articleIdFilter);

    await article.createDislike({ userId });
    const dislikesCount = await article.countDislikes();
    await Article.update({ dislikesCount }, articleIdFilter);
  }
};

import { Op } from 'sequelize';
import model from '../database/models';
import { imageUpload, serverResponse, serverError } from '../helpers';
import Tags from './Tags';

const { Article, Category } = model;
/**
 * @export
 * @class Articles
 */ class Articles {
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
      const { status, articleBody, category } = body;
      let { tags } = body;

      const publishedAt = status === 'draft' || articleBody === undefined ? null : Date.now();
      let createTags;
      const categoryDetails = await Category.findOne({
        where: { [Op.or]: [{ name: category }, { name: 'other' }] }
      });
      if (categoryDetails.name === 'other') tags += `,${category}`;
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
        publishedAt,
        categoryId: categoryDetails.id
      });
      const associateTags = (await Tags.associateArticle(myArticle.id, createTags)) || [];
      myArticle.dataValues.tagList = associateTags;
      myArticle.dataValues.category = {
        id: myArticle.categoryId,
        name: categoryDetails.name
      };
      delete myArticle.dataValues.categoryId;
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

  /**
   * Adds like to an article
   *
   * @name addLike
   * @async
   * @static
   * @memberof Articles
   * @param { Object } req express request object
   * @param { Object } res express response object
   * @returns { JSON } Details of the article and the like / dislike object
   */
  static async addLike(req, res) {
    const { id: userId } = req.user;
    const { slug } = req.params;

    try {
      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }

      const previousArticleLikes = await article.getLikes({
        where: { userId }
      });
      if (previousArticleLikes.length) {
        return serverResponse(res, 200, {
          message: 'you have already liked this article'
        });
      }

      await createLikeOrDislike('like', userId, article);
      customArticleResponse(
        res,
        201,
        slug,
        userId,
        'like',
        'like added successfully'
      );
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * Adds like or dislike to an article
   * Adds dislike to an article
   *
   * @name addDislike
   * @async
   * @static
   * @memberof Articles
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} Details of the article and the like/dislike object
   */
  static async addDislike(req, res) {
    const { id: userId } = req.user;
    const { slug } = req.params;

    try {
      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }

      const previousArticleDislikes = await article.getDislikes({
        where: { userId }
      });
      if (previousArticleDislikes.length) {
        return serverResponse(res, 200, {
          message: 'you have already disliked this article'
        });
      }

      await createLikeOrDislike('dislike', userId, article);
      customArticleResponse(
        res,
        201,
        slug,
        userId,
        'dislike',
        'dislike added successfully'
      );
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * Removes like from an article
   *
   * @name removeLike
   * @async
   * @static
   * @memberof Articles
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} Details of the article and the like/dislike object
   */
  static async removeLike(req, res) {
    const { id: userId } = req.user;
    const { slug } = req.params;

    try {
      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }

      const articleIdFilter = { where: { id: article.id } };
      const likeOrDislikeRemovalFilter = {
        where: {
          userId,
          contentType: 'article',
          contentId: article.id
        }
      };

      await Like.destroy(likeOrDislikeRemovalFilter);
      const likesCount = await article.countLikes();
      await Article.update({ likesCount }, articleIdFilter);

      customArticleResponse(
        res,
        200,
        slug,
        userId,
        'removeLikeOrDislike',
        'like removed successfully'
      );
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * Removes dislike from an article
   *
   * @name removeDislike
   * @async
   * @static
   * @memberof Articles
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} Details of the article and the like/dislike object
   */
  static async removeDislike(req, res) {
    const { id: userId } = req.user;
    const { slug } = req.params;

    try {
      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }

      const articleIdFilter = { where: { id: article.id } };
      const likeOrDislikeRemovalFilter = {
        where: {
          userId,
          contentType: 'article',
          contentId: article.id
        }
      };

      await Dislike.destroy(likeOrDislikeRemovalFilter);
      const dislikesCount = await article.countDislikes();
      await Article.update({ dislikesCount }, articleIdFilter);

      customArticleResponse(
        res,
        200,
        slug,
        userId,
        'removeLikeOrDislike',
        'dislike removed successfully'
      );
    } catch (error) {
      return serverError(res);
    }
  }
}

export default Articles;
