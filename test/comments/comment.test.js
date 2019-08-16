/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { getNewUser } from '../users/__mocks__';
import userData from '../users/__mocks__/user';
import app from '../../server';
import models from '../../server/database/models';
import { ArticleData2, ArticleData10 } from '../articles/__mocks__';

const { Comment, Article } = models;
const { rightUserWithEmail } = userData;

chai.use(chaiHttp);

let author;
let artilceSlug;
let artilceSlug2;
let commenter;

const baseUrl = process.env.BASE_URL;

before(async () => {
  const user = getNewUser();
  const signUpResponse = await chai
    .request(app)
    .post(`${baseUrl}/users/create`)
    .send({
      ...user,
      confirmPassword: user.password
    });
  commenter = signUpResponse.body;

  const loginResponse = await chai
    .request(app)
    .post(`${baseUrl}/sessions/create`)
    .send(rightUserWithEmail);
  author = loginResponse.body;

  const articleResponse = await chai
    .request(app)
    .post(`${baseUrl}/articles/create`)
    .set('Authorization', author.token)
    .send(ArticleData2);
  artilceSlug = articleResponse.body.slug;

  const articleResponse2 = await chai
    .request(app)
    .post(`${baseUrl}/articles/create`)
    .set('Authorization', author.token)
    .send(ArticleData10);
  artilceSlug2 = articleResponse2.body.slug;
});

describe('Add Comments to Article Tests', async () => {
  context('When unregistered user wants to make comment', () => {
    it('returns an error', async () => {
      const res = await chai
        .request(app)
        .post(`${baseUrl}/articles/${artilceSlug}/comments`)
        .send({
          comment: 'Nice post'
        });
      expect(res).to.have.status(401);
      expect(res.body).to.haveOwnProperty('message');
      expect(res.body.message).to.deep.equal('no token provided');
    });
  });

  context(
    'When an authenticated user comments on an article not in database',
    () => {
      it('returns not found error', async () => {
        const res = await chai
          .request(app)
          .post(`${baseUrl}/articles/unknowm-slug/comments`)
          .set('authorization', commenter.token)
          .send({
            comment: 'Nice post'
          });
        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.deep.equal('article not found');
      });
    }
  );

  context(
    'when authenticated user attempts submitting empty comment body',
    () => {
      it('returns error', async () => {
        const res = await chai
          .request(app)
          .post(`${baseUrl}/articles/${artilceSlug}/comments`)
          .set('authorization', commenter.token)
          .send({
            comment: ''
          });
        expect(res).to.have.status(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('comment');
        expect(res.body.errors.comment).to.deep.equal(
          'comment should not be less than 2 characters'
        );
      });
    }
  );

  context(
    `
  when authenticated user attempts submitting number 
  of chars above 5000`,
    () => {
      it('returns error', async () => {
        const res = await chai
          .request(app)
          .post(`${baseUrl}/articles/${artilceSlug}/comments`)
          .set('authorization', commenter.token)
          .send({
            comment: new Array(5003).join('a')
          });
        expect(res).to.have.status(422);
        expect(res.body).to.haveOwnProperty('errors');
        expect(res.body.errors).to.haveOwnProperty('comment');
        expect(res.body.errors.comment).to.deep.equal(
          'comment should not be more than 5000 characters'
        );
      });
    }
  );

  context('when authenticated user successfully commented', () => {
    it('returns comment details', async () => {
      const res = await chai
        .request(app)
        .post(`${baseUrl}/articles/${artilceSlug}/comments`)
        .set('authorization', commenter.token)
        .send({
          comment: new Array(4999).join('a')
        });
      expect(res).to.have.status(201);
      expect(res.body).to.haveOwnProperty('comment');
      expect(res.body.comment.author.following).to.be.false;
    });
  });

  context(
    'when authenticated user adds comment to following user article',
    () => {
      before(async () => {
        await chai
          .request(app)
          .post(`${baseUrl}/profiles/${author.user.userName}/follow`)
          .set('Authorization', commenter.token);
      });
      it("returns comment details with 'following' being true", async () => {
        const res = await chai
          .request(app)
          .post(`${baseUrl}/articles/${artilceSlug}/comments`)
          .set('authorization', commenter.token)
          .send({
            comment: new Array(3000).join('a')
          });

        expect(res).to.have.status(201);
        expect(res.body).to.haveOwnProperty('comment');
        expect(res.body.comment.author.following).to.be.true;
      });
    }
  );

  context('When there is server error when making a comment', () => {
    it('returns a 500 error', async () => {
      const stub = sinon.stub(Comment, 'create');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);

      const res = await chai
        .request(app)
        .post(`${baseUrl}/articles/${artilceSlug}/comments`)
        .set('authorization', commenter.token)
        .send({
          comment: new Array(3000).join('a')
        });
      expect(res).to.have.status(500);
      expect(res.body).to.include.key('error');
      expect(res.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });
});

describe('Get All Comments for an Article - Test', async () => {
  context(
    'When user fetch all comments for article that is not in database',
    () => {
      it('returns an error', async () => {
        const res = await chai
          .request(app)
          .get(`${baseUrl}/articles/artilceSlug/comments`);
        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.deep.equal('article not found');
      });
    }
  );

  context(
    `When user attempt fetch all comments
    for article that does not have comment`,
    () => {
      it('returns an error', async () => {
        const res = await chai
          .request(app)
          .get(`${baseUrl}/articles/${artilceSlug2}/comments`);
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('message');
        expect(res.body).to.haveOwnProperty('comments');
        expect(res.body.message).to.deep.equal('article has no comment');
      });
    }
  );

  context('When user successfully get all comments for an article', () => {
    it('returns success', async () => {
      const res = await chai
        .request(app)
        .get(`${baseUrl}/articles/${artilceSlug}/comments`);
      expect(res).to.have.status(200);
      expect(res.body).to.haveOwnProperty('comments');
      expect(res.body.comments).to.be.an('array');
    });
  });

  context('When there is server error when making a comment', () => {
    it('returns a 500 error', async () => {
      const stub = sinon.stub(Article, 'findBySlug');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);

      const res = await chai
        .request(app)
        .get(`${baseUrl}/articles/${artilceSlug}/comments`);

      expect(res).to.have.status(500);
      expect(res.body).to.include.key('error');
      expect(res.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      stub.restore();
    });
  });
});
