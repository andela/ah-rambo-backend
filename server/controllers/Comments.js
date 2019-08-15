import models from '../database/models';
import { serverResponse, serverError } from '../helpers';

const {
  Comment, Article, User, UserFollower
} = models;

/**
 *
 *
 * @class Comments
 */
class Comments {
  /**
   * @name addCommentToArticle
   * @async
   * @static
   * @memberof Comments
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new follower
   */
  static async addCommentToArticle(req, res) {
    try {
      const { id: userId } = req.user;
      const { slug } = req.params;
      const { comment } = req.body;

      const article = await Article.findOne({ where: { slug } });
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }

      const articleAuthorId = article.userId;
      const authorFollower = await UserFollower.findOne({
        where: { userId: articleAuthorId, followerId: userId }
      });

      const commentData = await Comment.create({
        userId,
        comment,
        articleId: article.id
      });

      const commentDetail = {
        id: commentData.id,
        comment: commentData.comment,
        articleId: commentData.articleId,
        updatedAt: commentData.updatedAt,
        createdAt: commentData.createdAt
      };

      const { dataValues: user } = await commentData.getUser({
        attributes: ['id', 'userName', 'bio', 'avatarUrl']
      });

      user.following = !!authorFollower;
      // commentDetail = commentData.dataValues;
      commentDetail.user = user;
      return serverResponse(res, 201, { comment: commentDetail });
    } catch (error) {
      serverError(res);
    }
  }

  /**
   * @name getAllCommentsForArticle
   * @async
   * @static
   * @memberof Comments
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new follower
   */
  static async getAllCommentsForArticle(req, res) {
    const { slug } = req.params;
    const article = await Article.findOne({
      where: { slug }
    });
    if (!article) {
      return serverResponse(res, 404, { error: 'article not found' });
    }
    let comments = await article.getComments({
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'userName', 'bio', 'avatarUrl']
        }
      ]
    });
    if (comments.length < 1) {
      return serverResponse(res, 404, { error: 'article has no comment' });
    }
    const articleAuthorId = article.userId;

    comments = comments.map(async (comment) => {
      const {
        user: { id }
      } = comment;
      const authorFollower = await UserFollower.findOne({
        where: { userId: articleAuthorId, followerId: id }
      });
      const userDetails = comment.user.dataValues;
      userDetails.following = !!authorFollower;
      comment.user = userDetails;
      return comment;
    });
    comments = await Promise.all(comments);
    const commentsCount = comments.length;
    return serverResponse(res, 200, { comments, commentsCount });
  }
}

export default Comments;
