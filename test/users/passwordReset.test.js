import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import userData from './__mocks__/user';
import models from '../../server/database/models';

const { User, Session, ResetPassword } = models;
const { rightUserWithEmail } = userData;

chai.use(chaiHttp);

const baseUrl = process.env.BASE_URL;

describe('Request Password Reset Link', () => {
  const unknownEmail = 'unknown@gmail.com';
  const invalidEmail = 'unknowngmailcom';
  context('when email provided is not found', () => {
    it('returns error 404 that email is not found', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/users/resetpassword`)
        .send({ email: unknownEmail });
      expect(response).to.have.status(404);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.deep.equal('email address not found');
    });
  });

  context('when email address provided is not valid', () => {
    it('returns error that email is invalid', async () => {
      const response = await chai
        .request(app)
        .post(`${baseUrl}/users/resetpassword`)
        .send({ email: invalidEmail });
      expect(response).to.have.status(422);
      expect(response.body).to.haveOwnProperty('errors');
      expect(response.body.errors).to.haveOwnProperty('email');
      expect(response.body.errors.email).to.deep.equal('email is invalid');
    });
  });

  context('when user gives a known and valid email address', () => {
    it('returns returns a success message', async () => {
      const email = rightUserWithEmail.userLogin;
      const response = await chai
        .request(app)
        .post(`${baseUrl}/users/resetpassword`)
        .send({ email });
      expect(response).to.have.status(200);
      expect(response.body).to.haveOwnProperty('message');
    });

    it('deactivates all user current sessions', async () => {
      const spySession = sinon.spy(Session, 'revokeAll');
      const email = rightUserWithEmail.userLogin;
      const response = await chai
        .request(app)
        .post(`${baseUrl}/users/resetpassword`)
        .send({ email });
      expect(response).to.have.status(200);
      expect(spySession.called).to.be.true;
    });
  });

  context('When there is server error when making the request', () => {
    it('returns a 500 error', async () => {
      const stub = sinon.stub(User, 'findByEmail');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const response = await chai
        .request(app)
        .post(`${baseUrl}/users/resetpassword`)
        .send({ email: unknownEmail });
      expect(response).to.have.status(500);
      expect(response.body).to.include.key('error');
      expect(response.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });
});

describe('Reset Password', async () => {
  let userId;
  let resetToken;
  before(async () => {
    const response = await chai
      .request(app)
      .post(`${baseUrl}/sessions/create`)
      .send(rightUserWithEmail);

    await chai
      .request(app)
      .post(`${baseUrl}/users/resetpassword`)
      .send({ email: rightUserWithEmail.userLogin });

    userId = response.body.user.id;
    const { dataValues } = await ResetPassword.findOne({
      where: { userId }
    });
    resetToken = dataValues.token;
  });

  context('When user uses reset link that is invalid or expired', () => {
    it('returns an error', async () => {
      const token = `${resetToken}`;
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/users/resetpassword/${token}lll`)
        .send({ password: 'Incorrect', confirmPassword: 'Incorrect' });
      expect(response).to.have.status(401);
      expect(response.body).to.haveOwnProperty('error');
      expect(response.body.error).to.deep.equal(
        'link has expired or is invalid'
      );
    });
  });

  context('When there is server error when making the request', () => {
    it('returns a 500 error', async () => {
      const stub = sinon.stub(ResetPassword, 'findOne');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const token = `${resetToken}`;
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/users/resetpassword/${token}`)
        .send({ password: 'incorrect99', confirmPassword: 'incorrect99' });

      expect(response).to.have.status(500);
      expect(response.body).to.include.key('error');
      expect(response.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });

  context('When user gives valid new password', () => {
    it('it updates password with new one and reset token get destroyed', async () => {
      const spyResetPassword = sinon.spy(ResetPassword, 'destroy');
      const token = `${resetToken}`;
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/users/resetpassword/${token}`)
        .send({ password: 'incorrect99', confirmPassword: 'incorrect99' });
      expect(response).to.have.status(200);
      expect(response.body).to.haveOwnProperty('message');
      expect(response.body.message).to.deep.equal('password reset successful');
      expect(spyResetPassword.called).to.be.true;
    });
  });

  context('When user tries already used link', () => {
    it('returns error link has been used', async () => {
      const token = `${resetToken}`;
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/users/resetpassword/${token}`)
        .send({ password: 'incorrect99', confirmPassword: 'incorrect99' });
      expect(response).to.have.status(401);
      expect(response.body).to.haveOwnProperty('error');
      expect(response.body.error).to.deep.equal('link has been used');
    });
  });
});
