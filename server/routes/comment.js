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

route.patch(
  '/:slug/comments/:id',
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  validateCommentBody,
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
