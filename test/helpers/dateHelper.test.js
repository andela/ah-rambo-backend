import chai, { expect } from 'chai';
import helpers from '../../server/helpers';

const { expiryDate } = helpers;

describe('Find User Test', () => {
  it('find user by id', async () => {
    const date = await expiryDate('browser');
    expect(date).to.be.a('date');
  });
  it('find user by id', async () => {
    const date = await expiryDate('mobile');
    expect(date).to.be.a('date');
  });
});

export default chai;
