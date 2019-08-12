import { verifyToken, getSessionFromToken } from './verifyToken';
import validateUserSignup from './userValidation';
import validateUserPassword from './passwordValidation';
import validateProfileEdit from './profileValidation';
import checkUserVerification from './checkUserVerification';
import multerUploads from './multer';
import validateResetPassword from './resetPasswordValidation';
import validatePagination from './paginationValidation';

const middlewares = {
  verifyToken,
  validateUserSignup,
  getSessionFromToken,
  validateUserPassword,
  validateProfileEdit,
  checkUserVerification,
  multerUploads,
  validateResetPassword,
  validatePagination
};

export default middlewares;
