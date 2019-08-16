import express from 'express';
import Comments from '../controllers/Comments';
import middlewares from '../middlewares';

const route = express.Router();

const {
  verifyToken,
  validateCommentBody,
  getSessionFromToken,
  checkUserVerification
} = middlewares;

route.post(
  '/:slug/comments',
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  validateCommentBody,
  Comments.create
);

route.get('/:slug/comments', Comments.getArticleComments);

export default route;
