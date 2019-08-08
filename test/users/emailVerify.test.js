import chai, { expect } from 'chai';
import { config } from 'dotenv';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import models from '../../server/database/models';
import { getNewUser } from './__mocks__';
import { generateToken } from '../../server/helpers';

config();

const { User } = models;

const { BASE_URL } = process.env;

chai.use(chaiHttp);

describe('Email verification service', () => {
  let token;
  before(async () => {
    const user = getNewUser();
    const newUser = await User.create(user);
    token = generateToken({ id: newUser.id });
  });
  context('when a registered user makes a verification request', () => {
    it("verifies the user's email address the first time", async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/users/verifyEmail/${token}`);
      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('email verification successful');
    });

    it('returns an error the second time of verification', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/users/verifyEmail/${token}`);
      expect(response).to.have.status(200);
      expect(response.body.message).to.equal('email already verified');
    });
  });

  it('should throw if it encounters an error on update', async () => {
    const stub = sinon.stub(User, 'update');
    const error = new Error('server error, this will be resolved shortly');
    stub.yields(error);
    const res = await chai
      .request(app)
      .get(`${BASE_URL}/users/verifyEmail/${token}`);
    expect(res).to.have.status(500);
    expect(res.body).to.include.key('error');
    expect(res.body.error).to.equal(
      'server error, this will be resolved shortly'
    );
    stub.restore();
  });
});
