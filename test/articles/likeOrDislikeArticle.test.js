import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import app from '../../server';
import { authenticatedUser } from './__mocks__';
import models from '../../server/database/models';

chai.use(chaiHttp);
const { Article, Like, Dislike } = models;

describe('POST Article Like Or Dislike', () => {
  const SIGNUP_URL = `${process.env.BASE_URL}/users/create`;
  let userId = null;
  let authorizationToken = null;

  before('Signup User and Get Authorization Token', async () => {
    const res = await chai
      .request(app)
      .post(SIGNUP_URL)
      .send(authenticatedUser);

    authorizationToken = res.body.token;
    const { id } = await jwt.verify(authorizationToken, process.env.JWT_KEY);
    userId = id;
  });

  describe('POST Article Like', () => {
    context('when an invalid article is to be liked', () => {
      it('returns status code 404 and an error message', async () => {
        const slug = 'random-invalid-slug';
        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/like`)
          .set('Authorization', authorizationToken)
          .send({});

        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.equal('article not found');
      });
    });

    context('when an article is liked', () => {
      it('returns status 201, a success message, and the article', async () => {
        const slug = 'how-to-train-your-dragon';
        await Dislike.create({ userId, contentType: 'article', contentId: 1 });

        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/like`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(201);
        expect(body).to.haveOwnProperty('message');
        expect(body).to.haveOwnProperty('article');
        expect(body.message).to.equal('like added successfully');
        expect(body.article.slug).to.equal(slug);
        expect(body.article.likesCount).to.equal(1);
        expect(body.article).to.haveOwnProperty('likes');
        expect(body.article).not.to.haveOwnProperty('dislikes');
        expect(body.article.likes[0].userId).to.equal(userId);
      });
    });

    context('when an article had been liked by the user', () => {
      it('returns status 400 and a notification message', async () => {
        const slug = 'how-to-train-your-dragon';
        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/like`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(400);
        expect(body).to.haveOwnProperty('message');
        expect(body.message).to.match(/have already liked this article/i);
      });
    });

    context('when it encounters error on liking an article', () => {
      it('returns status 500 and an error message', async () => {
        const slug = 'how-to-train-your-dragon';
        const stub = sinon.stub(Article, 'findBySlug');

        const error = new Error('server error, this will be resolved shortly');
        stub.yields(error);

        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/like`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(500);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.equal(
          'server error, this will be resolved shortly'
        );

        stub.restore();
      });
    });
  });

  describe('POST Article Dislike', () => {
    context('when an invalid article is to be disliked', () => {
      it('returns status code 404 and an error message', async () => {
        const slug = 'random-fake-article-slug';
        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/dislike`)
          .set('Authorization', authorizationToken)
          .send({});

        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.equal('article not found');
      });
    });

    context('when an article is disliked', () => {
      it('returns status 201, a success message, and the article', async () => {
        const slug = 'how-to-train-your-dragon-2';
        await Like.create({ userId, contentType: 'article', contentId: 2 });

        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/dislike`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(201);
        expect(body).to.haveOwnProperty('message');
        expect(body).to.haveOwnProperty('article');
        expect(body.message).to.equal('dislike added successfully');
        expect(body.article.slug).to.equal(slug);
        expect(body.article.likesCount).to.equal(0);
        expect(body.article.dislikesCount).to.equal(1);
        expect(body.article).not.to.haveOwnProperty('likes');
        expect(body.article).to.haveOwnProperty('dislikes');
        expect(body.article.dislikes[0].userId).to.equal(userId);
      });
    });

    context('when an article had been disliked by the user', () => {
      it('returns status 400 and a notification message', async () => {
        const slug = 'how-to-train-your-dragon-2';
        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/dislike`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(400);
        expect(body).to.haveOwnProperty('message');
        expect(body.message).to.match(/have already disliked this article/i);
      });
    });

    context('when it encounters error on disliking an article', () => {
      it('returns status 500 and an error message', async () => {
        const slug = 'how-to-train-your-dragon-2';
        const stub = sinon.stub(Article, 'findBySlug');
        const error = new Error('server error, this will be resolved shortly');
        stub.yields(error);
        const res = await chai
          .request(app)
          .post(`/api/v1/articles/${slug}/dislike`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(500);
        expect(body).to.haveOwnProperty('error');
        expect(body.error).to.equal(
          'server error, this will be resolved shortly'
        );

        stub.restore();
      });
    });
  });
});
