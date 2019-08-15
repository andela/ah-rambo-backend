/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { getNewUser } from '../users/__mocks__';
import app from '../../server';

chai.use(chaiHttp);

const authorUserName = 'JhayXXX';
const artilceSlug = 'rambo-team';
let commenter;

const baseUrl = process.env.BASE_URL;

describe('Add Comments to Article Tests', async () => {
  before(async () => {
    const user = getNewUser();
    const res = await chai
      .request(app)
      .post(`${baseUrl}/users/create`)
      .send({
        ...user,
        confirmPassword: user.password
      });
    commenter = res.body;
  });
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
    'when authenticated user attempts submitting number of chars above required',
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
      expect(res.body.comment.user.following).to.be.false; // Not following the author
    });
  });

  context(
    'when authenticated user adds comment to following users article',
    () => {
      it("returns comment details with 'following' being true", async () => {
        await chai
          .request(app)
          .post(`${baseUrl}/profiles/${authorUserName}/follow`)
          .set('Authorization', commenter.token);

        const res = await chai
          .request(app)
          .post(`${baseUrl}/articles/${artilceSlug}/comments`)
          .set('authorization', commenter.token)
          .send({
            comment: new Array(3000).join('a')
          });
        expect(res).to.have.status(201);
        expect(res.body).to.haveOwnProperty('comment');
        expect(res.body.comment.user.following).to.be.true; // Following the author
      });
    }
  );
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
    'When user attempt fetch all comments for article that does not have comment',
    () => {
      it('returns an error', async () => {
        const res = await chai
          .request(app)
          .get(`${baseUrl}/articles/creat-sample/comments`);
        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.deep.equal('article has no comment');
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
});
