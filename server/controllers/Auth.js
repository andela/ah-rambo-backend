import { getUserAgent, createSocialUsers, getSocialUserData } from '../helpers';
/**
 * @export
 * @class Auth
 */
class Auth {
  /**
   * @name facebookSocialLogin
   * @async
   * @static
   * @memberof Auth
   * @param {Object} request express request object
   * @param {Object} response express response object
   * @returns {JSON} JSON object with details of new user
   */
  static async socialLogin(request, response) {
    const { devicePlatform, userAgent } = getUserAgent(request);
    const { ip } = request;
    const { givenName, familyName, email } = getSocialUserData(request);
    const data = {
      firstName: givenName,
      lastName: familyName,
      email,
      devicePlatform,
      userAgent,
      ipAddress: ip
    };
    const user = await createSocialUsers(data);
    delete user.password;
    response
      .status(301)
      .redirect(`${process.env.CLIENT_URL}?token=${user.token}&email=${email}`);
  }
}
export default Auth;
