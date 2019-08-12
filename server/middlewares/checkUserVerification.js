import { serverResponse } from '../helpers';

/**
 * @name checkUserVerification
 * @async
 * @param {Object} req express request object
 * @param {Object} res express response object
 * @param {Function} next function that calls next middleware
 * @returns {Function} calls the next middleware
 */
const checkUserVerification = async (req, res, next) => {
  const { user } = req;
  const newUserPeriod = Date.now() - 24 * 3600000;
  const isNotNewUser = Date.parse(user.createdAt) < newUserPeriod;
  if (isNotNewUser && !user.verified) {
    return serverResponse(res, 403, {
      error: 'please verify your email address'
    });
  }
  next();
};

export default checkUserVerification;
