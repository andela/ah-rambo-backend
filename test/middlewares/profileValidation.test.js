/* eslint-disable max-len */
import chai from 'chai';
import sinon from 'sinon';
import validateProfileEdit from '../../server/middlewares/profileValidation';
import { getUserThatEditsProfile } from '../users/__mocks__';

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

describe('Profile Edit Validation Middleware', () => {
  const validUserData = getUserThatEditsProfile();

  context('when any of the inputs is not a string', () => {
    it('returns a status code 422 and an error message', () => {
      const invalidUserData = { ...validUserData };
      invalidUserData.lastName = 123;

      req.body = invalidUserData;
      validateProfileEdit(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('lastName');
      expect(res.body.errors.lastName).to.match(
        /last name should be a string/i
      );
    });
  });

  context('when all inputs are valid', () => {
    it('calls the next function', () => {
      const validUser = { ...validUserData };

      req.body = validUser;
      validateProfileEdit(req, res, next);

      expect(next.called).to.equal(true);
    });
  });

  describe('First Name Input Validation', () => {
    context('when first name is less than 2 characters', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.firstName = 'a';

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('firstName');
        expect(res.body.errors.firstName).to.match(
          /first name should not be less than 2 characters/i
        );
      });
    });

    context('when first name is more than 50 characters', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.firstName = new Array(55).join('a');

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('firstName');
        expect(res.body.errors.firstName).to.match(
          /first name should not be more than 50 characters/i
        );
      });
    });
  });

  describe('Last Name Input Validation', () => {
    context('when last name is less than 2 characters', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.lastName = 'a';

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('lastName');
        expect(res.body.errors.lastName).to.match(
          /last name should not be less than 2 characters/i
        );
      });
    });

    context('when last name is more than 50 characters long', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.lastName = new Array(52).join('a');

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('lastName');
        expect(res.body.errors.lastName).to.match(
          /last name should not be more than 50 characters/i
        );
      });
    });
  });

  describe('Username Input Validation', () => {
    context('when username is less than 6 characters long', () => {
      it('returns status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.userName = new Array(5).join('a');

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('userName');
        expect(res.body.errors.userName).to.match(
          /username should not be less than 6 characters/i
        );
      });
    });

    context('when username is more than 15 characters', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.userName = new Array(20).join('a');

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('userName');
        expect(res.body.errors.userName).to.match(
          /username should not be more than 15 characters/i
        );
      });
    });

    context('when username contains non-alphanumeric characters', () => {
      it('returns a status code 422 and an error message', async () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.userName = 'aa@#rrrrr';

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('userName');
        expect(res.body.errors.userName).to.match(
          /username should contain only letters and numbers/i
        );
      });
    });
  });

  describe('Email Input Validation', () => {
    context('when email is invalid', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.email = 'aaa';

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('email');
        expect(res.body.errors.email).to.match(/Email is invalid/i);
      });
    });
  });

  describe('User Avatar Validation', () => {
    context('when avatar url format is invalid', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.avatarUrl = 'qwerty';

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('avatarUrl');
        expect(res.body.errors.avatarUrl).to.match(
          /avatar url format is invalid/i
        );
      });
    });
  });

  describe('User bio Input Validation', () => {
    context('when bio is more than 160 characters long', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.bio = new Array(170).join('u');

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('bio');
        expect(res.body.errors.bio).to.match(
          /user bio should not be more than 160 characters/i
        );
      });
    });
  });

  describe('User alias Input Validation', () => {
    context('when alias is not either fullname or username', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.identifiedBy = 'first name';

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('identifiedBy');
        expect(res.body.errors.identifiedBy).to.match(
          /user must only be identified by either fullname or username/i
        );
      });
    });
  });

  describe('User Occupation Input Validation', () => {
    context('when occupation contains non-alphabetical characters', () => {
      it('returns a status code 422 and an error message', () => {
        const invalidUserData = { ...validUserData };
        invalidUserData.occupation = 'Engineer 1';

        req.body = invalidUserData;
        validateProfileEdit(req, res, next);

        expect(res.statusCode).to.equal(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('occupation');
        expect(res.body.errors.occupation).to.equal(
          'user occupation must contain only letters and/or spaces'
        );
      });
    });
  });
});
