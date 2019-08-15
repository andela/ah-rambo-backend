import models from '../database/models';

const { UserFollower } = models;

/**
 * @name isFollowing
 * @async
 * @param {integer} userId express request object
 * @param {integer} followerId express response object
 * @returns {bolean} retunn boolean
 */
const isFollowing = async (userId, followerId) => {
  const following = await UserFollower.findOne({
    where: { userId, followerId }
  });
  return !!following;
};

export default isFollowing;
