import jwt from 'jsonwebtoken';

/**
 * @name generateToken
 * @param {string} payload
 * @param {string} expiresIn
 * @return {string} token
 */
const generateToken = payload => jwt.sign(payload, process.env.JWT_KEY);

export default generateToken;
