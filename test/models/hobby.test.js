import { expect } from 'chai';
import models from '../../server/database/models';

const { Hobby } = models;

describe('Test Hobby model validations', () => {
  const validHobbyInfo = { name: 'random hobby' };

  context('when hobby name is not provided', () => {
    it('returns a validation error', async () => {
      const invalidHobbyInfo = { ...validHobbyInfo };
      delete invalidHobbyInfo.name;

      try {
        await Hobby.create(invalidHobbyInfo);
      } catch (error) {
        expect(error.message).to.equal(
          'notNull Violation: Hobby.name cannot be null'
        );
      }
    });
  });
});
