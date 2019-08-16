/* eslint-disable max-len */
import chai from 'chai';
import sinon from 'sinon';
import validateProfileEdit from '../../server/middlewares/createCategoryValidation';
import { sampleCategory } from '../users/__mocks__';

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

describe('Create Category Validation Middleware', () => {
  const validCategory = sampleCategory();

  context('when the name is not given', () => {
    it('returns a status code 422 and an error message', () => {
      const invalidCategory = { ...validCategory };
      delete invalidCategory.name;

      req.body = invalidCategory;
      validateProfileEdit(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('name');
      expect(res.body.errors.name).to.match(/category name is required/i);
    });
  });

  context('when the name is invalid', () => {
    it('returns a status code 422 and an error message', () => {
      const invalidCategory = { ...validCategory };
      invalidCategory.name = '///';

      req.body = invalidCategory;
      validateProfileEdit(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('name');
      expect(res.body.errors.name).to.match(/category name is invalid/i);
    });
  });

  context('when the description is invalid', () => {
    it('returns a status code 422 and an error message', () => {
      const invalidCategory = { ...validCategory };
      invalidCategory.description = '///';

      req.body = invalidCategory;
      validateProfileEdit(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('description');
      expect(res.body.errors.description).to.match(
        /category description is invalid/i
      );
    });
  });

  context('when the name is invalid', () => {
    it('returns a status code 422 and an error message', () => {
      const invalidCategory = { ...validCategory };
      invalidCategory.name = '';

      req.body = invalidCategory;
      validateProfileEdit(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('name');
      expect(res.body.errors.name).to.match(/category name is invalid/i);
    });
  });

  context('when the description is invalid', () => {
    it('returns a status code 422 and an error message', () => {
      const invalidCategory = { ...validCategory };
      invalidCategory.description = '';

      req.body = invalidCategory;
      validateProfileEdit(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('description');
      expect(res.body.errors.description).to.match(
        /category description is invalid/i
      );
    });
  });
});
