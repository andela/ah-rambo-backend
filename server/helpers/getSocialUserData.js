/**
 * @name facebookData
 * @async
 * @param {Object} request express request object
 * @returns {Object} facebookUserData with details of new user
 */
const facebookData = (request) => {
  const { email } = request.user._json;
  const { givenName, familyName } = request.user.name;
  const facebookUserData = {
    email,
    givenName,
    familyName
  };
  return facebookUserData;
};
/**
 * @name getSocialUserData
 * @async
 * @param {Object} request express request object
 * @param {string} provider provider type of social media authenticator
 * @returns {Object} userData  with details of new user
 */
const getSocialUserData = (request, provider) => {
  let userData;
  switch (provider) {
  case 'facebook': {
    userData = facebookData(request);
    break;
  }
  default:
    userData = null;
  }
  return userData;
};
export default getSocialUserData;
