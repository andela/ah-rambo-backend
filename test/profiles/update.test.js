import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import path from 'path';
import app from '../../server';
import Profiles from '../../server/controllers/Profiles';
import newUser from './__mocks__/newUser';

const { update } = Profiles;

config();

chai.use(chaiHttp);

const baseUrl = process.env.BASE_URL;

describe('PATCH Profile', () => {
  let userToken;

  before(async () => {
    const response = await chai
      .request(app)
      .post(`${baseUrl}/sessions/create`)
      .send(newUser);
    userToken = response.body.token;
  });

  context('when a new username is provided', () => {
    it('returns the updated user profile', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/profiles/3`)
        .set('Authorization', userToken)
        .send({ userName: 'Jhayeuiui' });
      expect(response).to.have.status(200);
    });
  });

  context('when a user tries to edit another user profile', () => {
    it('returns an unauthorized error', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/profiles/9014`)
        .set('Authorization', userToken)
        .send({ userName: 'Jhayeuiui' });
      expect(response).to.have.status(403);
    });
  });

  context('when the old username is provided', () => {
    it('returns a conflict error', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/profiles/3`)
        .set('Authorization', userToken)
        .send({ userName: 'Jhayeuiui' });
      expect(response).to.have.status(409);
      expect(response.body.error).to.equal('username has already been taken');
    });
  });

  context('when a new email is provided', () => {
    it('returns the updated user profile', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/profiles/3`)
        .set('Authorization', userToken)
        .send({ email: 'lucasi.jz@andela.com' });
      expect(response).to.have.status(200);
    });
  });

  context('when the old email is provided', () => {
    it('returns a conflict error', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/profiles/3`)
        .set('Authorization', userToken)
        .send({ email: 'lucasi.jz@andela.com' });
      expect(response).to.have.status(409);
      expect(response.body.error).to.equal('email has already been taken');
    });
  });

  context('when the user update their avatarUrl', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .patch(`${baseUrl}/profiles/3`)
        .set('Authorization', userToken)
        .set('Content-Type', 'multipart/form-data')
        .attach(
          'avatarUrl',
          path.join(__dirname, './__mocks__/image/test.png')
        );
      expect(response).to.have.status(200);
    });
  });

  context('when the it is unable to update the user table ', () => {
    it('returns an intenal server error', async () => {
      const stubfunc = { update };
      const sandbox = sinon.createSandbox();
      sandbox.stub(stubfunc, 'update').rejects(new Error('Server Error'));

      const next = sinon.spy();
      const res = {
        status: () => ({
          json: next
        })
      };
      await update({}, res);
      sinon.assert.calledOnce(next);
    });
  });
});
