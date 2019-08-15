import bcrypt from 'bcryptjs';
import {
  findUser,
  generateToken,
  serverResponse,
  serverError,
  expiryDate,
  getUserAgent,
  userResponse
} from '../helpers';
import models from '../database/models';

const { Session } = models;

/**
 *
 *
 * @class Sessions
 */
class Sessions {
  /**
   *
   *
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @memberof User
   * @returns {json}  object
   */
  static async create(req, res) {
    try {
      const { userLogin, password } = req.body;
      if (Object.keys(req.body).length < 1 || !userLogin || !password) {
        return serverResponse(res, 400, {
          message: 'invalid authentication details'
        });
      }
      const user = await findUser(userLogin);
      let verifyPassword;
      if (user) verifyPassword = bcrypt.compareSync(password, user.password);
      if (!user || !verifyPassword) {
        return serverResponse(res, 401, {
          message: 'incorrect username or password'
        });
      }
      const { devicePlatform, userAgent } = getUserAgent(req);
      const { id } = user;
      const expiresAt = expiryDate(devicePlatform);
      const token = generateToken({ id });
      await Session.create({
        userId: id,
        token,
        expiresAt,
        userAgent,
        ipAddress: req.ip,
        devicePlatform
      });
      res.set('Authorization', token);
      return userResponse(res, 200, user, token);
    } catch (error) {
      serverError(res);
    }
  }

  /**
   *
   *
   * @static
   * @param {object} req - request object
   * @param {object} res - response object
   * @memberof Sessions
   * @returns {json}  object
   */
  static async destroy(req, res) {
    try {
      const token = req.headers.authorization;
      await Session.update({ active: false }, { where: { token } });
      return serverResponse(res, 200, { message: 'sign out successful' });
    } catch (error) {
      serverError(res);
    }
  }
}

export default Sessions;
