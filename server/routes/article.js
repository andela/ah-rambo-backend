import express from 'express';
import Articles from '../controllers/Articles';
import middlewares from '../middlewares';

const router = express.Router();

const {
  multerUploads,
  getSessionFromToken,
  verifyToken,
  validateArticle,
  checkUserVerification,
  articleEditValidation
} = middlewares;

const protectedRoutesMiddlewares = [verifyToken, getSessionFromToken];

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
router.get('/read/:slug', Articles.viewArticle);

router.patch(
  '/update/:slug',
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  multerUploads('image'),
  articleEditValidation,
  Articles.update
);

router.get(
  '/user',
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  Articles.userArticles
);
export default router;
