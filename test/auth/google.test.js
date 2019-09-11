import chai from 'chai';
import sinon from 'sinon';
import google from '../../server/helpers/google';
import Auth from '../../server/controllers/Auth';
import models from '../../server/database/models/index';
import PassportError from '../../server/middlewares/passportError';
import { request2, users } from './__mocks_';

const { expect } = chai;
const { User, Session } = models;
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
  },
  redirect(url) {
    this.statusCode = url;
    return this;
  }
};
describe('google login test', () => {
  it('logs in such user successfully', async () => {
    const Sessions = sinon.stub(Session, 'create').returns(false);
    const findOrCreate = sinon.stub(User, 'findOrCreate').returns(users);
    const redirect = sinon.stub(res, 'redirect').returnsThis();
    await Auth.socialLogin(request2, res);
    sinon.assert.calledOnce(redirect);
    expect(res.statusCode).to.equals(301);
    Sessions.restore();
    findOrCreate.restore();
  });
  it('logs in the user successfully', async () => {
    const response = google();
    expect(response).to.equal(undefined);
  });

  it('returns an error message on fail', () => {
    const Callbacknext = sinon.stub();
    PassportError.passportErrors(true, req, res, Callbacknext);
    expect(res.body.message).to.equals('Auth failed');
    expect(res.statusCode).to.equals(400);
  });
});
