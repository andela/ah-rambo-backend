import models from '../database/models';

const { Session } = models;

/**
 * @name findUser
 * @param {string} param
 * @return {string} object
 */
const findToken = async (param) => {
  const session = await Session.findOne({ active: true }, { where: param });
  if (new Date(Date.now()) >= session.expiresAt) {
    await Session.update({ active: false }, { where: param });
    return undefined;
  }

  return session;
};

export default findToken;
