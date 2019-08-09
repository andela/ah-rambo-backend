import sendGrid from '@sendgrid/mail';
import { config } from 'dotenv';

config();

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @name sendEmail
 * @async
 * @description function for sending emails to users
 * @param {String} receiver email of recipient
 * @param {String} subject subject of email to be sent
 * @param {String} content text to be sent to user
 * @returns {Boolean} true for successful email sending or error on failure
 */
const sendEmail = async (receiver, subject, content) => {
  const data = {
    to: receiver,
    from: 'Authors Haven <authorshaven-help@authorshaven.com',
    subject,
    html: content
  };

  try {
    return sendGrid.send(data);
  } catch (error) {
    return error;
  }
};

export default sendEmail;
