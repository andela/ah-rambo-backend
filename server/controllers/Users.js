import bcrypt from 'bcryptjs';
import models from '../database/models';
import {
  serverResponse,
  serverError,
  checkEmail,
  checkUserName,
  generateToken
} from '../helpers';

const { User } = models;

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
      if (await checkEmail(req.body.email)) {
        return serverResponse(res, 409, {
          error: 'email has already been taken'
        });
      }
      if (await checkUserName(req.body.userName)) {
        return serverResponse(res, 409, {
          error: 'username has already been taken'
        });
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...req.body,
        password: hashedPassword
      });
      const token = generateToken(user.id);
      res.set('Authorization', token);
      delete user.dataValues.password;
      return serverResponse(res, 201, { user, token });
    } catch (error) {
      return serverError(res);
    }
  }
}

export default Users;
