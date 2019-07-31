import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import app from '../../server';
import getNewUser from './_mocks_';
import models from '../../server/database/models';

const { User } = models;

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
    expect(response.body.user.email).to.equal(existingEmail);
    // expect(response.body).to.include.key('token');
  });

  it('should return an error if passwords do not match', async () => {
    const user = getNewUser();
    const response = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send(user);
    expect(response).to.have.status(400);
    expect(response.body.error).to.equal('Passwords do not match');
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
    expect(response.body.error).to.equal('Email has already been taken');
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
    expect(response.body.error).to.equal('Username has already been taken');
  });

  it('should throw if it encounters an error on create', async () => {
    const stub = sinon.stub(User, 'create');
    const error = new Error('A fix is in progress');
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
    expect(res.body.error).to.equal('A fix is in progress');
  });
});
