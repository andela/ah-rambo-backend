import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import app from '../../server';
import Profiles from '../../server/controllers/Profiles';

const { view } = Profiles;

config();

chai.use(chaiHttp);

const baseUrl = process.env.BASE_URL;

describe('GET Profile', () => {
  let userToken;

  before(async () => {
    const response = await chai
      .request(app)
      .post(`${baseUrl}/sessions/create`)
      .send({
        userLogin: 'Jhayeuiui',
        password: 'incorrect'
      });
    userToken = response.body.token;
  });

  context('when a logged in user checks other users profile', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/profiles/Jhayeuiui`)
        .set('Authorization', userToken);
      expect(response).to.have.status(200);
      expect(response.body.user).to.not.have.property(
        'password',
        'level',
        'role',
        'email',
        'id'
      );
      expect(response.body.user).to.have.any.keys(
        'firstName',
        'lastName',
        'userName',
        'avatarUrl',
        'bio',
        'followingsCount',
        'followersCount',
        'identifiedBy',
        'location',
        'occupation'
      );
    });
  });

  context('when a visitor checks other users profile by username', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/profiles/Jhayeuiui`);
      expect(response).to.have.status(200);
      expect(response.body.user).to.have.any.keys(
        'firstName',
        'lastName',
        'userName',
        'identifiedBy',
        'avatarUrl',
        'bio',
        'followingsCount',
        'followersCount'
      );
      expect(response.body.user).to.not.have.property(
        'password',
        'occupation',
        'location'
      );
    });
  });

  context('when a visitor checks other users profile by email', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/profiles/lucasi.jz@andela.com`);
      expect(response).to.have.status(200);
      expect(response.body.user).to.have.any.keys(
        'firstName',
        'lastName',
        'userName',
        'identifiedBy',
        'avatarUrl',
        'bio',
        'followingsCount',
        'followersCount'
      );
      expect(response.body.user).to.not.have.property(
        'password',
        'occupation',
        'location'
      );
    });
  });

  context('when a user checks another profile that does not exist', () => {
    it('returns a not found error', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/profiles/user90000`);
      expect(response).to.have.status(404);
    });
  });

  context('when the database is unable to query the user table ', () => {
    it('will throw a server error', async () => {
      const stubfunc = { view };
      const sandbox = sinon.createSandbox();
      sandbox.stub(stubfunc, 'view').rejects(new Error('Server Error'));

      const next = sinon.spy();
      const res = {
        status: () => ({
          json: next
        })
      };
      await view({}, res);
      sinon.assert.calledOnce(next);
    });
  });
});
