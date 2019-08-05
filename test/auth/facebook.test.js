import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import nock from 'nock';
import passport from 'passport';
import Passport from '../../server/helpers/passport';
import PassportError from '../../server/middlewares/passportError';
import getSocialUserData from '../../server/helpers/getSocialUserData';
import facebook from '../../server/helpers/facebook';
import Auth from '../../server/controllers/Auth';
import models from '../../server/database/models/index';
import { request, users, mockrequest } from './__mocks_';

const { expect } = chai;
chai.use(chaiHttp);
let sinons;
const { User, Session } = models;
let serialize, deserialize;
describe('facebook login test', () => {
  before(() => {
    sinons = sinon.stub(User, 'findOne').returns(false);
    serialize = sinon.stub(passport, 'serializeUser').yields({}, () => {});
    deserialize = sinon.stub(passport, 'deserializeUser').yields({}, () => {});
  });

  after(() => {
    sinons.restore();
    deserialize.restore();
    serialize.restore();
  });

  it('nock off the http request to facebook', async () => {
    nock('https://wwww.facebook.com')
      .get('/api/v1/auth/facebook/callback')
      .reply(200, {
        hello: 'facebook'
      });
  });

  it('mocks passport app', async () => {
    const app = { use() {} };
    await Passport(app);
  });
  it('mock passport Error check on pass', async () => {
    const res = { status() {}, json() {} };
    const status = sinon.stub(res, 'status').returnsThis();
    const json = sinon.stub(res, 'json').returnsThis();
    const Callbackrequest = sinon.stub();
    const Callbacknext = sinon.stub();
    PassportError.passportErrors(true, Callbackrequest, res, Callbacknext);
    sinon.assert.calledOnce(status);
    sinon.assert.calledOnce(json);
  });
  it('mock passport Error check on fail', async () => {
    const Callbacknext = sinon.stub();
    const Callbackrequest = sinon.stub();
    const res = { status() {}, json() {} };
    const status = sinon.stub(res, 'status').returnsThis();
    const json = sinon.stub(res, 'json').returnsThis();
    getSocialUserData(mockrequest);
    PassportError.passportErrors(false, Callbackrequest, res, Callbacknext);
    sinon.assert.calledOnce(Callbacknext);
    sinon.assert.calledOnce(status);
    sinon.assert.calledOnce(json);
  });
  it('register a new user sucessfully', async () => {
    const res = { status() {}, json() {} };
    const status = sinon.stub(res, 'status').returnsThis();
    const json = sinon.stub(res, 'json').returnsThis();
    const Sessions = sinon.stub(Session, 'create').returns(false);
    const findOrCreate = sinon.stub(User, 'findOrCreate').returns(users);
    await Auth.socialLogin(request, res);
    sinon.assert.calledOnce(status);
    sinon.assert.calledOnce(json);
    Sessions.restore();
    findOrCreate.restore();
  });

  it('logs in user sucessfully', async () => {
    const response = facebook();
    expect(response).to.equal(undefined);
  });
});
