import express from 'express';
import user from './user';
import session from './session';
import auth from './auth';
import follower from './follower';
import userFollower from './userFollower';
import profile from './profile';
import article from './article';
import tag from './tag';
import comment from './comment';
import category from './category';

const route = express.Router();

route.use('/users', user);
route.use('/sessions', session);
route.use('/auth', auth);
route.use('/profiles', profile, follower);
route.use('/user', userFollower);
route.use('/articles', article, comment);
route.use('/tags', tag);
route.use('/categories', category);

export default route;
