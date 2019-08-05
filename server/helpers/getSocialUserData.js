/**
 * @name getuserData
 * @async
 * @param {Object} request express request object
 * @returns {Object} facebook or Google data with details of new user
 */
const getuserData = (request) => {
  const { email } = request.user._json;
  const { givenName, familyName } = request.user.name;
  const data = {
    email,
    givenName,
    familyName
  };
  return data;
};
/**
 * @name getSocialUserData
 * @async
 * @param {Object} request express request object
 * @returns {Object} userData  with details of new user
 */
const getSocialUserData = (request) => {
  let userData;
  const { path } = request.route;
  switch (path) {
  case '/facebook/callback':
  case '/google/callback': {
    userData = getuserData(request);
    break;
  }
  default:
    userData = null;
  }
  return userData;
};
export default getSocialUserData;
