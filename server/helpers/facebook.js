import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import passportCallback from '../middlewares/passportCallback';

export default () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.REDIRECT_URL,
        profileFields: ['id', 'first_name', 'last_name', 'photos', 'email']
      },
      passportCallback
    )
  );
};
