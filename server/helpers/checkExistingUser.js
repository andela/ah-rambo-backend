import models from '../database/models';

const { User } = models;

/**
 * @name checkEmail
 * @description function that checks if the email provided is in the database
 * @param {String} email email to check in the database
 * @returns {Boolean} True or false value indicating if email exists
 */
const checkEmail = email => User.findOne({ where: { email } });

/**
 * @name checkUserName
 * @description function that checks if the username provided is in the database
 * @param {String} userName username to check in the database
 * @returns {Boolean} True or false value indicating if username exists
 */
const checkUserName = userName => User.findOne({ where: { userName } });

/**
 * @name checkId
 * @description function that checks if the username provided is in the database
 * @param {Number} id id to check in the database
 * @returns {Boolean} True or false value indicating if username exists
 */
const checkId = id => User.findOne({ where: { id } });

export { checkEmail, checkUserName, checkId };
