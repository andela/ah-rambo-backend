import { serverResponse, serverError } from './serverResponse';
import { checkEmail, checkUserName, checkId } from './checkExistingUser';
import findToken from './findToken';
import generateToken from './generateToken';
import { setCustomMessage, validateInputs } from './validationHelper';
import findUser from './findUser';
import dateHelper from './dateHelper';
import getUserAgent from './getUserAgent';

const { expiryDate } = dateHelper;

export {
  findUser,
  expiryDate,
  serverResponse,
  serverError,
  checkEmail,
  checkUserName,
  setCustomMessage,
  validateInputs,
  findToken,
  generateToken,
  getUserAgent,
  checkId
};
