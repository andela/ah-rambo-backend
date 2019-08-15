import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { uploader } from 'cloudinary';
import sinon from 'sinon';
import app from '../../server';
import ArticleController from '../../server/controllers/Article';
import model from '../../server/database/models';
import { getNewUser } from '../users/__mocks__';
import {
  ArticleData2,
  ArticleData4,
  invalidArticleData,
  request
} from './__mocks__';

chai.use(chaiHttp);
const res = {
  body: null,
  statusCode: null,
  send(data) {
    this.body = data;
    return data;
  },
  json(data) {
    this.body = data;
    return data;
  },
  status(responseStatus) {
    this.statusCode = responseStatus;
    return this;
  }
};
const { Article } = model;
const data = {
  uploaded: {
    url:
      'http://res.cloudinary.com/teamrambo50/image/upload/v1565734710/k5fspd6uo4b4fw2upxlq.png'
  }
};
const { BASE_URL } = process.env;
let userToken;
const userSignUp = getNewUser();
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
});

describe('Create Article Test', () => {
  context(
    `when a registered user  enter article with
    valid details with status as publish`,
    () => {
      it('create and publish articles successfully', async () => {
        const response = await chai
          .request(app)
          .post(`${BASE_URL}/articles/create`)
          .set('Authorization', userToken)
          .send(ArticleData2);
        expect(response.status).to.equal(200);
      });
      it('upload image sucessfully', async () => {
        const uploaderstub = sinon
          .stub(uploader, 'upload')
          .callsFake(() => data.uploaded);
        await ArticleController.createArticle(request, res);
        expect(res.statusCode).to.equal(200);
        uploaderstub.restore();
      });
    }
  );
  context(
    `when a registered user  enter valid
  article details with status as draft`,
    async () => {
      it('create  draft articles successfully', async () => {
        const response = await chai
          .request(app)
          .post(`${BASE_URL}/articles/create`)
          .set('Authorization', userToken)
          .send(ArticleData4);
        expect(response.body.publishedAt).to.equal(null);
        expect(response.status).to.equal(200);
      });
    }
  );
  context('when user enters invalid details', () => {
    it('throw error', async () => {
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(invalidArticleData);
      expect(response.status).to.equal(422);
    });
  });

  context('when there is an internal error', () => {
    it('will throw error', async () => {
      const stub = sinon.stub(Article, 'create');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(ArticleData2);
      expect(response).to.have.status(500);
      expect(response.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });
});
