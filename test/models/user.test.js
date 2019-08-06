import { expect } from 'chai';
import models from '../../server/database/models';
import getUser from '../users/__mocks__/index';

const { User } = models;

describe('Test User model validations', () => {
  let user;
  let userEmail;
  let userUsername;
  let userId;
  let newUser;
  context('when email is invalid', () => {
    it('returns a validation error', async () => {
      user = getUser();
      userEmail = user.email;
      userUsername = user.userName;
      try {
        await User.create({
          ...user,
          email: 'mail.com'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'email address provided be a valid'
        );
      }
    });
  });

  context('when email is not provided', () => {
    it('returns a validation error', async () => {
      const invalidEmailUser = getUser();
      delete invalidEmailUser.email;
      try {
        await User.create(invalidEmailUser);
      } catch (error) {
        expect(error.message).to.equal(
          'notNull Violation: User.email cannot be null'
        );
      }
    });
  });

  context('when password is not long enough', () => {
    it('returns a validation error', async () => {
      const invalidUser = getUser();
      delete invalidUser.password;
      try {
        await User.create({
          ...invalidUser,
          password: 'what'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'Password must be between 8 and 254 chars long'
        );
      }
    });
  });

  context('when username is not provided', () => {
    it('returns a validation error', async () => {
      const invalidUser = getUser();
      delete invalidUser.userName;
      try {
        await User.create(invalidUser);
      } catch (error) {
        expect(error.message).to.equal(
          'notNull Violation: User.userName cannot be null'
        );
      }
    });
  });

  context('when username is not an alphanumeric character', () => {
    it('returns a validation error', async () => {
      const invalidUser = getUser();
      delete invalidUser.userName;
      try {
        await User.create({
          ...invalidUser,
          userName: 'rihanna.afolabi'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'username must be alphanumeric'
        );
      }
    });
  });

  context('when username is too long', () => {
    it('returns a validation error', async () => {
      const invalidUser = getUser();
      delete invalidUser.userName;
      try {
        await User.create({
          ...invalidUser,
          userName: 'rihannaAfolabiBeyonceAdeyemo'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'username must be between 6 and 15 chars long'
        );
      }
    });
  });

  context('when firstname or lastname is too short', () => {
    it('returns a validation error', async () => {
      const invalidUser = getUser();
      try {
        await User.create({
          ...invalidUser,
          firstName: 'r',
          lastName: 'j'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'names must be strings between 2 and 50 chars long'
        );
      }
    });
  });

  context('when the custom finder functions are called', () => {
    it('returns the user with the email', async () => {
      newUser = await User.create({
        ...user
      });
      userId = newUser.id;
      const client = await User.findByEmail(userEmail);
      expect(client.email).to.equal(newUser.email);
    });

    it('returns the user with the username', async () => {
      const client = await User.findByUsername(userUsername);
      expect(client.userName).to.equal(newUser.userName);
    });

    it('returns the user with the id provided', async () => {
      const client = await User.findById(userId);
      expect(client.dataValues.id).to.equal(newUser.id);
    });
  });
});
