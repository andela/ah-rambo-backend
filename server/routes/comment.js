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
  validateCommentBody,
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  Comments.create
);

route.patch(
  '/:slug/comments/:id',
  validateCommentBody,
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  Comments.update
);

route.delete(
  '/:slug/comments/:id',
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  Comments.delete
);

route.get('/:slug/comments', Comments.getArticleComments);

export default route;
