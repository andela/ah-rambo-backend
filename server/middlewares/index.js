import { verifyToken, getSessionFromToken } from './verifyToken';
import validateUserSignup from './userValidation';
import validateUserPassword from './passwordValidation';
import validateProfileEdit from './profileValidation';
import checkUserVerification from './checkUserVerification';

const middlewares = {
  verifyToken,
  validateUserSignup,
  getSessionFromToken,
  validateUserPassword,
  validateProfileEdit,
  checkUserVerification
};

export default middlewares;
