import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passportCallback from '../middlewares/passportCallback';

export default () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL
      },
      passportCallback
    )
  );
};
