import models from '../database/models';
import generateToken from './generateToken';
import dateHelper from './dateHelper';

const { User, Session } = models;
const { expiryDate } = dateHelper;
/**
 * @name createSocialUser
 * @description function that creates a new user in via socialLogin
 * @param { Object }  data to check in the database
 * @returns { Object } value indicating if username exists
 */
const createSocialUser = async (data) => {
  const {
    firstName,
    lastName,
    email,
    ipAddress,
    userAgent,
    devicePlatform
  } = data;
  const expiresAt = expiryDate(devicePlatform);
  const users = await User.findOrCreate({
    where: { email },
    defaults: {
      firstName,
      lastName,
      email
    }
  });
  const result = { ...users[0].dataValues };
  const { id } = result;
  const token = generateToken({ id });
  await Session.create({
    userId: id,
    token,
    expiresAt,
    userAgent,
    ipAddress,
    devicePlatform
  });
  result.token = token;
  return result;
};
export default createSocialUser;
