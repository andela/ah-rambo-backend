import models from '../database/models';
import { serverResponse, serverError, isFollowing } from '../helpers';

const { Comment, Article, User } = models;

/**
 *
 *
 * @class Comments
 */
class Comments {
  /**
   * @name create
   * @async
   * @static
   * @memberof Comments
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new follower
   */
  static async create(req, res) {
    try {
      const { id: userId } = req.user;
      const { slug } = req.params;
      const { comment } = req.body;

      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }
      const articleAuthorId = article.authorId;
      let commentData = await Comment.create({
        userId,
        comment,
        articleId: article.id
      });

      const { dataValues: author } = await commentData.getAuthor({
        attributes: ['id', 'userName', 'bio', 'avatarUrl']
      });

      commentData = {
        id: commentData.id,
        comment: commentData.comment,
        articleId: commentData.articleId,
        updatedAt: commentData.updatedAt,
        createdAt: commentData.createdAt
      };
      author.following = await isFollowing(articleAuthorId, userId);
      commentData.author = author;
      return serverResponse(res, 201, { comment: commentData });
    } catch (error) {
      serverError(res);
    }
  }

  /**
   * @name getArticleComments
   * @async
   * @static
   * @memberof Comments
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new follower
   */
  static async getArticleComments(req, res) {
    try {
      const { slug } = req.params;
      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }

      let comments = await article.getComments({
        attributes: { exclude: ['userId'] },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'userName', 'bio', 'avatarUrl']
          }
        ]
      });

      if (comments.length < 1) {
        return serverResponse(res, 200, {
          message: 'article has no comment',
          comments
        });
      }
      const articleAuthorId = article.authorId;

      comments = comments.map(async (comment) => {
        const {
          author: { id }
        } = comment;
        const isUserFollowingAuthor = await isFollowing(articleAuthorId, id);
        const author = comment.author.dataValues;
        author.following = isUserFollowingAuthor;
        comment.author = author;
        return comment;
      });
      comments = await Promise.all(comments);
      const commentsCount = comments.length;
      return serverResponse(res, 200, { comments, commentsCount });
    } catch (error) {
      serverError(res);
    }
  }

  /**
   * @name delete
   * @async
   * @static
   * @memberof Comments
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with message on deleted message
   */
  static async delete(req, res) {
    try {
      const { slug, id } = req.params;
      const { id: userId } = req.user;
      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }
      const articleId = article.id;
      const deleteComment = await Comment.destroy({
        where: { id, articleId, userId }
      });
      if (!deleteComment) {
        return serverResponse(res, 404, { error: 'comment not found' });
      }
      return serverResponse(res, 200, { message: 'comment deleted' });
    } catch (error) {
      serverError(res);
    }
  }

  /**
   * @name update
   * @async
   * @static
   * @memberof Comments
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of update message
   */
  static async update(req, res) {
    try {
      const { slug, id } = req.params;
      const { id: userId } = req.user;
      let { comment } = req.body;
      const article = await Article.findBySlug(slug);
      if (!article) {
        return serverResponse(res, 404, { error: 'article not found' });
      }
      const articleId = article.id;
      const [rowsUpdate, [updatedComment]] = await Comment.update(
        { comment },
        { returning: true, where: { id, userId, articleId } }
      );
      if (rowsUpdate < 1) {
        return serverResponse(res, 404, { error: 'comment not found' });
      }
      comment = updatedComment.dataValues;
      return serverResponse(res, 200, { message: 'comment updated', comment });
    } catch (error) {
      serverError(res);
    }
  }
}

export default Comments;
