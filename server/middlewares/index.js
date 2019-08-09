import { verifyToken, getSessionFromToken } from './verifyToken';
import validateUserSignup from './userValidation';

const middlewares = { verifyToken, validateUserSignup, getSessionFromToken };

export default middlewares;
