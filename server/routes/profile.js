import express from 'express';
import Profiles from '../controllers/Profiles';
import middlewares from '../middlewares';

const {
  verifyToken,
  multerUploads,
  checkUserVerification,
  getSessionFromToken,
  validateProfileEdit
} = middlewares;

const route = express.Router();

route.patch(
  '/:id',
  validateProfileEdit,
  verifyToken,
  getSessionFromToken,
  checkUserVerification,
  multerUploads('avatarUrl'),
  Profiles.update
);

route.get('/:userDetail', Profiles.view);

export default route;
