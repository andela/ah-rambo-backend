import { verifyToken, getSessionFromToken } from './verifyToken';
import validateUserSignup from './userValidation';
import validateUserPassword from './passwordValidation';
import validateProfileEdit from './profileValidation';
import checkUserVerification from './checkUserVerification';
import multerUploads from './multer';
import validateResetPassword from './resetPasswordValidation';
import validatePagination from './paginationValidation';
import validateArticle from './articleValidation';
import authorizeUser from './authorizeUser';
import validateCommentBody from './commentValidation';
import createCategoryValidation from './createCategoryValidation';
import validateSearch from './searchValidation';

const middlewares = {
  verifyToken,
  validateUserSignup,
  getSessionFromToken,
  validateUserPassword,
  validateArticle,
  validateProfileEdit,
  checkUserVerification,
  multerUploads,
  validateResetPassword,
  validatePagination,
  authorizeUser,
  validateCommentBody,
  createCategoryValidation,
  validateSearch
};

export default middlewares;
