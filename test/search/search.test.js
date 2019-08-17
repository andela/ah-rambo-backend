import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import Search from '../../server/controllers/Search';

chai.use(chaiHttp);

const { BASE_URL } = process.env;

describe('Search Tests', () => {
  context('when the user does not enter a query item for articles', () => {
    it('returns the articles in the database', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?article`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('count');
      expect(response.body).to.have.property('results');
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
      expect(response.body.data).to.have.property('results');
      expect(response.body.data.results[0]).to.have.property('firstName');
      expect(response.body.data.results[0]).to.have.property('lastName');
      expect(response.body.data.results[0]).to.have.property('userName');
      expect(response.body.data.results[0]).to.have.property('bio');
      expect(response.body.data.results[0]).to.have.property('avatarUrl');
      expect(response.body.data.results[0]).to.not.have.property('password');
      expect(response.body.data.results[0]).to.not.have.property('role');
      expect(response.body.data.results[0]).to.not.have.property('level');
    });
  });

  context('when the user enters a query for a nonexisting user', () => {
    it('returns an empty array', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?user=unknownPersonality`);
      expect(response).to.have.status(200);
      expect(response.body.data.count).to.equal(0);
      expect(response.body.itemsOnPage).to.equal(0);
    });
  });

  context('when the user enters a query for a nonexisting page', () => {
    it('returns an empty array', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?user=jha&page=50`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('totalPages');
      expect(response.body.itemsOnPage).to.equal(0);
    });
  });

  context('when the user enters a query for an existing page', () => {
    it('returns the user and page details', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?user=jhayxxx&page=1&pageItems=2`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('totalPages');
      expect(response.body).to.have.property('itemsOnPage');
      expect(response.body.currentPage).to.equal(1);
      expect(response.body.data.results[0].firstName).to.equal('Abiola');
      expect(response.body.data.results[0].lastName).to.equal('JayZ');
      expect(response.body.data.results[0].userName).to.equal('JhayXXX');
    });
  });

  context('when the user enters a query for an existing tag', () => {
    it('returns the tag and page details', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?tag=tech&page=1&pageItems=1`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('totalPages');
      expect(response.body).to.have.property('itemsOnPage');
      expect(response.body.currentPage).to.equal(1);
    });

    it('returns the tag details', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?tag=foot&page=1&pageItems=1`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('totalPages');
      expect(response.body).to.have.property('itemsOnPage');
      expect(response.body.currentPage).to.equal(1);
      expect(response.body.data.results[0][1].name).to.equal('foot-ball');
    });
  });

  context('when the user enters a query for an existing category', () => {
    it('returns the category and page details', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?category=industry&page=1&pageItems=1`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('totalPages');
      expect(response.body).to.have.property('itemsOnPage');
      expect(response.body.currentPage).to.equal(1);
      expect(response.body.data.results[0][3].name).to.equal('industry');
    });

    it('returns the articles in the category', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?category=Life&page=1&pageItems=1`);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('totalPages');
      expect(response.body).to.have.property('itemsOnPage');
      expect(response.body.currentPage).to.equal(1);
      expect(response.body.data.results[0][5].name).to.equal('life');
      expect(response.body.data.results[0][5].articles[0].title).to.equal(
        ' is simply dummy text of the printing and typesetting '
      );
    });
  });

  context('when the user enters an invalid query for an article', () => {
    it('returns an empty object', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?article=thiscandefinitelynotWorkYEt`);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.data.count).to.equal(0);
    });
  });

  context('when the user enters a global search query', () => {
    it('returns the search results', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?global=j`);
      expect(response).to.have.status(200);
      expect(response.body.userSearch.count).to.not.equal(0);
      expect(response.body)
        .to.be.an('object')
        .to.have.keys([
          'userSearch',
          'articleSearch',
          'tagSearch',
          'categorySearch'
        ]);
      expect(response.body.userSearch)
        .to.be.an('object')
        .to.have.keys(['count', 'results']);
      expect(response.body.articleSearch)
        .to.be.an('object')
        .to.have.keys(['count', 'results']);
      expect(response.body.tagSearch)
        .to.be.an('object')
        .to.have.keys(['count', 'results']);
    });
  });

  context('when the user enters a article search query', () => {
    it('returns the search results', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?article=dummy`);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.currentPage).to.equal(1);
      expect(response.body.totalPages).to.not.equal('0');
      expect(response.body.data)
        .to.be.an('object')
        .to.have.keys('count', 'results');
      expect(response.body.data.count).to.be.above(0);
    });
  });

  context('when the user enters an unkwown global search query', () => {
    it('returns an empty response body', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/search/?global=ThisWillDfientyelyUknwkjd`);
      expect(response).to.have.status(200);
      expect(response.body.userSearch)
        .to.be.an('object')
        .to.have.keys(['count', 'results']);
      expect(response.body.articleSearch)
        .to.be.an('object')
        .to.have.keys(['count', 'results']);
      expect(response.body.tagSearch)
        .to.be.an('object')
        .to.have.keys(['count', 'results']);
      expect(response.body.userSearch.count).to.equal(0);
      expect(response.body.articleSearch.count).to.equal(0);
      expect(response.body.tagSearch.count).to.equal(0);
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
