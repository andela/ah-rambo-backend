import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { config } from 'dotenv';
import sinon from 'sinon';
import app from '../../server';
import Articles from '../../server/controllers/Articles';
import { getNewUser } from '../users/__mocks__';
import { checkmateArticleData } from './__mocks__';

const userSignUp = getNewUser();

const { viewArticle } = Articles;

config();

chai.use(chaiHttp);

const { BASE_URL } = process.env;

let userToken;
let slug;

before(async () => {
  const response = await chai
    .request(app)
    .post(`${BASE_URL}/users/create`)
    .send({ ...userSignUp, confirmPassword: userSignUp.password });

  userToken = response.body.token;

  const response1 = await chai
    .request(app)
    .post(`${BASE_URL}/articles/create`)
    .set('Authorization', userToken)
    .send(checkmateArticleData);
  slug = response1.body.slug;

  await chai
    .request(app)
    .post(`${BASE_URL}/articles/how-to-train-your-dragon/comments`)
    .set('authorization', userToken)
    .send({
      comment: new Array(4999).join('a')
    });
});

describe('GET Article', () => {
  context('when a user views a published article', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/articles/read/how-to-train-your-dragon`);
      expect(response).to.have.status(200);
      expect(response.body.article).to.not.have.property('isArchived');
      expect(response.body.article).to.have.any.keys(
        'id',
        'title',
        'description',
        'image',
        'articleBody',
        'likesCount',
        'dislikesCount',
        'publishedAt',
        'createdAt',
        'updatedAt',
        'authorId'
      );
    });
  });

  context('when a logged in user views a published article', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/articles/read/how-to-train-your-dragon`)
        .set('Authorization', userToken);
      expect(response).to.have.status(200);
      expect(response.body.article).to.not.have.property('isArchived');
      expect(response.body.article).to.not.have.property('isArchived');
      expect(response.body.article).to.have.any.keys(
        'id',
        'title',
        'description',
        'image',
        'articleBody',
        'likesCount',
        'dislikesCount',
        'publishedAt',
        'createdAt',
        'updatedAt',
        'authorId'
      );
    });
  });

  context('when a logged in user views their own published article', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/articles/read/${slug}`)
        .set('Authorization', userToken);
      expect(response).to.have.status(200);
      expect(response.body.article).to.have.any.keys(
        'id',
        'title',
        'description',
        'image',
        'articleBody',
        'likesCount',
        'dislikesCount',
        'publishedAt',
        'createdAt',
        'updatedAt',
        'authorId',
        'isArchived'
      );
    });
  });

  context('when a user tries to view an article that does not exist', () => {
    it('returns a not found error', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/articles/read/90000`);
      expect(response).to.have.status(404);
      expect(response.body.error).to.equal('article not found');
    });
  });

  context('when a user tries to view an article that does not exist', () => {
    it('returns a not found error', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/articles/read/90000`)
        .set('Authorization', userToken);
      expect(response).to.have.status(404);
      expect(response.body.error).to.equal('article not found');
    });
  });

  context('when a user tries to view an archived article', () => {
    it('returns the user profile', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/articles/read/how-to-train-your-dragon-6`);
      expect(response).to.have.status(404);
      expect(response.body.error).to.equal('article not found');
    });
  });

  context('when the database is unable to query the user table ', () => {
    it('will throw a server error', async () => {
      const stubfunc = { viewArticle };
      const sandbox = sinon.createSandbox();
      sandbox.stub(stubfunc, 'viewArticle').rejects(new Error('Server Error'));

      const next = sinon.spy();
      const res = {
        status: () => ({
          json: next
        })
      };
      await viewArticle({}, res);
      sinon.assert.calledOnce(next);
    });
  });
});
