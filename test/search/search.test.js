import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import Search from '../../server/controllers/Search';

chai.use(chaiHttp);

const { BASE_URL } = process.env;

describe('Search Tests', () => {
  context('when the user does not enter a query', () => {
    it('returns an error', async () => {
      const response = await chai.request(app).get(`${BASE_URL}/search/`);
      expect(response).to.have.status(400);
      expect(response.body.error).to.equal('no search query entered');
    });
  });

  context('when the user enters an invalid query', () => {
    it('returns an error', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?what=78`);
      expect(response).to.have.status(422);
      expect(response.body.errors.what).to.equal('what is not allowed');
    });
  });

  context('when the user enters an valid query for a user', () => {
    it('returns the search results', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?user=Jhay`);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.data).to.have.property('count');
      expect(response.body.data).to.have.property('rows');
    });
  });

  context('when the user enters a query for a nonexisting user', () => {
    it('returns a 404 error', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?user=unknownPersonality`);
      expect(response).to.have.status(404);
      expect(response.body.error).to.equal(
        'your query did not match any results'
      );
    });
  });

  context('when the user enters a query for a nonexisting page', () => {
    it('returns a 404 error', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?user=jh&page=50`);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property('totalPages');
      expect(response.body.error).to.equal('page not found');
    });
  });

  context('when the user enters a query for an existing page', () => {
    it('returns the user and page details', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?user=j&page=2&pageItems=1`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('totalPages');
      expect(response.body).to.have.property('itemsOnPage');
      expect(response.body.currentPage).to.equal(2);
    });
  });

  context('when the user enters an invalid query for an article', () => {
    it('returns the search results', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?article=thiscandefinitelynotWorkYEt`);
      expect(response).to.have.status(404);
      expect(response.body).to.be.an('object');
    });
  });

  context('when the search function encounters a server error', () => {
    it('returns the error', async () => {
      const response = { status() {}, json() {} };
      const request = {};
      try {
        sinon.stub(response, 'status').returnsThis();
        await Search.modelSearch(request, response, 'model');
      } catch (error) {
        expect(response).to.have.status(500);
      }
    });
  });
});
