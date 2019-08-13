import { expect } from 'chai';
import models from '../../server/database/models';

const { ResetPassword } = models;

describe('Reset Token Model Validations', () => {
  let resetToken;
  let userId;
  context('when token is not provided', () => {
    it('returns a validation error', async () => {
      try {
        await ResetPassword.create({ token: resetToken, userId: 90 });
      } catch (error) {
        expect(error.message).to.equal(
          'notNull Violation: ResetPassword.token cannot be null'
        );
      }
    });
  });

  context('when userId is not provided', () => {
    it('returns a validation error', async () => {
      try {
        await ResetPassword.create({ token: 'resetToken', userId });
      } catch (error) {
        expect(error.message).to.equal(
          'notNull Violation: ResetPassword.userId cannot be null'
        );
      }
    });
  });
});
