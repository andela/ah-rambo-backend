import express from 'express';
import Categories from '../controllers/Categories';
import middlewares from '../middlewares';

const route = express.Router();
const {
  authorizeUser,
  verifyToken,
  createCategoryValidation,
  getSessionFromToken
} = middlewares;

route.get('/', Categories.getAll);

route.post(
  '/create',
  verifyToken,
  getSessionFromToken,
  authorizeUser(4),
  createCategoryValidation,
  Categories.create
);

export default route;
