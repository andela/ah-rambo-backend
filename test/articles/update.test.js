import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { uploader } from 'cloudinary';
import app from '../../server';
import model from '../../server/database/models';
import ArticleController from '../../server/controllers/Articles';
import { getNewUser } from '../users/__mocks__';
import {
  ArticleData4,
  ArticleData5,
  request,
  ArticleData20,
  fakeoutput
} from './__mocks__';

chai.use(chaiHttp);
const { BASE_URL } = process.env;
let userToken, userToken2;
const userSignUp = getNewUser();
const userSignUp2 = getNewUser();
const { Article } = model;
const data = {
  uploaded: {
    url:
      'http://res.cloudinary.com/teamrambo50/image/upload/v1565734710/k5fspd6uo4b4fw2upxlq.png'
  }
};
let slug1, slug2;
const res = {
  body: null,
  statusCode: null,
  send(data1) {
    this.body = data1;
    return data1;
  },
  json(data1) {
    this.body = data1;
    return data1;
  },
  status(responseStatus) {
    this.statusCode = responseStatus;
    return this;
  }
};

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
    .post(`${BASE_URL}/users/create`)
    .send({ ...userSignUp2, confirmPassword: userSignUp2.password });

  const response2 = await chai
    .request(app)
    .post(`${BASE_URL}/sessions/create`)
    .send({ userLogin: userSignUp2.email, password: userSignUp2.password });
  userToken2 = response2.body.token;

  const response3 = await chai
    .request(app)
    .post(`${BASE_URL}/articles/create`)
    .set('Authorization', userToken)
    .send(ArticleData4);
  slug1 = response3.body.slug;

  const response4 = await chai
    .request(app)
    .post(`${BASE_URL}/articles/create`)
    .set('Authorization', userToken)
    .send(ArticleData20);
  slug2 = response4.body.slug;
});
describe('Update Article Test', () => {
  context('when a user enters valid details', () => {
    it('update his article successfully', async () => {
      const response = await chai
        .request(app)
        .patch(`${BASE_URL}/articles/update/${slug1}`)
        .set('Authorization', userToken)
        .send(ArticleData5);
      expect(response.status).to.equal(200);
      expect(response.body.publishedAt).to.equal(null);
    });

    it('mocks image upload ', async () => {
      const uploaderstub = sinon
        .stub(uploader, 'upload')
        .callsFake(() => data.uploaded);
      const articleDetails = sinon
        .stub(Article, 'findBySlug')
        .callsFake(() => fakeoutput);
      const articleUpdate = sinon
        .stub(Article, 'update')
        .callsFake(() => fakeoutput);
      await ArticleController.update(request, res);
      expect(res.statusCode).to.equal(403);
      articleDetails.restore();
      uploaderstub.restore();
      articleUpdate.restore();
    });
  });
  context(
    'when a user attempts to update an article that does not exist',
    () => {
      it('returns not found', async () => {
        const response = await chai
          .request(app)
          .patch(`${BASE_URL}/articles/update/${'unknown'}`)
          .set('Authorization', userToken)
          .send(ArticleData5);
        expect(response.status).to.equal(404);
        expect(response.body.error).to.equal('article not found');
      });
    }
  );
  context('when a user enter valid details without tags', () => {
    it('update his article successfully', async () => {
      const noArticleTag = ArticleData4;
      delete noArticleTag.tags;
      const response = await chai
        .request(app)
        .patch(`${BASE_URL}/articles/update/${slug2}`)
        .set('Authorization', userToken)
        .send(noArticleTag);
      expect(response.status).to.equal(200);
      expect(response.body.publishedAt).to.equal(null);
    });
  });

  context(
    `when a user attempts to
    update an article he didnt create`,
    () => {
      it('does not update the article ', async () => {
        const response = await chai
          .request(app)
          .patch(`${BASE_URL}/articles/update/${slug1}`)
          .set('Authorization', userToken2)
          .send(ArticleData5);
        expect(response.status).to.equal(403);
      });
    }
  );

  context(
    `when a user attempts to
    update of article with an empty body`,
    () => {
      it('does not update the article ', async () => {
        const response = await chai
          .request(app)
          .patch(`${BASE_URL}/articles/update/${slug1}`)
          .set('Authorization', userToken)
          .send({});
        expect(response.status).to.equal(422);
      });
    }
  );

  context(
    `when a user attempts to
    update of article without a category`,
    () => {
      it('does not update the articles category ', async () => {
        const myArticle = ArticleData5;
        myArticle.category = undefined;
        const response = await chai
          .request(app)
          .patch(`${BASE_URL}/articles/update/${slug1}`)
          .set('Authorization', userToken)
          .send(myArticle);
        expect(response.status).to.equal(200);
        expect(response.body.publishedAt).to.equal(null);
        expect(response.body.title).to.equal(myArticle.title);
      });
    }
  );

  context(
    `when a user attempts to
    update of article with a category that does not exist`,
    () => {
      it('does not update the articles category ', async () => {
        const myArticle = ArticleData5;
        myArticle.category = 'College';
        const response = await chai
          .request(app)
          .patch(`${BASE_URL}/articles/update/${slug1}`)
          .set('Authorization', userToken)
          .send(myArticle);
        expect(response.status).to.equal(200);
        expect(response.body.publishedAt).to.equal(null);
        expect(response.body.title).to.equal(myArticle.title);
      });
    }
  );

  context('when there is an internal error', () => {
    it('returns an error', async () => {
      const stub = sinon.stub(Article, 'update');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const response = await chai
        .request(app)
        .patch(`${BASE_URL}/articles/update/${slug1}`)
        .set('Authorization', userToken)
        .send(ArticleData5);
      expect(response).to.have.status(500);
      expect(response.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });

  context('when a user enters a bad tag ', () => {
    it('returns error', async () => {
      const badArticleTag = ArticleData5;
      badArticleTag.category = 'Life';
      badArticleTag.tags = '/;.';
      const response = await chai
        .request(app)
        .patch(`${BASE_URL}/articles/update/${slug1}`)
        .set('Authorization', userToken)
        .send(badArticleTag);
      expect(response).to.have.status(400);
      expect(response.body.error).to.equal(
        'tags should be an array of valid strings'
      );
    });
  });
});
