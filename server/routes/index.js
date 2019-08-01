import express from 'express';
import users from './user';

const route = express.Router();

route.use('/users', users);

export default route;
