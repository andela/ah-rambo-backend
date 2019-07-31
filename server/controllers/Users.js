import bcrypt from 'bcryptjs';
import models from '../database/models';
import {
  serverResponse,
  serverError,
  checkEmail,
  checkUserName
} from '../helpers';

const { User } = models;

/**
 * @export
 * @class Users
 */
class Users {
  /**
   * @name signUp
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new user
   */
  static async signUp(req, res) {
    try {
      const { password, confirmPassword } = req.body;
      if (password !== confirmPassword) {
        return serverResponse(res, 400, { error: 'Passwords do not match' });
      }
      if (await checkEmail(req.body.email)) {
        return serverResponse(res, 409, {
          error: 'Email has already been taken'
        });
      }
      if (await checkUserName(req.body.userName)) {
        return serverResponse(res, 409, {
          error: 'Username has already been taken'
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        ...req.body,
        password: hashedPassword
      });
      delete user.dataValues.password;
      // const token = await generateToken(user.id);
      return serverResponse(res, 201, { user });
    } catch (error) {
      return serverError(res);
    }
  }
}

export default Users;
