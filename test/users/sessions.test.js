import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import app from '../../server';
import userData from './__mocks__/user';
import Sessions from '../../server/controllers/Sessions';
import models from '../../server/database/models';
import { getNewUser } from './__mocks__';

chai.use(chaiHttp);

const LOGIN_URL = `${process.env.BASE_URL}/sessions/create`;
const { create, destroy } = Sessions;
const { Session, User } = models;
const { rightUserWithUserName, rightUserWithEmail, wrongUser } = userData;

describe('LOGIN TEST', () => {
  it('should login in user if the right email is provided', async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .send(rightUserWithEmail);
    expect(response).to.have.status(200);
    expect(response.body).to.have.key('user', 'token');
    expect(response.body.user).to.not.have.property('password');
    expect(response.body.token).to.equal(response.header.authorization);
    expect(response.body.user).to.have.any.keys(
      'id',
      'userName',
      'email',
      'status'
    );
  });

  it('should not login in user details is empty', async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .send({});
    expect(response).to.have.status(400);
    expect(response.body.message).to.be.a('string');
  });

  it('should not login in user details if a field is missing', async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .send({ userLogin: '' });
    expect(response).to.have.status(400);
    expect(response.body.message).to.be.a('string');
  });

  it('should not login in user details if a field is missing', async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .send({ password: '' });
    expect(response).to.have.status(400);
    expect(response.body.message).to.be.a('string');
  });

  it('should login in user if the right username is provided', async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .send(rightUserWithUserName);
    expect(response).to.have.status(200);
    expect(response.body).to.have.key('user', 'token');
    expect(response.body.user).to.not.have.property('password');
    expect(response.body.user).to.have.any.keys(
      'id',
      'userName',
      'email',
      'status'
    );
  });

  it('should not login in user with the wrong credentials', async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .send(wrongUser);
    expect(response).to.have.status(401);
    expect(response.body).to.not.have.property('user, token');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');
  });

  it('should create a session when a user logs in', async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .set(
        'user-agent',
        'Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0'
      )
      .send(rightUserWithEmail);
    const { token } = response.body;
    const session = await Session.findOne({ where: { token } });
    expect(response).to.have.status(200);
    expect(response.body.user.id).to.equal(session.userId);
    expect(session.devicePlatform).to.not.have.property('mobile');
  });
});

describe('LOGIN SERVER ERROR TEST', () => {
  it("should not login in user if there's a server error", async () => {
    const stubfunc = { create };
    const sandbox = sinon.createSandbox();
    sandbox.stub(stubfunc, 'create').rejects(new Error('Server Error'));

    const next = sinon.spy();
    const res = {
      status: () => ({
        json: next
      })
    };
    await create({}, res);
    sinon.assert.calledOnce(next);
  });
});

describe('Sign out Test', () => {
  let sessionToken;
  before(async () => {
    const response = await chai
      .request(app)
      .post(`${LOGIN_URL}`)
      .send(rightUserWithEmail);
    sessionToken = response.body.token;
  });

  it('should set session active to false when signing out', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/sessions/destroy')
      .set('authorization', sessionToken);
    expect(response).to.have.status(200);
    expect(response.body.message).to.deep.equal('sign out successful');
  });

  it('sign out successful even when token is invalid', async () => {
    const response = await chai
      .request(app)
      .get('/api/v1/sessions/destroy')
      .set('authorization', 'invalid.session.Token');
    expect(response).to.have.status(200);
    expect(response.body.message).to.deep.equal('sign out successful');
  });

  it('should respond with error 500 if there is an error', async () => {
    const stubfunc = { destroy };
    const sandbox = sinon.createSandbox();
    sandbox.stub(stubfunc, 'destroy').rejects(new Error('Server Error'));

    const next = sinon.spy();
    const res = {
      status: () => ({
        json: next
      })
    };
    await destroy({}, res);
    sinon.assert.calledOnce(next);
  });
});
