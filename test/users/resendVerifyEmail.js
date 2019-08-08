import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import app from '../../server';
import models from '../../server/database/models';
import userData from './__mocks__/user';
import { generateToken } from '../../server/helpers';

config();

chai.use(chaiHttp);

const { BASE_URL } = process.env;

const { User } = models;

const { rightUserWithEmail } = userData;

describe('Resend Verification Email', () => {
  const email = rightUserWithEmail.userLogin;
  context('when a user requests a new verification email', () => {
    it('sends the email to the user', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/users/verificationEmail/${email}`);
      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('email sent successfully');
    });
  });

  context('when user clicks the resent verification link', () => {
    it("verifies the user's email", async () => {
      const token = generateToken({ id: 1 });
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/users/verifyEmail/${token}`);
      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('email verification successful');
    });
  });

  context('when a wrong email is supplied', () => {
    it('returns a not found error', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/users/verificationEmail/odogwu@odogwu.com`);
      expect(response).to.have.status(404);
      expect(response.body.error).to.equal('user not found');
    });
  });

  context('when there is a server error', () => {
    it('throws an error', async () => {
      const stub = sinon.stub(User, 'findByEmail');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const res = await chai
        .request(app)
        .get(`${BASE_URL}/users/verificationEmail/${email}`);
      expect(res).to.have.status(500);
      expect(res.body).to.include.key('error');
      expect(res.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });
});
