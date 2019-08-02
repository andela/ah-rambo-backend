/**
 * @name passportError
 * @param {string} accessToken express err object
 * @param {string} refreshToken express request object
 * @param {Object} profile express response object
 * @param {function} done express next function
 * @returns {JSON} JSON object with details of new user
 */
const callback = (accessToken, refreshToken, profile, done) => done(null, profile);

export default callback;
