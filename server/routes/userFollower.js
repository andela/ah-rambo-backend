import express from 'express';
import Followers from '../controllers/Followers';
import { verifyToken, getSessionFromToken } from '../middlewares/verifyToken';

const route = express.Router();

route.get(
  '/followers',
  verifyToken,
  getSessionFromToken,
  Followers.allFollowers
);
route.get(
  '/followings',
  verifyToken,
  getSessionFromToken,
  Followers.allFollowings
);

export default route;
