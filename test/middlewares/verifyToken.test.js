import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import middlewares from '../../server/middlewares';
import models from '../../server/database/models';
import { generateToken } from '../../server/helpers';

const { verifyToken, getSessionFromToken } = middlewares;
const { User, Session } = models;

chai.use(sinonChai);

describe('verify token middleware', () => {
  afterEach(() => {
    if (User.findOne.restore) User.findOne.restore();
    if (Session.findOne.restore) Session.findOne.restore();
  });
  it('return error if no token', async () => {
    const request = { headers: {} };
    const response = { status() {}, json() {} };
    const next = sinon.spy();
    const status = sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returns({});

    await verifyToken(request, response, next);
    expect(status).to.calledWith(401);
  });

  it('return error for non existing user', async () => {
    const token = generateToken({ id: 2 });
    const user = User.findById(1);
    const request = { headers: { authorization: token } };

    sinon.stub(User, 'findOne').returns(false);
    const response = { status() {}, json() {} };
    const next = sinon.spy();
    const status = sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returns({});
    await verifyToken(request, response, next);
    expect(status).to.calledWith(404);
  });

  it('return error for expired token', async () => {
    const token = generateToken({ id: 1 });
    const request = { headers: { authorization: token } };
    sinon.stub(User, 'findOne').returns(true);
    sinon.stub(Session, 'findOne').returns(false);
    const response = { status() {}, json() {} };
    response.locals = {};
    response.locals.token = 'token';
    const next = sinon.spy();
    const status = sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returns({});
    await getSessionFromToken(request, response, next);
    expect(status).to.calledWith(404);
  });

  it('it should go to next', async () => {
    const token = generateToken({ id: 1 });
    const request = { headers: { authorization: token } };
    sinon.stub(User, 'findOne').returns(true);
    sinon.stub(Session, 'findOne').returns(true);
    const response = { status() {}, json() {} };
    const next = sinon.spy();
    sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returns({});
    await verifyToken(request, response, next);
  });

  it('it should go to next', async () => {
    const request = { headers: { authorization: 'auth' } };
    sinon.stub(User, 'findOne').returns(true);
    sinon.stub(Session, 'findOne').rejects();
    const response = { status() {}, json() {} };
    const next = sinon.spy();
    const status = sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returns({});
    await verifyToken(request, response, next);
    expect(status).to.calledWith(401);
  });

  context('when getSession middleware is successfully called', () => {
    it('returns next', async () => {
      const token = generateToken({ id: 1 });
      const request = {};
      const response = { status() {}, json() {} };
      response.locals = {};
      response.locals.token = token;
      const next = sinon.spy();
      sinon.stub(response, 'status').returnsThis();
      sinon.stub(response, 'json').returns({});
      await getSessionFromToken(request, response, next);
    });
  });

  context('when a token is not provided to the verifyToken function', () => {
    it('returns an authorization error', async () => {
      const next = sinon.stub();
      const request = { headers: { authorization: '' }, params: {} };
      const response = { status() {}, json() {} };
      const status = sinon.stub(response, 'status').returnsThis();
      await verifyToken(request, response, next);
      expect(status).to.calledWith(401);
    });
  });
});
