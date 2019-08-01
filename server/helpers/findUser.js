import models from '../database/models';

const { User } = models;
/**
 * @name findUser
 * @param {string} parameter - user input
 * @returns {object} user object
 */
const findUser = async (parameter) => {
  let param;
  if (!/\D/.test(parameter)) {
    param = { id: parameter };
  } else if (/\D/.test(parameter) && /@.{2,9}\./.test(parameter)) {
    param = { email: parameter };
  } else {
    param = { userName: parameter };
  }
  return User.findOne({ where: param });
};

export default findUser;
