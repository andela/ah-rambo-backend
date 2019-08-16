import { expect } from 'chai';
import Tags from '../../server/controllers/Tags';

describe('Create Tag Test', () => {
  context('when an array of new tags is passed in', () => {
    it('creates new tags', async () => {
      const newTags = await Tags.create('Rice-Hockey');
      expect(newTags).to.be.an('array');
      expect(newTags[0]).to.be.an('object');
      expect(newTags[0].name).to.equal('rice-hockey');
    });
  });

  context('when a string of existing tag is passed in', () => {
    it("doesn't create new tags", async () => {
      const existingTags = await Tags.create('FOOTBALL');
      expect(existingTags).to.be.an('array');
      expect(existingTags[0]).to.be.an('object');
      expect(existingTags[0].id).to.equal(1);
    });
  });

  context('when an a letter tag is passed in', () => {
    it('throws error', async () => {
      const existingTags = await Tags.create('F');
      expect(existingTags).to.equal(false);
    });
  });

  context('when an empty array is passed in', () => {
    it('returns null', async () => {
      const emptyArrayTag = await Tags.create('');
      expect(emptyArrayTag).to.not.be.an('array');
      expect(emptyArrayTag).to.equal(null);
    });
  });

  context('when nothing is passed in', () => {
    it('returns null', async () => {
      const nullTags = await Tags.create();
      expect(nullTags).to.not.be.an('array');
      expect(nullTags).to.equal(null);
    });
  });
});
