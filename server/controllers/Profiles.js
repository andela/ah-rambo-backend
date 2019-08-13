import models from '../database/models';
import { serverResponse, serverError, imageUpload } from '../helpers';

const { User } = models;

/**
 * @export
 * @class Profiles
 */
class Profiles {
  /**
   * @name update
   * @description allows a user to update their profile
   * @param {object} req request object
   * @param {object} res response object
   * @returns {json} the json response been return by the server
   * @memberof ProfilesController
   */
  static async update(req, res) {
    try {
      const {
        body, user, file, params
      } = req;
      const checkId = user.id == params.id;
      const { email, userName } = body;
      if (!checkId) {
        return serverResponse(res, 403, {
          error: 'you cannot access this route'
        });
      }
      if (email) {
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
          return serverResponse(res, 409, {
            error: 'email has already been taken'
          });
        }
      }
      if (userName) {
        const existingUserName = await User.findByUsername(userName);
        if (existingUserName) {
          return serverResponse(res, 409, {
            error: 'username has already been taken'
          });
        }
      }
      let avatarUrl;
      if (file) {
        avatarUrl = await imageUpload(req);
      }
      await User.update(
        {
          ...body,
          avatarUrl
        },
        {
          where: { id: user.id },
          returning: true,
          raw: true
        }
      );
      const currentUser = await User.findById(user.id);
      delete currentUser.dataValues.password;
      return serverResponse(res, 200, {
        user: currentUser
      });
    } catch (error) {
      return serverError(res);
    }
  }
}

export default Profiles;
