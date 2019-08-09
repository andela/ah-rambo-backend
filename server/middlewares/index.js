import { verifyToken, getSessionFromToken } from './verifyToken';
import validateUserSignup from './userValidation';
import validateUserPassword from './passwordValidation';

const middlewares = {
  verifyToken,
  validateUserSignup,
  getSessionFromToken,
  validateUserPassword
};

export default middlewares;
