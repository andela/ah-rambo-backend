import { expect } from 'chai';
import models from '../../server/database/models';

const { Comment } = models;

describe('Test - Comment Model validations', () => {
  let comment;
  let articleId;
  let userId;

  context('when comment body is empty', () => {
    it('returns a validation error', async () => {
      comment = '';
      articleId = 55;
      userId = 566;
      try {
        await Comment.create({
          comment,
          articleId,
          userId
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'comment must be text between 2 and 5000 chars long'
        );
      }
    });
  });

  context('when articleId is an string', () => {
    it('returns a validation error', async () => {
      comment = 'the is a testy';
      articleId = 'udhgdhgdgh';
      userId = 566;
      try {
        await Comment.create({
          comment,
          articleId,
          userId
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'articleId must be an integer'
        );
      }
    });
  });

  context('when userId is a string', () => {
    it('returns a validation error', async () => {
      comment = 'Another test';
      articleId = 55;
      userId = '667uuiuu';
      try {
        await Comment.create({
          comment,
          articleId,
          userId
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal('userId must be an integer');
      }
    });
  });

  context('when comment is null', () => {
    it('returns a validation error', async () => {
      articleId = 55;
      userId = 33;
      try {
        await Comment.create({
          articleId,
          userId
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'Comment.comment cannot be null'
        );
      }
    });
  });

  context('when articleId is null', () => {
    it('returns a validation error', async () => {
      comment = 'the is a testy';
      userId = 566;
      try {
        await Comment.create({
          comment,
          userId
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'Comment.articleId cannot be null'
        );
      }
    });
  });

  context('when userId is null', () => {
    it('returns a validation error', async () => {
      comment = 'Another test';
      articleId = 55;
      try {
        await Comment.create({
          comment,
          articleId
        });
      } catch (error) {
        expect(error.errors[0].message).to.equal(
          'Comment.userId cannot be null'
        );
      }
    });
  });
});
