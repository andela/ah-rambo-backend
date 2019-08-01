/* eslint-disable max-len */
import chai from 'chai';
import sinon from 'sinon';
import validateUserSignup from '../../server/middlewares/userValidation';

const { expect } = chai;

// ExpressJs req, res, and next mocks
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

describe('User Signup Validation', () => {
  const validUserSignupData = {
    firstName: 'Authors',
    lastName: 'Haven',
    userName: 'authorshaven',
    email: 'sample.email@authorshaven.com',
    password: 'sample.email@authorshaven.com',
    confirmPassword: 'sample.email@authorshaven.com'
  };

  it('should return error if any field value is not a string', () => {
    const invalidUserData = { ...validUserSignupData };
    invalidUserData.firstName = 123;

    req.body = invalidUserData;
    validateUserSignup(req, res, next);

    expect(res.statusCode).to.equal(422);
    expect(res.body).to.haveOwnProperty('errors');
    expect(res.body.errors).to.haveOwnProperty('firstName');
    expect(res.body.errors.firstName).to.match(
      /first name should be a string/i
    );
  });

  it('should return error if passwords do not match', () => {
    const invalidUserData = { ...validUserSignupData };
    invalidUserData.confirmPassword = 'qwertyui';

    req.body = invalidUserData;
    validateUserSignup(req, res, next);

    expect(res.statusCode).to.equal(422);
    expect(res.body).to.haveOwnProperty('errors');
    expect(res.body.errors).to.haveOwnProperty('confirmPassword');
    expect(res.body.errors.confirmPassword).to.match(
      /confirm password must match password/i
    );
  });

  it('should call the next function if all fields are valid', () => {
    const validUserData = { ...validUserSignupData };

    req.body = validUserData;
    validateUserSignup(req, res, next);

    expect(next.called).to.equal(true);
  });

  describe('First Name Field Validation', () => {
    it('should return an error if first name is missing', async () => {
      const invalidUserData = { ...validUserSignupData };
      delete invalidUserData.firstName;

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('firstName');
      expect(res.body.errors.firstName).to.match(/first name is required/i);
    });

    it('should return an error if first name is less than 2 characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.firstName = 'a';

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('firstName');
      expect(res.body.errors.firstName).to.match(
        /first name should not be less than 2 characters/i
      );
    });

    it('should return an error if first name is more than 50 characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.firstName = new Array(55).join('a');

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('firstName');
      expect(res.body.errors.firstName).to.match(
        /first name should not be more than 50 characters/i
      );
    });
  });

  describe('Last Name Field Validation', () => {
    it('should return an error if last name is missing', async () => {
      const invalidUserData = { ...validUserSignupData };
      delete invalidUserData.lastName;

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('lastName');
      expect(res.body.errors.lastName).to.match(/last name is required/i);
    });

    it('should return an error if last name is less than 2 characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.lastName = 'a';

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('lastName');
      expect(res.body.errors.lastName).to.match(
        /last name should not be less than 2 characters/i
      );
    });

    it('should return an error if last name is more than 50 characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.lastName = new Array(60).join('a');

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('lastName');
      expect(res.body.errors.lastName).to.match(
        /last name should not be more than 50 characters/i
      );
    });
  });

  describe('Username Field Validation', () => {
    it('should return an error if username is missing', async () => {
      const invalidUserData = { ...validUserSignupData };
      delete invalidUserData.userName;

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('userName');
      expect(res.body.errors.userName).to.match(/Username is required/i);
    });

    it('should return an error if username is less than 6 characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.userName = new Array(6).join('a');

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('userName');
      expect(res.body.errors.userName).to.match(
        /username should not be less than 6 characters/i
      );
    });

    it('should return an error if username is more than 15 characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.userName = new Array(20).join('a');

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('userName');
      expect(res.body.errors.userName).to.match(
        /username should not be more than 15 characters/i
      );
    });

    it('should return an error if username contains special characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.userName = 'aa@#rrrrr';

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('userName');
      expect(res.body.errors.userName).to.match(
        /username should contain only letters and numbers/i
      );
    });
  });

  describe('Email Field Validation', () => {
    it('should return an error if email is missing', async () => {
      const invalidUserData = { ...validUserSignupData };
      delete invalidUserData.email;

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('email');
      expect(res.body.errors.email).to.match(/Email is required/i);
    });

    it('should return an error if email is invalid', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.email = 'aaa';

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('email');
      expect(res.body.errors.email).to.match(/Email is invalid/i);
    });
  });

  describe('Password Field Validation', () => {
    it('should return an error if password is missing', async () => {
      const invalidUserData = { ...validUserSignupData };
      delete invalidUserData.password;

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('password');
      expect(res.body.errors.password).to.match(/Password is required/i);
    });

    it('should return an error if password is less than 8 characters', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.password = new Array(8).join('a');

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('password');
      expect(res.body.errors.password).to.match(
        /Password should not be less than 8 characters/i
      );
    });

    it('should return an error if password contain spaces', async () => {
      const invalidUserData = { ...validUserSignupData };
      invalidUserData.password = 'aa aaa aaa';

      req.body = invalidUserData;
      validateUserSignup(req, res, next);

      expect(res.statusCode).to.equal(422);
      expect(res.body).to.haveOwnProperty('errors');
      expect(res.body.errors).to.haveOwnProperty('password');
      expect(res.body.errors.password).to.match(
        /Password should not contain spaces/i
      );
    });
  });
});

export default chai;
