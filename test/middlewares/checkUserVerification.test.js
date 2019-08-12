import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { getNewUser } from '../users/__mocks__';
import app from '../../server';
import middlewares from '../../server/middlewares';
import models from '../../server/database/models';

const { checkUserVerification } = middlewares;

chai.use(chaiHttp);

const { BASE_URL } = process.env;

const { User } = models;

describe("Check User's Email Verification", () => {
  let newUser;
  before(async () => {
    const user = getNewUser();
    const createdUser = await chai
      .request(app)
      .post(`${BASE_URL}/users/create`)
      .send({ ...user, confirmPassword: user.password });
    newUser = createdUser.body.user;
  });
  context('when any user makes a request before validity expiry', () => {
    it('calls the next middleware', async () => {
      const request = { headers: {}, user: newUser };
      const response = { status() {}, json() {} };
      const next = sinon.spy();
      sinon.stub(response, 'status').returnsThis();
      sinon.stub(response, 'json').returns({});
      await checkUserVerification(request, response, next);
    });
  });

  context('when an unverified user makes a request after expiry', () => {
    it('returns an error', async () => {
      newUser.createdAt = new Date(Date.now() - 25 * 3600000);
      const request = { headers: {}, user: newUser };
      const response = { status() {}, json() {} };
      const next = sinon.spy();
      const status = sinon.stub(response, 'status').returnsThis();
      sinon.stub(response, 'json').returns({});
      await checkUserVerification(request, response, next);
      expect(status).to.calledWith(403);
    });
  });

  context('when a verified user makes a request before expiry', () => {
    it('calls the next middleware', async () => {
      newUser = {
        ...newUser,
        verified: true,
        createdAt: new Date(Date.now() - 2 * 3600000)
      };
      const request = { headers: {}, user: newUser };
      const response = { status() {}, json() {} };
      const next = sinon.spy();
      sinon.stub(response, 'status').returnsThis();
      sinon.stub(response, 'json').returns({});
      await checkUserVerification(request, response, next);
    });
  });

  context('when a verified user makes a request after expiry', () => {
    it('calls the next middleware', async () => {
      newUser.createdAt = new Date(Date.now() - 26 * 3600000);
      const request = { headers: {}, user: newUser };
      const response = { status() {}, json() {} };
      await User.update({ verified: true }, { where: { id: newUser.id } });
      const next = sinon.spy();
      sinon.stub(response, 'status').returnsThis();
      sinon.stub(response, 'json').returns({});
      await checkUserVerification(request, response, next);
    });
  });
});
