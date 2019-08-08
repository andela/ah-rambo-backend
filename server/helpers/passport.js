import passport from 'passport';
import facebook from './facebook';
import google from './google';
import twitter from './twitter';

export default (app) => {
  app.use(passport.initialize());
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  facebook();
  google();
  twitter();
};
