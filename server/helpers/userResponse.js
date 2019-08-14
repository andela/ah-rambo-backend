/**
 * @name userResponse
 * @param {Object} res express response object
 * @param {Number} code status code to return
 * @param {Object} user object with response details
 * @param {Object} token strings
 * @returns {JSON} JSON response with status and response information
 */
const userResponse = (res, code, user, token) => {
  delete user.dataValues.password;
  return token
    ? res.status(code).json({ user, token })
    : res.status(code).json({ user });
};
export default userResponse;
