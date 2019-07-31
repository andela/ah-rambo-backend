/**
 * @name serverResponse
 * @param {object} res - response object
 * @param {integer} code - status code
 * @param {object} data - data to send in response
 * @returns {json} response to user
 */
const serverResponse = (res, code, data) => res.status(code).json({ ...data });

/**
 * @name serverError
 * @param {object} res - response object
 * @returns {json} server response to user
 */
const serverError = res => res
  .status(500)
  .json({ error: "Something went wrong we're trying to fix this" });

export { serverResponse, serverError };
