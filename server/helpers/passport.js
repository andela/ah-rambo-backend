import passport from 'passport';
import facebook from './facebook';

export default (app) => {
  app.use(passport.initialize());
  facebook();
};
