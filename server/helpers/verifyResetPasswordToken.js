import jwt from 'jsonwebtoken';

/**
 *
 *
 *
 * @param {string} token jwt token
 * @returns {integer} id of the user
 */
const verifyResetToken = async (token) => {
  try {
    const { id } = await jwt.verify(token, process.env.JWT_KEY);
    return id;
  } catch (error) {
    return false;
  }
};

export default verifyResetToken;
