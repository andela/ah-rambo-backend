import chai from 'chai';
import sinon from 'sinon';
import middlewares from '../../server/middlewares';

const { validateCommentBody } = middlewares;

const { expect } = chai;

const next = sinon.stub();
const req = {};
const res = {
  body: null,
  statusCode: null,
  send(data) {
    this.body = data;
    return data;
  },
  json(data) {
    this.body = data;
    return data;
  },
  status(responseStatus) {
    this.statusCode = responseStatus;
    return this;
  }
};

describe('Comment Body Validation Middleware', () => {
  context('when user enters valid characters in the comment body', () => {
    it('returns next to go to the next middleware', () => {
      req.body = { comment: new Array(2499).join('a ') };
      validateCommentBody(req, res, next);
      expect(next.called).to.equal(true);
    });
  });

  context('when user leaves the comment body empty', () => {
    it('returns an error on number of characters allowed', () => {
      req.body = { comment: '' };
      validateCommentBody(req, res, next);
      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('comment');
      expect(res.body.errors.comment).to.deep.equal(
        'comment should not be less than 2 characters'
      );
    });
  });

  context('when required field is not provided', () => {
    it('returns an error', () => {
      req.body = { wrongField: '' };
      validateCommentBody(req, res, next);
      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('comment');
      expect(res.body.errors.comment).to.deep.equal('comment is required');
    });
  });

  context('when comment body contains more than 5000 characters', () => {
    it('returns an error', () => {
      req.body = { comment: new Array(5003).join('a') };
      validateCommentBody(req, res, next);
      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('comment');
      expect(res.body.errors.comment).to.deep.equal(
        'comment should not be more than 5000 characters'
      );
    });
  });
});
