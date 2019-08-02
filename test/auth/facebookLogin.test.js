import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import nock from 'nock';
import Passport from '../../server/helpers/passport';
import PassportError from '../../server/middlewares/passportError';
import getSocialUserData from '../../server/helpers/getSocialUserData';
import Auth from '../../server/controllers/Auth';
import models from '../../server/database/models/index';
import { request, users } from './__mocks_';

const { expect } = chai;
chai.use(chaiHttp);
let sinons;
const { User, Session } = models;
describe('facebook login test', () => {
  before(() => {
    sinons = sinon.stub(User, 'findOne').returns(false);
  });

  after(() => {
    sinons.restore();
  });

  it('it should test route nock off the http request to fb', async (done) => {
    nock('https://wwww.facebook.com')
      .get('/api/v1/auth/facebook/callback')
      .reply(200, {
        hello: 'facebook'
      });
    done();
  });

  it('it mocks passport app', async () => {
    const app = { use() {} };
    await Passport(app);
  });
  it('it mock passport Error check on pass', async () => {
    const res = { status() {}, json() {} };
    const status = sinon.stub(res, 'status').returnsThis();
    const json = sinon.stub(res, 'json').returnsThis();
    const Callbackrequest = sinon.stub();
    const Callbacknext = sinon.stub();
    PassportError.passportErrors(true, Callbackrequest, res, Callbacknext);
    sinon.assert.calledOnce(status);
    sinon.assert.calledOnce(json);
  });

  it('it mock passport Error check on pass', async () => {
    const res = { status() {}, json() {} };
    const status = sinon.stub(res, 'status').returnsThis();
    const json = sinon.stub(res, 'json').returnsThis();
    const Callbackrequest = sinon.stub();
    const Callbacknext = sinon.stub();
    PassportError.passportErrors(true, Callbackrequest, res, Callbacknext);
    sinon.assert.calledOnce(status);
    sinon.assert.calledOnce(json);
  });

  it('it mock passport Error check on fail', async () => {
    const Callbacknext = sinon.stub();
    const Callbackrequest = sinon.stub();
    const res = { status() {}, json() {} };
    const status = sinon.stub(res, 'status').returnsThis();
    const json = sinon.stub(res, 'json').returnsThis();
    getSocialUserData(null, '');
    PassportError.passportErrors(false, Callbackrequest, res, Callbacknext);
    sinon.assert.calledOnce(Callbacknext);
    sinon.assert.calledOnce(status);
    sinon.assert.calledOnce(json);
  });

  it('it facebookLoginController', async () => {
    const res = { status() {}, json() {} };
    const status = sinon.stub(res, 'status').returnsThis();
    const json = sinon.stub(res, 'json').returnsThis();
    const Sessions = sinon.stub(Session, 'create').returns(false);
    const findOrCreate = sinon.stub(User, 'findOrCreate').returns(users);
    await Auth.facebookSocialLogin(request, res);
    sinon.assert.calledOnce(status);
    sinon.assert.calledOnce(json);
    Sessions.restore();
    findOrCreate.restore();
  });
});
