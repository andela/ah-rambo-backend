import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import models from '../../server/database/models';

const { BASE_URL } = process.env;
const { Tag } = models;

chai.use(chaiHttp);

describe('GET Tags Test', () => {
  it('gets all tags', async () => {
    const response = await chai.request(app).get(`${BASE_URL}/tags`);
    expect(response).to.have.status(200);
    expect(response.body.tags).to.be.an('array');
  });

  context('when there is an internal error', () => {
    it('returns a 500 server error', async () => {
      const stub = sinon.stub(Tag, 'findAll');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const res = await chai.request(app).get(`${BASE_URL}/tags`);
      expect(res).to.have.status(500);
      expect(res.body).to.include.key('error');
      expect(res.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      Tag.findAll.restore();
    });
  });
});
