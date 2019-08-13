import { expect } from 'chai';
import models from '../../server/database/models';
import { ArticleData } from '../articles/__mocks__';

const { Article } = models;

describe('Article Model Test', () => {
  const noTitle = { ...ArticleData };
  delete noTitle.title;
  context('when title of article is not provided', () => {
    it('throws an error', async () => {
      try {
        await Article.create({ ...noTitle });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'Article.title cannot be null'
        );
      }
    });
  });
  context('when a title is less than 2', () => {
    const title = { title: 'a' };
    it('throws an error', async () => {
      try {
        await Article.create({ ...noTitle, ...title });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'title must be strings between 2 and 250 chars long'
        );
      }
    });
  });
  context('when description is supplied', () => {
    it('creates an article', async () => {
      const response = await Article.create({ ...ArticleData });
      expect(response.description).to.equal(ArticleData.description);
    });
  });

  context('when image is not a valid url ', () => {
    const badImage = { ...ArticleData };
    badImage.image = 'this is TIA';
    it('does not creates an article', async () => {
      try {
        await Article.create({ ...badImage });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'image must be a valid url path'
        );
      }
    });
  });

  context('when likes is a negative number', () => {
    const badlikes = { ...ArticleData };
    badlikes.likesCount = -1;
    it('throws an error', async () => {
      try {
        await Article.create({ ...badlikes });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'articles likes count must not be less than 0'
        );
      }
    });
  });

  context('when dislikes is a negative number', () => {
    const badlikes = { ...ArticleData };
    badlikes.dislikesCount = -1;
    it('throws an error', async () => {
      try {
        await Article.create({ ...badlikes });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'articles dislike count must not be less than 0'
        );
      }
    });
  });
});
