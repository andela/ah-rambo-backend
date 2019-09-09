import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import models from '../../server/database/models';

const { BASE_URL } = process.env;
const { Category } = models;

chai.use(chaiHttp);

describe('GET Categories Test', () => {
  it('gets all categories', async () => {
    const response = await chai.request(app).get(`${BASE_URL}/categories`);
    expect(response).to.have.status(200);
    expect(response.body.categories).to.be.an('array');
  });

  context('when there is an internal error', () => {
    it('returns a 500 server error', async () => {
      const stub = sinon.stub(Category, 'findAll');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const res = await chai.request(app).get(`${BASE_URL}/categories`);
      expect(res).to.have.status(500);
      expect(res.body).to.include.key('error');
      expect(res.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      Category.findAll.restore();
    });
  });
});
