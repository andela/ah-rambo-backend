import express from 'express';
import Article from '../controllers/Articles';
import middlewares from '../middlewares';

const {
  multerUploads,
  getSessionFromToken,
  verifyToken,
  validateArticle,
  checkUserVerification
} = middlewares;
const router = express.Router();
router.post(
  '/create',
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  multerUploads('image'),
  validateArticle,
  Article.createArticle
);
export default router;
