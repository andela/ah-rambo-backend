import models from '../database/models';
import {
  serverResponse,
  serverError,
  imageUpload,
  userResponse
} from '../helpers';

import middlewares from '../middlewares';

const { verifyToken } = middlewares;

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
      return userResponse(res, 200, currentUser);
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @name view
   * @description allows a user to view other users profile
   * @param {object} req request object
   * @param {object} res response object
   * @returns {json} the json response been return by the server
   * @memberof ProfilesController
   */
  static async view(req, res) {
    try {
      const {
        params: { userDetail },
        headers: { authorization }
      } = req;

      let userProfile;

      if (/.+@.+\.[A-Za-z]+$/.test(userDetail)) {
        userProfile = await User.findByEmail(userDetail);
      } else {
        userProfile = await User.findByUsername(userDetail);
      }

      if (!userProfile) {
        return serverResponse(res, 404, { error: 'user does not exist' });
      }

      if (authorization) {
        return verifyToken(req, res, Profiles.authView(res, userProfile));
      }
      const {
        firstName,
        lastName,
        userName,
        identifiedBy,
        avatarUrl,
        bio,
        followingsCount,
        followersCount
      } = userProfile;
      return serverResponse(res, 200, {
        user: {
          firstName,
          lastName,
          userName,
          identifiedBy,
          avatarUrl,
          bio,
          followingsCount,
          followersCount
        }
      });
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @name authView
   * @description allows a user to view other users profile
   * @param {object} res response object
   * @param {object} userProfile user object
   * @returns {json} the json response been return by the server
   * @memberof ProfilesController
   */
  static authView(res, userProfile) {
    const {
      firstName,
      lastName,
      userName,
      avatarUrl,
      bio,
      followingsCount,
      followersCount,
      identifiedBy,
      location,
      occupation
    } = userProfile;
    return serverResponse(res, 200, {
      user: {
        firstName,
        lastName,
        userName,
        avatarUrl,
        bio,
        followingsCount,
        followersCount,
        identifiedBy,
        location,
        occupation
      }
    });
  }
}

export default Profiles;
