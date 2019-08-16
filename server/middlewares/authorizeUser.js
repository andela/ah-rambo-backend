import { serverResponse } from '../helpers';

/**
 * @name authorizeUser
 * @param {Integer} allowedLevel the level given access
 * @param {Object} response express response object
 * @param {Object} next express next function that calls the next middleware
 * @returns {Void} it calls the next middleware
 */
const authorizeUser = allowedLevel => async (request, response, next) => {
  const { level } = request.user;
  if (level < allowedLevel) {
    return serverResponse(response, 403, { error: 'unauthorized user' });
  }
  next();
};

export default authorizeUser;
