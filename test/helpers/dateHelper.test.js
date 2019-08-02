import { expect } from 'chai';
import { expiryDate } from '../../server/helpers';

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
