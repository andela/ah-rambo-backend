import chai from 'chai';
import sinon from 'sinon';
import twitter from '../../server/helpers/twitter';
import Auth from '../../server/controllers/Auth';
import models from '../../server/database/models/index';
import PassportError from '../../server/middlewares/passportError';
import { request3, users } from './__mocks_';

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
describe('twitter login test', () => {
  context('when a user supplies valid credential to the twitter api', () => {
    it('logs in such user successfully', async () => {
      const Sessions = sinon.stub(Session, 'create').returns(false);
      const findOrCreate = sinon.stub(User, 'findOrCreate').returns(users);
      await Auth.socialLogin(request3, res);
      expect(res.statusCode).to.equals(200);
      Sessions.restore();
      findOrCreate.restore();
    });

    it('logs in the user successfully', async () => {
      const response = twitter();
      expect(response).to.equal(undefined);
    });
  });

  context(
    'when user does not supply valid credential to the twitter api',
    () => {
      it('returns an error message on fail', () => {
        const Callbacknext = sinon.stub();
        PassportError.passportErrors(true, req, res, Callbacknext);
        expect(res.body.message).to.equals('Auth failed');
        expect(res.statusCode).to.equals(400);
      });
    }
  );
});
