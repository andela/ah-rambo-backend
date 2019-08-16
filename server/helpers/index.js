import { serverResponse, serverError } from './serverResponse';
import findToken from './findToken';
import generateToken from './generateToken';
import { setCustomMessage, validateInputs } from './validationHelper';
import findUser from './findUser';
import dateHelper from './dateHelper';
import getUserAgent from './getUserAgent';
import createSocialUsers from './createSocialUsers';
import getSocialUserData from './getSocialUserData';
import imageUpload from './imageUpload';
import emailTemplates from './emailTemplates';
import verifyResetPasswordToken from './verifyResetPasswordToken';
import userResponse from './userResponse';
import { paginationValues, pageCounter } from './paginationHelper';
import {
  removeSpecialCharacters,
  formatTag,
  removeDuplicateTags
} from './tagHelpers';
import isFollowing from './isFollowing';

const { expiryDate } = dateHelper;
const { sendResetPasswordEmail, sendVerificationEmail } = emailTemplates;

export {
  findUser,
  expiryDate,
  serverResponse,
  serverError,
  setCustomMessage,
  validateInputs,
  findToken,
  generateToken,
  getUserAgent,
  createSocialUsers,
  getSocialUserData,
  sendVerificationEmail,
  imageUpload,
  sendResetPasswordEmail,
  verifyResetPasswordToken,
  userResponse,
  paginationValues,
  pageCounter,
  removeSpecialCharacters,
  formatTag,
  removeDuplicateTags,
  isFollowing
};
