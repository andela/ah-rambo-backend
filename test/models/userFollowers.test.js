import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import models from '../../server/database/models';
import getNewUser from '../users/__mocks__';
import app from '../../server';

const { UserFollower } = models;

chai.use(chaiHttp);

let data;
const { BASE_URL } = process.env;
before(async () => {
  const user = getNewUser();
  const response = await chai
    .request(app)
    .post(`${BASE_URL}/users/create`)
    .send({ ...user, confirmPassword: user.password });
  data = response.body;
});

describe('User Followers model Test', () => {
  context('when userId is invalid', () => {
    it('returns a validation error', async () => {
      try {
        await UserFollower.create({
          userId: 'r',
          followerId: 1
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal('userId must be an integer');
      }
    });
  });

  context('when followerId is invalid', () => {
    it('returns a validation error', async () => {
      try {
        await UserFollower.create({
          userId: 1,
          followerId: 'r'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'followerId must be an integer'
        );
      }
    });
  });

  context('when userId is not provided', () => {
    it('returns a validation error', async () => {
      try {
        await UserFollower.create({ followerId: 1 });
      } catch (error) {
        expect(error.message).to.be.a('string');
      }
    });
  });

  context('when followerId is not provided', () => {
    it('returns a validation error', async () => {
      try {
        await UserFollower.create({ userId: 1 });
      } catch (error) {
        expect(error.message).to.be.a('string');
      }
    });
  });

  context('when the custom finder functions are called', () => {
    it('returns the user with the email', async () => {
      const user = { userId: 1, followerId: data.user.id };
      const newFollower = await UserFollower.create({
        ...user
      });
      const { userId } = newFollower;
      expect(user.userId).to.equal(userId);
    });
  });
});
