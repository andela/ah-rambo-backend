import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import passportCallback from '../middlewares/passportCallback';

export default () => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_REDIRECT_URL,
        includeEmail: true
      },
      passportCallback
    )
  );
};
