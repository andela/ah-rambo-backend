import { verifyToken, getSessionFromToken } from './verifyToken';
import validateUserSignup from './userValidation';
import validateUserPassword from './passwordValidation';
import validateProfileEdit from './profileValidation';
import checkUserVerification from './checkUserVerification';
import multerUploads from './multer';
import validateResetPassword from './resetPasswordValidation';
import validateArticle from './articleValidation';

const middlewares = {
  verifyToken,
  validateUserSignup,
  getSessionFromToken,
  validateUserPassword,
  validateArticle,
  validateProfileEdit,
  checkUserVerification,
  multerUploads,
  validateResetPassword
};

export default middlewares;
