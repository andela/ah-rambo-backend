import chai, { expect } from 'chai';
import models from '../../server/database/models';

const { Sessions } = models;

describe('Session Model', () => {
  it('Successfully insert into session database', async () => {
    const session = await Sessions.create({
      userId: 1,
      active: true,
      devicePlatform: 'browser',
      expiresAt: new Date('2020-10-10'),
      ipAddress: '121.234.188.49',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      userAgent:
        'Mozilla/5.0 (Linux; Android 7.0; SM-G892A Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/60.0.3112.107 Mobile Safari/537.36'
    });
    expect(session).to.be.an('object');
  });
});

export default chai;
