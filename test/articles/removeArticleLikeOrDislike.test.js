import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import models from '../../server/database/models';

chai.use(chaiHttp);
const { Article } = models;

describe('DELETE Article Like or Dislike', () => {
  const LOGIN_URL = `${process.env.BASE_URL}/sessions/create`;
  let authorizationToken = null;

  before('Login User and Get Authorization Token', async () => {
    const res = await chai
      .request(app)
      .post(LOGIN_URL)
      .send({
        userLogin: 'ahRambo50',
        password: 'authors.haven@haven.com'
      });

    authorizationToken = res.body.token;
  });

  describe('DELETE Article Like', () => {
    context('when an invalid article like is to be removed', () => {
      it('returns status code 404 and an error message', async () => {
        const slug = 'random-invalid-slug';
        const res = await chai
          .request(app)
          .delete(`/api/v1/articles/${slug}/like`)
          .set('Authorization', authorizationToken)
          .send({});

        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.equal('article not found');
      });
    });

    context('when an article like is removed', () => {
      it('returns status 200, a success message, and the article', async () => {
        const slug = 'how-to-train-your-dragon-2';
        const res = await chai
          .request(app)
          .delete(`/api/v1/articles/${slug}/like`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(200);
        expect(body).to.haveOwnProperty('message');
        expect(body).to.haveOwnProperty('article');
        expect(body.message).to.equal('like removed successfully');
        expect(body.article.slug).to.equal(slug);
        expect(body.article.likesCount).to.equal(0);
      });
    });

    context('when it encounters error on removing an article like', () => {
      it('returns status 500 and an error message', async () => {
        const slug = 'how-to-train-your-dragon-2';
        const stub = sinon.stub(Article, 'findBySlug');
        const error = new Error('server error, this will be resolved shortly');
        stub.yields(error);
        const res = await chai
          .request(app)
          .delete(`/api/v1/articles/${slug}/like`)
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

  describe('DELETE Article Dislike', () => {
    context('when an invalid article like is to be removed', () => {
      it('returns status code 404 and an error message', async () => {
        const slug = 'random-invalid-slug';
        const res = await chai
          .request(app)
          .delete(`/api/v1/articles/${slug}/dislike`)
          .set('Authorization', authorizationToken)
          .send({});

        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.equal('article not found');
      });
    });

    context('when an article like is removed', () => {
      it('returns status 200, a success message, and the article', async () => {
        const slug = 'how-to-train-your-dragon';
        const res = await chai
          .request(app)
          .delete(`/api/v1/articles/${slug}/dislike`)
          .set('Authorization', authorizationToken)
          .send({});

        const { body } = res;
        expect(res).to.have.status(200);
        expect(body).to.haveOwnProperty('message');
        expect(body).to.haveOwnProperty('article');
        expect(body.message).to.equal('dislike removed successfully');
        expect(body.article.slug).to.equal(slug);
        expect(body.article.dislikesCount).to.equal(0);
      });
    });

    context('when it encounters error on removing an article dislike', () => {
      it('returns status 500 and an error message', async () => {
        const slug = 'how-to-train-your-dragon-2';
        const stub = sinon.stub(Article, 'findBySlug');
        const error = new Error('server error, this will be resolved shortly');
        stub.yields(error);
        const res = await chai
          .request(app)
          .delete(`/api/v1/articles/${slug}/dislike`)
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
