import express from 'express';
import Users from '../controllers/Users';
import middlewares from '../middlewares';

const route = express.Router();

const {
  verifyToken,
  validateUserPassword,
  validateUserSignup,
  getSessionFromToken,
  validateResetPassword
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
route.post(
  '/resetpassword',
  validateResetPassword.email,
  Users.requestPasswordResetLink
);
route.patch(
  '/resetpassword/:token',
  validateResetPassword.newPassword,
  Users.resetPassword
);

export default route;
