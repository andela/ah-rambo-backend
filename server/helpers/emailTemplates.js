import { config } from 'dotenv';
import sendEmail from './emailModule';

config();

const { SERVER_URL, BASE_URL } = process.env;

/**
 * @name sendVerificationEmail
 * @param {Object} data object with user details
 * @returns {Function} function that sends verification email to users
 */
const sendVerificationEmail = (data) => {
  const { firstName, email, token } = data;
  const content = `
<body style="background-color: white; font-family: Montserrat; color: #2B2B2B">
<h1>Authors <span style="color: #D7B914">Haven</span></h1>
<div style="font-size: 16px;">
<div>
<p>Hi ${firstName},</p>
<p>Welcome to Authors Haven. Your amazing journey has started!</p>
<p>To continue enjoying the amazing benefits of your account,
please verify your email.</p>
<p>By clicking on the button below, 
you are confirming that this is your email address.</p>
<p style="margin: 20px; text-align: center">
<a style="text-decoration:none; background-color: #505050;
padding:15px; color:white"
href=${SERVER_URL}${BASE_URL}/users/verifyEmail/${token}>
Verify Email
</a>
</p>
</div>
<p style="margin-bottom: 15px">Remember to update 
your story preferences so we can serve you with a customized experience.</p>
<div>
<p style="margin-top: 20px">The Authors Haven Team.</p>
<p style="margin-top: 10px; color: #D7B914">© 2019 AUTHORS HAVEN</p>
</div>
</div>
</body>
`;
  return sendEmail(email, 'Verify Email', content);
};

export default sendVerificationEmail;
