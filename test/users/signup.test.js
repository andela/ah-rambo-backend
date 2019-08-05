import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import app from '../../server';
import getNewUser from './__mocks__';
import models from '../../server/database/models';

const { User, Session } = models;

config();

chai.use(chaiHttp);

const baseUrl = process.env.BASE_URL;

describe('POST User', () => {
  let existingEmail;
  let existingUserName;
  it('should sign up a new user', async () => {
    const user = getNewUser();
    existingEmail = user.email;
    existingUserName = user.userName;
    const response = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send({
        ...user,
        confirmPassword: user.password
      });
    expect(response).to.have.status(201);
    expect(response.body).to.be.an('object');
    expect(response.body.user.userName).to.equal(existingUserName);
    expect(response.body).to.have.key('user', 'token');
    expect(response.body.user).to.not.have.property('password');
    expect(response.body.token).to.equal(response.header.authorization);
    expect(response.body.user.email).to.equal(existingEmail);
  });

  it('should create a session token when signup is successful', async () => {
    const user = getNewUser();
    existingEmail = user.email;
    existingUserName = user.userName;
    const response = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send({
        ...user,
        confirmPassword: user.password
      });
    const userToken = response.body.token;
    const { dataValues } = await Session.findOne({
      where: { token: userToken }
    });
    const { token, active } = dataValues;
    expect(token).to.deep.equal(userToken);
    expect(token).to.be.a('string');
    expect(active).to.be.true;
  });

  context('when signup fails', () => {
    it('does not create a user session', async () => {
      const spySession = sinon.spy(Session, 'create');
      const user = getNewUser();
      const response = await chai
        .request(app)
        .post(`${baseUrl}/users/create`)
        .send({
          ...user,
          confirmPassword: user.password,
          email: existingEmail
        });
      expect(response).to.have.status(409);
      expect(response.body.error).to.equal('email has already been taken');
      expect(spySession.notCalled).to.be.true;
    });
  });

  it('should not register user with existing email', async () => {
    const user = getNewUser();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send({
        ...user,
        confirmPassword: user.password,
        email: existingEmail
      });
    expect(response).to.have.status(409);
    expect(response.body.error).to.equal('email has already been taken');
  });

  it('should not register user with existing username', async () => {
    const user = getNewUser();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send({
        ...user,
        confirmPassword: user.password,
        userName: existingUserName
      });
    expect(response).to.have.status(409);
    expect(response.body.error).to.equal('username has already been taken');
  });

  it('should throw if it encounters an error on create', async () => {
    const stub = sinon.stub(User, 'create');
    const error = new Error('server error, this will be resolved shortly');
    stub.yields(error);
    const user = getNewUser();
    const res = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send({
        ...user,
        confirmPassword: user.password
      });
    expect(res).to.have.status(500);
    expect(res.body).to.include.key('error');
    expect(res.body.error).to.equal(
      'server error, this will be resolved shortly'
    );
  });
});
