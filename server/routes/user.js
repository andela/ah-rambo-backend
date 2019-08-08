import express from 'express';
import Users from '../controllers/Users';
import middlewares from '../middlewares';

const route = express.Router();

const { validateUserSignup, verifyToken } = middlewares;

route.post('/create', validateUserSignup, Users.create);
route.get('/verifyEmail/:token', verifyToken, Users.verifyUserEmail);
route.get('/verificationEmail/:email', Users.resendVerificationEmail);

export default route;
