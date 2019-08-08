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
  <html>
  <head>
  <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
  <style>
  body { font-family: Montserrat; font-style: normal; color: #505050} 
  .logo { font-weight: normal;font-size: 30px;line-height: 37px;color:#505050; margin-left:20px } .container { margin: 0 7% } .forget__password { font-weight: 500; font-size: 22px; line-height: 30px; text-align:center } button { background: #505050; color: #ffffff; width: 205px; height: 40px; display: block; margin:auto; margin-top:40px; decoration: none } button:focus {outline:0;} .near__foot { margin-top:40px; width: 100%; height: 56px; background: #505050; } .link__text { padding-bottom:50px; margin: 30px 45px; color: #ffffff; font-size: 12px; } .link__text span { color: #D7B914 } .footer { display: flex; justify-content: space-around; margin-top: 20px; margin-bottom:40px } .inner_body { color: #505050 }
  </style>
  </head>
  <body>
  
  <link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet'>
  <div class="container">
    
    <div><h1 class="logo">Authors <span style="color: #D7B914">Haven</span></h1></div>
    <div style="border: 0.5px solid rgba(0, 0, 0, 0.1);width:100%"></div>
      <div style="margin:0px 45px">
    <div class="inner__body"><p>Hi ${firstName},</p>
      <p>Welcome to Authors Haven. Your amazing journey has started!</p>
  
      <p style="line-height: 26px">
  <p>To continue enjoying the amazing benefits of your account,
  please verify your email.</p>
  <p>By clicking on the button below, 
  you are confirming that this is your email address.</p></div>
    <a style="text-decoration: none;" href=${SERVER_URL}${BASE_URL}/users/verifyEmail/${token}><button style="background: #505050; color: #ffffff; width: 205px; height: 40px; display: block; margin:auto; margin-top:40px; decoration: none; font-size:14px"> Verify Email</button></a>
  
      <p style="margin:30px 0px">
    The Authors Haven Team</p>
    </div>
       </div>
    <div class="near__foot">
      <p class="link__text">If you are having trouble with the above button, copy and paste the URL below into your browser.
        <a style="color:#D7B914" >${SERVER_URL}${BASE_URL}/users/verifyEmail/${token}></a></p>
    </div>
    
  <div style="border: 0.5px solid rgba(0, 0, 0, 0.1);width:100%"></div>
  
    <div class="footer">
    </div>
     
  </div>
  </body>
  </html>
`;
  return sendEmail(email, 'Verify Email', content);
};

export default sendVerificationEmail;
