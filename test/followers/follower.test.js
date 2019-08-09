import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../server';
import { getNewUser } from '../users/__mocks__';
import models from '../../server/database/models';
import Followers from '../../server/controllers/Followers';

const { UserFollower, User } = models;
const { allFollowings, allFollowers } = Followers;

chai.use(chaiHttp);

const { BASE_URL } = process.env;
let data;
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
  data = response.body;
});

before(async () => {
  const userSignUp2 = getNewUser();
  await chai
    .request(app)
    .post(`${BASE_URL}/users/create`)
    .send({ ...userSignUp2, confirmPassword: userSignUp2.password });
  const response = await chai
    .request(app)
    .post(`${BASE_URL}/sessions/create`)
    .send({ userLogin: userSignUp2.userName, password: userSignUp2.password });
  userToken = response.body.token;
});

describe('Follow User', () => {
  context('when username is valid', () => {
    it('will follow a user', async () => {
      const { id, userName } = data.user;
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/profiles/${userName}/follow`)
        .set('Authorization', userToken);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.following.message).to.be.a('string');
      expect(response.body.following.data.userId).to.equal(id);
    });
  });

  context('when user tries to follow theirself', () => {
    it('returns a conflict', async () => {
      const {
        token,
        user: { userName }
      } = data;
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/profiles/${userName}/follow`)
        .set('Authorization', token);
      expect(response).to.have.status(409);
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.equal('user cannot perform this action');
    });
  });

  context('when username is invalid', () => {
    it('will not follow a user with wrong username', async () => {
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/profiles/fshjgnlkusdhny57eitrjhx/follow`)
        .set('Authorization', userToken);
      expect(response).to.have.status(404);
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.be.a('string');
    });
  });

  context('when there is an internal error', () => {
    it('will throw error', async () => {
      const stub = sinon.stub(UserFollower, 'create');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const response = await chai
        .request(app)
        .post(`${BASE_URL}/profiles/JhayXXX/follow`)
        .set('Authorization', userToken);
      expect(response).to.have.status(500);
      expect(response.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      UserFollower.create.restore();
    });
  });
});

describe('UnFollow User', () => {
  context('when username is valid', () => {
    it('will unfollow a user', async () => {
      const { userName, id } = data.user;
      const response = await chai
        .request(app)
        .delete(`${BASE_URL}/profiles/${userName}/follow`)
        .set('Authorization', userToken);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.data.message).to.equal(
        `you sucessfully unfollowed ${userName}`
      );
      expect(response.body.data.id).to.equal(id);
    });
  });

  context('when user tries to unfollow theirself', () => {
    it('returns a conflict', async () => {
      const {
        token,
        user: { userName }
      } = data;
      const response = await chai
        .request(app)
        .delete(`${BASE_URL}/profiles/${userName}/follow`)
        .set('Authorization', token);
      expect(response).to.have.status(409);
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.equal('user cannot perform this action');
    });
  });

  context('when username is invalid', () => {
    it('will not unfollow a user with wrong username', async () => {
      const response = await chai
        .request(app)
        .delete(`${BASE_URL}/profiles/fshjgnlkusdhny57eitr8cdlzkjhx/follow`)
        .set('Authorization', userToken);
      expect(response).to.have.status(404);
      expect(response.body).to.be.an('object');
      expect(response.body.error).to.equal('user not found');
    });
  });

  context('when there is an internal error', () => {
    it('will throw error', async () => {
      const stub = sinon.stub(User, 'findByUsername');
      const error = new Error('server error, this will be resolved shortly');
      stub.yields(error);
      const response = await chai
        .request(app)
        .delete(`${BASE_URL}/profiles/JhayX/follow`)
        .set('Authorization', userToken);
      expect(response).to.have.status(500);
      expect(response.body.error).to.equal(
        'server error, this will be resolved shortly'
      );
      User.findByUsername.restore();
    });
  });
});

describe('Get Followers', () => {
  before(async () => {
    const {
      user: { userName }
    } = data;
    await chai
      .request(app)
      .post(`${BASE_URL}/profiles/${userName}/follow`)
      .set('Authorization', userToken);
  });
  context('when user tries to get their followers in a valid session', () => {
    it('returns a success', async () => {
      const response = await chai
        .request(app)
        .get(`${BASE_URL}/user/followers`)
        .set('Authorization', data.token);
      expect(response).to.have.status(200);
      expect(response.body).to.be.an('object');
      expect(response.body.followers).to.be.an('array');
      expect(response.body.followers[0].follower).to.not.have.property(
        'password'
      );
    });
  });

  context('when there is an internal error', () => {
    it('will throw error', async () => {
      const stubfunc = { allFollowers };
      const sandbox = sinon.createSandbox();
      sandbox.stub(stubfunc, 'allFollowers').rejects(new Error('Server Error'));

      const next = sinon.spy();
      const res = {
        status: () => ({
          json: next
        })
      };
      await allFollowers({}, res);
      sinon.assert.calledOnce(next);
    });
  });
});

describe('Get Followings', () => {
  after(async () => {
    const {
      user: { userName }
    } = data;
    await chai
      .request(app)
      .delete(`${BASE_URL}/profiles/${userName}/follow`)
      .set('Authorization', userToken);
  });
  context(
    `when user tries to get 
  their users they are following in a valid session`,
    () => {
      it('returns a success', async () => {
        const response = await chai
          .request(app)
          .get(`${BASE_URL}/user/followings`)
          .set('Authorization', userToken);
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('object');
        expect(response.body.followings).to.be.an('array');
        expect(response.body.followings[0].following).to.not.have.property(
          'password'
        );
      });
    }
  );

  context('when there is an internal error', () => {
    it('will throw error', async () => {
      const stubfunc = { allFollowings };
      const sandbox = sinon.createSandbox();
      sandbox
        .stub(stubfunc, 'allFollowings')
        .rejects(new Error('Server Error'));

      const next = sinon.spy();
      const res = {
        status: () => ({
          json: next
        })
      };
      await allFollowings({}, res);
      sinon.assert.calledOnce(next);
    });
  });
});
