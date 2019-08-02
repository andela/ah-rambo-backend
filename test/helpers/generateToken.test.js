import chai from 'chai';
import models from '../../server/database/models';
import { generateToken } from '../../server/helpers';
import mocks from './__mocks__';

const { expect } = chai;
const { body } = mocks;
const { Sessions } = models;

describe('Test generateToken function', () => {
  it('should return a token', () => {
    const payload = { id: 1 };
    const token = generateToken(payload);
    expect(token).to.be.a('string');
  });

  it('should return a token', async () => {
    const payload = { id: 1 };
    const token = generateToken(payload);
    const session = await Sessions.create({
      ...body,
      token
    });
    expect(session.token).to.equal(token);
  });
});
