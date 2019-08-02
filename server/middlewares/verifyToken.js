import jwt from 'jsonwebtoken';
import { serverResponse, findToken, checkId } from '../helpers';

/**
 * @name verifyToken
 * @param {object} request
 * @param {object} response
 * @param {object} next
 * @return {string} object
 */
const verifyToken = async (request, response, next) => {
  try {
    const token = request.headers.authorization;
    if (!token) {
      return serverResponse(response, 401, { message: 'no token provided' });
    }
    const decoded = await jwt.verify(token, process.env.JWT_KEY);
    const user = await checkId(decoded.id);
    if (!user) {
      return serverResponse(response, 404, {
        message: 'user does not exist'
      });
    }
    request.user = user;
    const session = await findToken({ token });
    if (!session) {
      return serverResponse(response, 440, {
        message: 'session expired'
      });
    }
    next();
  } catch (err) {
    return serverResponse(response, 401, { message: err.name });
  }
};

export default verifyToken;
