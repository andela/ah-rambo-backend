import express from 'express';
import Followers from '../controllers/Followers';
import { verifyToken, getSessionFromToken } from '../middlewares/verifyToken';

const route = express.Router();

route.post(
  '/:username/follow',
  verifyToken,
  getSessionFromToken,
  Followers.follow
);
route.delete(
  '/:username/follow',
  verifyToken,
  getSessionFromToken,
  Followers.unfollow
);

export default route;
