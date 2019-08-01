import chai, { expect } from 'chai';
import helpers from '../../server/helpers';

const { findUser } = helpers;

describe('Find User Test', () => {
  it('find user by id', async () => {
    const user = await findUser(1);
    expect(user).to.have.property('dataValues');
  });
});

export default chai;
