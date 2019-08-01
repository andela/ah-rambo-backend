import express from 'express';
import Users from '../controllers/Users';
import validateUserSignup from '../middlewares/userValidation';

const route = express.Router();

route.post('/create', validateUserSignup, Users.create);

export default route;
