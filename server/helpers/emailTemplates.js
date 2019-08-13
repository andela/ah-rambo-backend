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

/**
 * @name sendResetPasswordEmail
 * @param {Object} data object with user details
 * @returns {Function} function that sends verification email to users
 */
const sendResetPasswordEmail = (data) => {
  const { firstName, email, token } = data;
  const content = `
  <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  
  <body style="margin: 0;padding: 0;font-family: Montserrat;font-style: normal;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="800" style="border-collapse: collapse;">
      <tr>
        <td>
          <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
          <div style="margin:0 2%">
  
            <div>
              <h1 style="font-weight: normal;font-size: 30px;line-height: 37px;color:#505050; margin-left:20px">Authors
                <span style="color: #D7B914">Haven</span></h1>
            </div>
            <div style="border: 0.5px solid rgba(0, 0, 0, 0.1);width:100%"></div>
            <div>
              <p style=" font-weight: 500; font-size: 22px; line-height: 30px; text-align:center;color:#505050">Forgot Your Password?
              </p>
              <div style="margin:0px 45px">
                <div>

                  
                      <p style="line-height: 26px;color:#505050">Hi ${firstName},</p>
                  <p style="line-height: 26px;color:#505050">There was a request to change your password.</p>
                  
                  
                  
                  
                  <p style="line-height: 26px;color:#505050">
                    If you did not make this request, just ignore this email. Otherwise, please click the button below to
                    change your password. <span style="color: #D7B914; font-weight: bold;color:#505050">This password reset is only
                      valid for the next 60 minutes.</span></p>
                </div>
                
   
  <!--   Button start -->
              <a style="text-decoration: none;" href=${SERVER_URL}${BASE_URL}/users/resetpassword/${token}><button style="background: #505050; color: #ffffff; width: 205px; height: 40px; display: block; margin:auto; margin-top:40px; decoration: none; font-size:14px"> Reset Password</button></a>
  <!--   Button end -->
  
    <div style="margin-top:50px">
     <p style="color:#505050">Thanks</p>
   <p style="color:#505050">Authors Haven Team</p></div>
              </div>
            </div>
            <div style="margin-top:40px; width: 100%; height: 60px; background: #505050;">
            <p style="padding-bottom:50px; margin: 30px 45px; color: #ffffff; font-size: 12px;">If you are having trouble with the above button, copy and paste the URL below into your browser.
        <a style="color:#D7B914" >${SERVER_URL}${BASE_URL}/users/resetpassword/${token}</a></p>
            </div>
  
  <!-- Footer --Start -->
          <div>
    <div class="column" style="float: left;width: 31%;margin: 20px 1.15%;height: 80px"><p style="font-size: 16px;color:#505050"> CONTACT US</p> <p >
    <a style="color:#D7B914;float:left">info@authorshaven.com></a></p></div>
    <div class="column" style="float: left;width: 31%;margin: 20px 1.15%;height: 80px"> <p style="text-align:center;color:#D7B914">© 2019 AUTHORS HAVEN</p></div>
    <div class="column" style="float: left;width: 31%;margin: 20px 1.15%;height: 80px"> <div style="float:right;color:#505050"><p>FOLLOW US</p>
      <div>
      
      <div style="float: right">
      <a href=""><img src="https://68ef2f69c7787d4078ac-7864ae55ba174c40683f10ab811d9167.ssl.cf1.rackcdn.com/facebook-icon_square_32x32.png" title="Facebook" alt="Facebook" style="width:25px; height:25px"></a>
        
        
      <a href=""><img src="https://68ef2f69c7787d4078ac-7864ae55ba174c40683f10ab811d9167.ssl.cf1.rackcdn.com/twitter-icon_square_24x24.png" style="width:25px; height:25px" title="Twitter" alt="Twitter"></a>
      
      <a href=""><img src="https://68ef2f69c7787d4078ac-7864ae55ba174c40683f10ab811d9167.ssl.cf1.rackcdn.com/instagram-icon_square_24x24.png" title="Instagram" alt="Instagram" style="margin:0px"></a>
      
      </div></div>
  </div>
  
  <!--           Footer --End -->
  
          </div>
        </div></div></td>
      </tr>
    </table>
  </body>
  
  </html>`;
  return sendEmail(email, 'Reset Password', content);
};

export default { sendVerificationEmail, sendResetPasswordEmail };
