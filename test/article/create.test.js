import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { uploader } from 'cloudinary';
import sinon from 'sinon';
import app from '../../server';
import Article from '../../server/controllers/Article';
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
    'when a registered user create an article with valid details',
    async () => {
      it('create articles successfully with status publish', async () => {
        const response = await chai
          .request(app)
          .post(`${BASE_URL}/articles/create`)
          .set('Authorization', userToken)
          .send(ArticleData2);
        expect(response.status).to.equal(200);
      });
      it('create articles successfully with status draft', async () => {
        const response = await chai
          .request(app)
          .post(`${BASE_URL}/articles/create`)
          .set('Authorization', userToken)
          .send(ArticleData4);
        expect(response.status).to.equal(200);
      });
      it('upload image sucessfully', async () => {
        const uploaderstub = sinon
          .stub(uploader, 'upload')
          .callsFake(() => data.uploaded);
        await Article.createArticle(request, res);
        expect(res.statusCode).to.equal(200);
        uploaderstub.restore();
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
});
