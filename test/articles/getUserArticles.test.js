import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import { getNewUser } from '../users/__mocks__';
import model from '../../server/database/models';
import { ArticleData4, ArticleData20 } from './__mocks__';

chai.use(chaiHttp);
const { BASE_URL } = process.env;
let userToken;
const userSignUp = getNewUser();
const { Article } = model;
before(async () => {
  await chai
    .request(app)
    .post(`${BASE_URL}/users/create`)
    .send({ ...userSignUp, confirmPassword: userSignUp.password });
  const response = await chai
    .request(app)
    .post(`${BASE_URL}/sessions/create`)
    .send({ userLogin: userSignUp.email, password: userSignUp.password });
  userToken = response.body.token;

  await chai
    .request(app)
    .post(`${BASE_URL}/articles/create`)
    .set('Authorization', userToken)
    .send(ArticleData4);
  await chai
    .request(app)
    .post(`${BASE_URL}/articles/create`)
    .set('Authorization', userToken)
    .send(ArticleData20);
});

describe('get User Article Test', () => {
  context('when a user enters a valid token', () => {
    it('get all his article successfully', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/articles/user`)
        .set('Authorization', userToken);
      expect(response.body.articles.total).to.equal(2);
      expect(response.status).to.equal(200);
    });
  });

  context('when a user enter an invalid token', () => {
    it('returns an error', async () => {
      const response = await chai.request(app).get(`${BASE_URL}/articles/user`);
      expect(response.status).to.equal(401);
    });
  });

  context(
    'when the get User Articles method encounters a internal error',
    () => {
      it('throws a server error', async () => {
        const userArticles = sinon
          .stub(Article, 'findAndCountAll')
          .callsFake(() => {});
        const response = await chai
          .request(app)
          .get(`${BASE_URL}/articles/user`)
          .set('Authorization', userToken);
        expect(response.status).to.equal(500);
        userArticles.restore();
      });
    }
  );
});
