import express from 'express';
import user from './user';
import session from './session';

const route = express.Router();

route.use('/users', user);
route.use('/sessions', session);

export default route;
