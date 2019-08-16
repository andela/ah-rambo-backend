/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { getNewUser } from '../users/__mocks__';
import userData from '../users/__mocks__/user';
import app from '../../server';
import models from '../../server/database/models';
import { ArticleData20 } from '../articles/__mocks__';

const { Article } = models;
const { rightUserWithEmail } = userData;

chai.use(chaiHttp);

let author;
let artilceSlug;
let commenter;
let commenter2;
let firstCommentId;

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

  const user2 = getNewUser();
  const signUpResponse2 = await chai
    .request(app)
    .post(`${baseUrl}/users/create`)
    .send({
      ...user2,
      confirmPassword: user2.password
    });
  commenter2 = signUpResponse2.body;

  const loginResponse = await chai
    .request(app)
    .post(`${baseUrl}/sessions/create`)
    .send(rightUserWithEmail);
  author = loginResponse.body;

  const articleResponse = await chai
    .request(app)
    .post(`${baseUrl}/articles/create`)
    .set('Authorization', author.token)
    .send(ArticleData20);
  artilceSlug = articleResponse.body.slug;

  const res = await chai
    .request(app)
    .post(`${baseUrl}/articles/${artilceSlug}/comments`)
    .set('authorization', commenter.token)
    .send({
      comment: new Array(4999).join('a')
    });
  firstCommentId = res.body.comment.id;
});

describe('Update comment test', async () => {
  context(
    'When an authenticated user updates comment with characters above required',
    () => {
      it('returns validation error', async () => {
        const res = await chai
          .request(app)
          .patch(
            `${baseUrl}/articles/${artilceSlug}/comments/${firstCommentId}`
          )
          .set('authorization', commenter.token)
          .send({
            comment: new Array(5555).join('a')
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

  context('When updating with comment id that is unavailable', () => {
    it('returns error that comment does not exist', async () => {
      const res = await chai
        .request(app)
        .patch(`${baseUrl}/articles/${artilceSlug}/comments/1000`)
        .set('authorization', commenter.token)
        .send({
          comment: new Array(23).join('a')
        });
      expect(res).to.have.status(404);
      expect(res.body).to.haveOwnProperty('error');
      expect(res.body.error).to.deep.equal('comment not found');
    });
  });

  context(
    'When another authenticated user attempts to update another users comment',
    () => {
      it('returns error that comment does not exist', async () => {
        const res = await chai
          .request(app)
          .patch(
            `${baseUrl}/articles/${artilceSlug}/comments/${firstCommentId}`
          )
          .set('authorization', commenter2.token)
          .send({
            comment: new Array(23).join('a')
          });
        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.deep.equal('comment not found');
      });
    }
  );

  context(
    'When authenticated user successfully updates his/her comment',
    () => {
      it('returns success message with the new comment details', async () => {
        const res = await chai
          .request(app)
          .patch(
            `${baseUrl}/articles/${artilceSlug}/comments/${firstCommentId}`
          )
          .set('authorization', commenter.token)
          .send({
            comment: new Array(23).join('a')
          });
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('message');
        expect(res.body.message).to.deep.equal('comment updated');
        expect(res.body).to.haveOwnProperty('comment');
        expect(res.body.comment).to.be.an('object');
      });
    }
  );

  context('When there is server error while updating a comment', () => {
    it('returns a 500 error', async () => {
      const stub = sinon.stub(Article, 'findBySlug');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);

      const res = await chai
        .request(app)
        .patch(`${baseUrl}/articles/${artilceSlug}/comments/${firstCommentId}`)
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

  context(
    'When user attempts updating comment with unavailabe article slug',
    () => {
      it('returns error that article does not exist', async () => {
        const res = await chai
          .request(app)
          .patch(`${baseUrl}/articles/artilceSlug/comments/${firstCommentId}`)
          .set('authorization', commenter.token)
          .send({
            comment: new Array(23).join('a')
          });
        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.deep.equal('article not found');
      });
    }
  );
});

describe('Delete Comment test', async () => {
  context('When deleting with comment id that is unavailable', () => {
    it('returns error that comment does not exist', async () => {
      const res = await chai
        .request(app)
        .delete(`${baseUrl}/articles/${artilceSlug}/comments/1000`)
        .set('authorization', commenter.token);
      expect(res).to.have.status(404);
      expect(res.body).to.haveOwnProperty('error');
      expect(res.body.error).to.deep.equal('comment not found');
    });
  });

  context(
    'When another authenticated user attempts to delete another users comment',
    () => {
      it('returns error that comment does not exist', async () => {
        const res = await chai
          .request(app)
          .delete(
            `${baseUrl}/articles/${artilceSlug}/comments/${firstCommentId}`
          )
          .set('authorization', commenter2.token)
          .send({
            comment: new Array(23).join('a')
          });
        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.deep.equal('comment not found');
      });
    }
  );

  context('When there is server error while deleting a comment', () => {
    it('returns a 500 error', async () => {
      const stub = sinon.stub(Article, 'findBySlug');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);

      const res = await chai
        .request(app)
        .delete(`${baseUrl}/articles/${artilceSlug}/comments/${firstCommentId}`)
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

  context(
    'When user attempts deleting comment with unavailabe article slug',
    () => {
      it('returns error that article does not exist', async () => {
        const res = await chai
          .request(app)
          .delete(`${baseUrl}/articles/artilceSlug/comments/${firstCommentId}`)
          .set('authorization', commenter.token)
          .send({
            comment: new Array(23).join('a')
          });
        expect(res).to.have.status(404);
        expect(res.body).to.haveOwnProperty('error');
        expect(res.body.error).to.deep.equal('article not found');
      });
    }
  );

  context(
    'When authenticated user successfully deletes his/her comment',
    () => {
      it('returns success message', async () => {
        const res = await chai
          .request(app)
          .delete(
            `${baseUrl}/articles/${artilceSlug}/comments/${firstCommentId}`
          )
          .set('authorization', commenter.token)
          .send({
            comment: new Array(23).join('a')
          });
        expect(res).to.have.status(200);
        expect(res.body).to.haveOwnProperty('message');
        expect(res.body.message).to.deep.equal('comment deleted');
      });
    }
  );
});
