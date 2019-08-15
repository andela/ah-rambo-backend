import express from 'express';
import Comments from '../controllers/Comments';
import middlewares from '../middlewares';

const route = express.Router();

const { verifyToken, validateCommentBody, getSessionFromToken } = middlewares;

route.post(
  '/:slug/comments',
  verifyToken,
  getSessionFromToken,
  validateCommentBody,
  Comments.addCommentToArticle
);

route.get('/:slug/comments', Comments.getAllCommentsForArticle);

export default route;
