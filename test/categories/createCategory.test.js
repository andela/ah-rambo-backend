/* eslint-disable max-len */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import Categories from '../../server/controllers/Categories';

chai.use(chaiHttp);

const { BASE_URL } = process.env;
const { create } = Categories;

let data;
before(async () => {
  const response = await chai
    .request(app)
    .post(`${BASE_URL}/sessions/create`)
    .send({
      userLogin: 'demoUser',
      password: 'incorrect'
    });
  data = response.body;
});

describe('Create Categories Test', () => {
  context('when a new category name is present', () => {
    it('creates a new category', async () => {
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/categories/create`)
        .set('Authorization', data.token)
        .send({
          name: 'demographically',
          description: 'demograph of the world'
        });
      expect(response).to.have.status(200);
      expect(response.body).to.have.key('message', 'data');
      expect(response.body.data.name).to.equal('demographically');
      expect(response.body.data.description).to.be.a('string');
    });
  });

  context('when an existing category name is supplied', () => {
    it('throws an error', async () => {
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/categories/create`)
        .set('Authorization', data.token)
        .send({
          name: 'demographically',
          description: 'demograph of the world'
        });
      expect(response).to.have.status(409);
      expect(response.body).to.have.key('error');
      expect(response.body.error).to.equal(
        'demographically category already exists'
      );
    });
  });

  context('when the create method encounters a internal error', () => {
    it('throws a server error', async () => {
      const stubfunc = { create };
      const sandbox = sinon.createSandbox();
      sandbox.stub(stubfunc, 'create').rejects(new Error('Server Error'));

      const next = sinon.spy();
      const res = {
        status: () => ({
          json: next
        })
      };
      await create({}, res);
      sinon.assert.calledOnce(next);
    });
  });
});
