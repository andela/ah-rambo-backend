import faker from 'faker';
import { generateToken } from '../../../server/helpers';

const mobileDeviceIndicator = [
  'mobile',
  'android',
  'iphone',
  'tablet',
  'ipad',
  'ipod'
];

/**
 * @name generateSessionData
 * @param {integer} userId
 * @returns {Object} details of a user to be signed up
 */
const generateSessionData = (userId) => {
  const userAgent = faker.internet.userAgent();
  const devicePlatform = mobileDeviceIndicator.some(device => userAgent.toLowerCase().includes(device))
    ? 'mobile'
    : 'browser';
  const sessionDetails = {
    userId,
    active: faker.random.boolean(),
    devicePlatform,
    expiresAt: faker.date.recent(),
    ipAddress: faker.internet.ipv6(),
    token: generateToken({ id: userId }),
    userAgent
  };
  return sessionDetails;
};

export default generateSessionData;
