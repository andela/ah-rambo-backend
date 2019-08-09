import jwt from 'jsonwebtoken';
import models from '../database/models';
import { serverResponse, findToken } from '../helpers';

const { User } = models;

/**
 * @name verifyToken
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @return {string} object
 */
const verifyToken = async (request, response, next) => {
  try {
    const token = request.headers.authorization || request.params.token;
    if (!token) {
      return serverResponse(response, 401, { message: 'no token provided' });
    }
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded.id);
    if (!user) {
      return serverResponse(response, 404, {
        message: 'user does not exist'
      });
    }
    request.user = user;
    response.locals.token = token;
    next();
  } catch (err) {
    return serverResponse(response, 401, { message: err.name });
  }
};

/**
 * @name getSessionFromToken
 * @param {Object} request request object
 * @param {Object} response express response object
 * @param {Object} next express next function that calls the next middleware
 * @returns {Void} it calls the next middleware
 */
const getSessionFromToken = async (request, response, next) => {
  const { token } = response.locals;
  const session = await findToken(token);
  if (!session) {
    return serverResponse(response, 404, {
      message: 'session not found. please re-authenticate to continue'
    });
  }
  next();
};

export { verifyToken, getSessionFromToken };
