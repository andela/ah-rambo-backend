import jwt from 'jsonwebtoken';

/**
 * @name generateToken
 * @param {object} payload
 * @return {string} token
 */
const generateToken = payload => jwt.sign(payload, process.env.JWT_KEY);

export default generateToken;
