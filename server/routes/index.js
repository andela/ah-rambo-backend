import express from 'express';
import user from './user';
import session from './session';
import auth from './auth';
import follower from './follower';
import userFollower from './userFollower';
import profile from './profile';

const route = express.Router();

route.use('/users', user);
route.use('/sessions', session);
route.use('/auth', auth);
route.use('/profiles', profile, follower);
route.use('/user', userFollower);

export default route;
