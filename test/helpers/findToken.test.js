import chai from 'chai';
import { findToken } from '../../server/helpers';

const { expect } = chai;

describe('verify token middleware', () => {
  it('find token', async () => {
    const params = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    };
    const session = await findToken(params);
    expect(session).to.equal(undefined);
  });
});
