import express from 'express';
import Users from '../controllers/Users';
import middlewares from '../middlewares';

const route = express.Router();

const {
  verifyToken,
  validateUserPassword,
  validateUserSignup,
  getSessionFromToken
} = middlewares;

route.post('/create', validateUserSignup, Users.create);
route.get('/verifyEmail/:token', verifyToken, Users.verifyUserEmail);
route.get('/verificationEmail/:email', Users.resendVerificationEmail);
route.patch(
  '/changePassword',
  verifyToken,
  getSessionFromToken,
  validateUserPassword,
  Users.changePassword
);
export default route;
