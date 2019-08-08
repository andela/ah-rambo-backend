import { expect } from 'chai';
import models from '../../server/database/models';
import { getNewUserWithProfile } from '../users/__mocks__/index';

const { User } = models;

describe('Test User model validations', () => {
  let user;
  let userEmail;
  let userUsername;
  let userId;
  let newUser;
  context('when email is invalid', () => {
    it('returns a validation error', async () => {
      user = getNewUserWithProfile();
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
      const invalidEmailUser = getNewUserWithProfile();
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
      const invalidUser = getNewUserWithProfile();
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
      const invalidUser = getNewUserWithProfile();
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
      const invalidUser = getNewUserWithProfile();
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
      const invalidUser = getNewUserWithProfile();
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
      const invalidUser = getNewUserWithProfile();
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

  context('when avatar URL format is not valid', () => {
    it('returns an validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.avatarUrl = 'invalidUrl';

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'avatar url format is invalid'
        );
      }
    });
  });

  context('when user bio is more than 160 characters long', () => {
    it('returns a validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.bio = new Array(170).join('a');

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'user bio must not be more than 160 characters'
        );
      }
    });
  });

  context('when user followings count is not an integer', () => {
    it('returns a validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.followingsCount = 'notInteger';

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'user followings count must be an integer'
        );
      }
    });
  });

  context('when user followings count is less than 0', () => {
    it('returns a validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.followingsCount = -1;

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'user followings count must not be less than 0'
        );
      }
    });
  });

  context('when user followers count is not an integer', () => {
    it('returns a validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.followersCount = 'notInteger';

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'user followers count must be an integer'
        );
      }
    });
  });

  context('when user followers count is less than 0', () => {
    it('returns a validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.followersCount = -1;

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'user followers count must not be less than 0'
        );
      }
    });
  });

  context('when user is not identified by either fullname or username', () => {
    it('returns a validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.identifiedBy = 'email';

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'user must only be identified by either fullname or username'
        );
      }
    });
  });

  context('when user occupation does not contains letters only', () => {
    it('returns a validation error', async () => {
      const invalidUserInfo = getNewUserWithProfile();
      invalidUserInfo.occupation = 'Engineer 1';

      try {
        await User.create(invalidUserInfo);
      } catch (error) {
        expect(error.errors[0].type).to.equal('Validation error');
        expect(error.errors[0].message).to.equal(
          'user occupation must contain only letters and/or spaces'
        );
      }
    });
  });
});
