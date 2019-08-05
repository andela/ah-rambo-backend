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
  }
};
describe('google login test', () => {
  it('logs in such user successfully', async () => {
    const Sessions = sinon.stub(Session, 'create').returns(false);
    const findOrCreate = sinon.stub(User, 'findOrCreate').returns(users);
    await Auth.socialLogin(request2, res);
    expect(res.statusCode).to.equals(200);
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
