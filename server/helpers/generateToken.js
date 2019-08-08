import jwt from 'jsonwebtoken';

const { JWT_KEY } = process.env;

/**
 * @name generateToken
 * @param {object} payload
 * @param {String} expiresIn
 * @return {string} token
 */
const generateToken = (payload, expiresIn) => {
  if (!expiresIn) return jwt.sign(payload, JWT_KEY);
  return jwt.sign(payload, JWT_KEY, { expiresIn });
};

export default generateToken;
