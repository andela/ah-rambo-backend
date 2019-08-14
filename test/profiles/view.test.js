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
  context('when a user checks their profile', () => {
    it(' returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${baseUrl}/profiles/JhayXXX`);
      expect(response).to.have.status(200);
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
