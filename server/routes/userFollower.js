import express from 'express';
import Followers from '../controllers/Followers';
import { verifyToken } from '../middlewares/verifyToken';

const route = express.Router();

route.get('/followers', verifyToken, Followers.allFollowers);
route.get('/followings', verifyToken, Followers.allFollowings);

export default route;
