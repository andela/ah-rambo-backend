import express from 'express';
import passport from 'passport';
import Passport from '../helpers/passport';
import PassportError from '../middlewares/passportError';
import Auth from '../controllers/Auth';

const auth = express.Router();

Passport(auth);
auth.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
auth.get(
  '/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
  PassportError.passportErrors,
  Auth.facebookSocialLogin
);
auth.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

auth.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  Auth.facebookSocialLogin
);
export default auth;
