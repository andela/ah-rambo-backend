import models from '../database/models';

const { Sessions } = models;

/**
 * @name findUser
 * @param {string} param
 * @return {string} object
 */
const findToken = async (param) => {
  const session = await Sessions.findOne({ active: true }, { where: param });
  if (new Date(Date.now()) >= session.expiresAt) {
    await Sessions.update({ active: false }, { where: param });
    return undefined;
  }

  return session;
};

export default findToken;
