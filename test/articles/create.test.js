import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { uploader } from 'cloudinary';
import sinon from 'sinon';
import app from '../../server';
import Articles from '../../server/controllers/Articles';
import model from '../../server/database/models';
import { getNewUser } from '../users/__mocks__';
import {
  ArticleData2,
  noTagArticleData,
  newArticleData,
  ArticleData4,
  invalidArticleData,
  request,
  ArticleData5,
  categoryDetails
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

const { Article, Category } = model;
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
    `when user enter article with
    valid details with status as publish`,
    () => {
      it('create and publish articles successfully', async () => {
        const response = await chai
          .request(app)
          .post(`${BASE_URL}/articles/create`)
          .set('Authorization', userToken)
          .send(noTagArticleData);
        expect(response.status).to.equal(200);
      });
      it('upload image sucessfully', async () => {
        const uploaderstub = sinon
          .stub(uploader, 'upload')
          .callsFake(() => data.uploaded);
        const category = sinon
          .stub(Category, 'findOne')
          .callsFake(() => categoryDetails);
        await Articles.createArticle(request, res);
        expect(res.statusCode).to.equal(200);
        uploaderstub.restore();
        category.restore();
      });
    }
  );

  context(
    `when a registered user enter article with
    valid details with status as publish and a tag`,
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
        await Articles.createArticle(request, res);
        expect(res.statusCode).to.equal(200);
        uploaderstub.restore();
      });
    }
  );

  context('when a user enters a bad tag ', () => {
    it('returns error', async () => {
      const badArticleTag = ArticleData2;
      badArticleTag.category = 'Industry';
      badArticleTag.tags = '/;.';
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(badArticleTag);
      expect(response).to.have.status(400);
      expect(response.body.error).to.equal(
        'tags should be an array of valid strings'
      );
    });
  });

  context('when a user enters a tag with just a letter', () => {
    it('returns error', async () => {
      const badArticleTag = ArticleData2;
      badArticleTag.tags = 'j';
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(badArticleTag);
      expect(response).to.have.status(422);
      expect(response.body.errors.tags).to.equal(
        'tags should not be less than 2 characters'
      );
    });
  });

  context(
    'when a user enters a list of tags, with a tag thats just a letter',
    () => {
      it('returns error', async () => {
        const badArticleTag = ArticleData2;
        badArticleTag.tags = 'j,HJFDSG';
        const response = await chai
          .request(app)
          .post(`${BASE_URL}/articles/create`)
          .set('Authorization', userToken)
          .send(badArticleTag);
        expect(response).to.have.status(400);
        expect(response.body.error).to.equal(
          'each tag must be more than a character'
        );
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
    it('returns error', async () => {
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(invalidArticleData);
      expect(response.status).to.equal(422);
    });
  });

  context('when there is an internal error', () => {
    it('returns error', async () => {
      const stub = sinon.stub(Article, 'create');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(newArticleData);
      expect(response).to.have.status(500);
      expect(response.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });

  context(
    `when a user  enter valid
  article details with a valid category`,
    async () => {
      it('create an articles with category', async () => {
        const response = await chai
          .request(app)
          .post(`${BASE_URL}/articles/create`)
          .set('Authorization', userToken)
          .send(ArticleData4);
        expect(response.body.category.name).to.equal('other');
        expect(response.status).to.equal(200);
      });
    }
  );

  context('when user enters non-existing category', () => {
    it('add the category to tag', async () => {
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(ArticleData5);
      expect(response.status).to.equal(200);
      expect(response.body.category.name).to.equal('other');
      expect(response.body.tagList[2]).to.equal('lifestyle');
    });
  });

  context('when user enters category as other', () => {
    it('does not add the category to tag', async () => {
      ArticleData5.category = 'other';
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/articles/create`)
        .set('Authorization', userToken)
        .send(ArticleData5);
      expect(response.status).to.equal(200);
      expect(response.body.category.name).to.equal('other');
      expect(response.body.tagList[2]).to.not.equal('other');
    });
  });
});
