import bcrypt from 'bcryptjs';
import models from '../database/models';
import {
  serverResponse,
  serverError,
  generateToken,
  expiryDate,
  getUserAgent
} from '../helpers';

const { User, Session } = models;

/**
 * @export
 * @class Users
 */
class Users {
  /**
   * @name create
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new user
   */
  static async create(req, res) {
    try {
      if (await User.findByEmail(req.body.email)) {
        return serverResponse(res, 409, {
          error: 'email has already been taken'
        });
      }
      if (await User.findByUsername(req.body.userName)) {
        return serverResponse(res, 409, {
          error: 'username has already been taken'
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password: hashedPassword
      });
      const { devicePlatform, userAgent } = getUserAgent(req);
      const token = generateToken(user.id);
      const { id } = user;
      const expiresAt = expiryDate(devicePlatform);
      await Session.create({
        userId: id,
        token,
        expiresAt,
        userAgent,
        ipAddress: req.ip,
        devicePlatform
      });
      res.set('Authorization', token);
      delete user.dataValues.password;
      return serverResponse(res, 201, { user, token });
    } catch (error) {
      return serverError(res);
    }
  }
}

export default Users;
