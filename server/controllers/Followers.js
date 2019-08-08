import models from '../database/models';
import { serverResponse, serverError } from '../helpers';

const { User, UserFollower } = models;
const userAttributes = ['id', 'firstName', 'lastName', 'userName', 'email'];

/**
 * @export
 * @class Followers
 */
class Followers {
  /**
   * @name follow
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of new follower
   */
  static async follow(req, res) {
    try {
      const {
        user: { id },
        params: { username }
      } = req;

      const userThatWantsToFollow = await User.findById(id);
      const userToBeFollowed = await User.findByUsername(username);
      const error = Followers.canFollowOrUnfollow(userToBeFollowed, id);
      if (error) return serverResponse(res, error.status, error.message);
      const follower = await UserFollower.findOrCreate({
        where: {
          userId: userToBeFollowed.id,
          followerId: id
        }
      });
      const { dataValues } = follower[0];

      await Followers.UpdateUserFollowersAndFollowingsCount(
        userThatWantsToFollow,
        userToBeFollowed
      );

      return serverResponse(res, 200, {
        following: { message: 'followed successfully', data: dataValues }
      });
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @name unfollow
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of an unfollowed user
   */
  static async unfollow(req, res) {
    try {
      const {
        user: { id },
        params: { username }
      } = req;
      const userThatWantsToUnfollow = await User.findById(id);
      const userToBeUnfollowed = await User.findByUsername(username);
      const error = Followers.canFollowOrUnfollow(userToBeUnfollowed, id);
      if (error) return serverResponse(res, error.status, error.message);
      await UserFollower.destroy({
        where: {
          userId: userToBeUnfollowed.id,
          followerId: id
        }
      });

      await Followers.UpdateUserFollowersAndFollowingsCount(
        userThatWantsToUnfollow,
        userToBeUnfollowed
      );

      return serverResponse(res, 200, {
        data: {
          message: `you sucessfully unfollowed ${username}`,
          id: userToBeUnfollowed.id
        }
      });
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @name allFollowers
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of an unfollowed user
   */
  static async allFollowers(req, res) {
    try {
      const {
        user: { id }
      } = req;
      const user = await User.findById(id);
      const followers = await user.getAllFollowers({
        include: [
          {
            model: User,
            as: 'follower',
            attributes: userAttributes
          }
        ]
      });
      const users = followers.map(follower => follower.dataValues);

      serverResponse(res, 200, { followers: users });
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @name allFollowings
   * @async
   * @static
   * @memberof Users
   * @param {Object} req express request object
   * @param {Object} res express response object
   * @returns {JSON} JSON object with details of an unfollowed user
   */
  static async allFollowings(req, res) {
    try {
      const {
        user: { id }
      } = req;
      const user = await User.findById(id);
      const followings = await user.getAllFollowings({
        include: [
          {
            model: User,
            as: 'following',
            attributes: userAttributes
          }
        ]
      });
      const users = followings.map(following => following.dataValues);
      serverResponse(res, 200, { followings: users });
    } catch (error) {
      return serverError(res);
    }
  }

  /**
   * @name canFollowOrUnfollow
   * @async
   * @static
   * @memberof Users
   * @param {Object} user user object
   * @param {integer} id id of other user
   * @returns {object} object with details of a user
   */
  static canFollowOrUnfollow(user, id) {
    if (!user) {
      return { status: 404, message: { error: 'user not found' } };
    }
    if (id === user.id) {
      return {
        status: 409,
        message: { error: 'user cannot perform this action' }
      };
    }
    return false;
  }

  /**
   * @name UpdateUserFollowersAndFollowingsCount
   * @async
   * @static
   * @memberof Followers
   * @param {Object} source the source user object
   * @param {Object} target the target user object
   * @returns {Null} Null object
   */
  static async UpdateUserFollowersAndFollowingsCount(source, target) {
    const followingsCount = await source.countAllFollowings();
    const followersCount = await target.countAllFollowers();

    await User.update({ followingsCount }, { where: { id: source.id } });
    await User.update({ followersCount }, { where: { id: target.id } });

    return null;
  }
}

export default Followers;
