import { expect } from 'chai';
import models from '../../server/database/models';

const { Tag } = models;

describe('Tag Model Test', () => {
  context('when name is invalid', () => {
    it('returns an error', async () => {
      try {
        await Tag.create({
          name: ''
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'tag name should be greater than one character'
        );
      }
    });
  });

  context('when name is one character', () => {
    it('returns an error', async () => {
      try {
        await Tag.create({
          name: 'a'
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'tag name should be greater than one character'
        );
      }
    });
  });

  context('when name is not given', () => {
    it('returns an error', async () => {
      try {
        await Tag.create({});
      } catch (error) {
        expect(error.errors[0].message).to.equal('Tag.name cannot be null');
      }
    });
  });
});
