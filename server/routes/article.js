import express from 'express';
import Articles from '../controllers/Articles';
import middlewares from '../middlewares';

const router = express.Router();

const {
  multerUploads,
  getSessionFromToken,
  verifyToken,
  validateArticle,
  checkUserVerification
} = middlewares;

const protectedRoutesMiddlewares = [
  verifyToken,
  getSessionFromToken,
  checkUserVerification
];

router.post(
  '/create',
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  multerUploads('image'),
  validateArticle,
  Articles.createArticle
);
router.post('/:slug/like', protectedRoutesMiddlewares, Articles.addLike);
router.post('/:slug/dislike', protectedRoutesMiddlewares, Articles.addDislike);
router.delete('/:slug/like', protectedRoutesMiddlewares, Articles.removeLike);
router.delete(
  '/:slug/dislike',
  protectedRoutesMiddlewares,
  Articles.removeDislike
);

export default router;
