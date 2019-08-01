import express from 'express';
import users from './user';
import session from './session';

const route = express.Router();

route.use('/', users, session);

export default route;
