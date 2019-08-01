import bcrypt from 'bcryptjs';
import helpers from '../helpers';
import models from '../database/models';

const Session = models.Sessions;
const {
  findUser,
  // generateToken,
  serverResponse,
  serverError
  // expiryDate
} = helpers;
// const mobileDeviceIndicator =
// ['mobile', 'andriod', 'iphone', 'tablet', 'ipad', 'ipod'];
// const userAgent = req.headers['user-agent']
// const devicePlatform =
// mobileDeviceIndicator
// .some(device => userAgent.toLowerCase().indexOf(device) > 0) ? 'mobile' : 'browser';

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
      if (!/\D/.test(userLogin)) {
        return serverResponse(res, 400, {
          message: 'user login must be a string'
        });
      }
      const user = await findUser(userLogin);
      let verifyPassword;
      if (user) verifyPassword = bcrypt.compareSync(password, user.password);
      if (!user || !verifyPassword) {
        return serverResponse(res, 403, {
          message: 'incorrect username or password'
        });
      }
      const { id, dataValues } = user;
      // const token = generateToken(id);
      // await Session.create({
      //   userId: id,
      //   token,
      //   expiresAt: expiryDate,
      //   userAgent,
      //   ipAddress: req.ip
      //   devicePlatform,
      // });
      delete dataValues.password;
      return serverResponse(res, 200, { user: { ...dataValues } });
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
      const { token } = req.params;
      await Session.update({ active: false }, { where: { token } });
      return serverResponse(res, 200, { message: 'signout successful' });
    } catch (error) {
      serverError(res);
    }
  }
}

export default Sessions;
