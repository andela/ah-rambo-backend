import { expect } from 'chai';
import Tags from '../../server/controllers/Tags';

describe('Associate Article Test', async () => {
  const tags = await Tags.create('adc,abc');
  context('when an array of tags and an article id is passed in', () => {
    it('associates article with tags', async () => {
      const newArticleTags = await Tags.associateArticle(1, tags);
      expect(newArticleTags).to.be.an('array');
      expect(newArticleTags[0]).to.be.a('string');
    });
  });

  context('when no value is passed in', () => {
    it('returns false', async () => {
      const newArticleTags = await Tags.associateArticle();
      expect(newArticleTags).to.equal(false);
    });
  });

  context('when one value is passed in', () => {
    it('returns false', async () => {
      const newArticleTags = await Tags.associateArticle(1);
      expect(newArticleTags).to.equal(false);
    });
  });
});
