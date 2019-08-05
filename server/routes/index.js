import express from 'express';
import user from './user';
import session from './session';
import auth from './auth';

const route = express.Router();

route.use('/users', user);
route.use('/sessions', session);
route.use('/auth', auth);

export default route;
