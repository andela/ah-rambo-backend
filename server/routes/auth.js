import express from 'express';
import passport from 'passport';
import Passport from '../helpers/passport';
import PassportError from '../middlewares/passportError';
import Auth from '../controllers/Auth';

const auth = express.Router();

const { CLIENT_URL } = process.env;

Passport(auth);
auth.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
auth.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: `${CLIENT_URL}/login`
  }),
  PassportError.passportErrors,
  Auth.socialLogin
);
auth.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

auth.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/login` }),
  Auth.socialLogin
);

auth.get('/twitter', passport.authenticate('twitter'));

auth.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: `${CLIENT_URL}/login` }),
  Auth.socialLogin
);

export default auth;
