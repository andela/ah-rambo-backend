import models from '../database/models';

const { Session } = models;

/**
 * @name findUser
 * @param {string} token
 * @return {object} object
 */
const findToken = async (token) => {
  const session = await Session.findActiveSessionByToken(token);
  if (session && new Date(Date.now()) >= session.expiresAt) {
    await Session.update({ active: false }, { where: { token } });
    return false;
  }

  return session;
};

export default findToken;
