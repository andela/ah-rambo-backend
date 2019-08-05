import { serverResponse } from '../helpers';
/**
 * @export
 * @class Users
 */
class ErrorCatcher {
  /**
   * @name passportError
   * @static
   * @memberof Users
   * @param {Object} error express err object
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @param {function} next express next function
   * @returns {JSON} JSON object with details of new user
   */
  static passportErrors(error, req, res, next) {
    if (!error) {
      next();
    }
    serverResponse(res, 400, { message: 'Auth failed' });
  }
}
export default ErrorCatcher;
