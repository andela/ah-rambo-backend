import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import app from '../../server';
import userData from './__mocks__/user';
import Sessions from '../../server/controllers/Sessions';

chai.use(chaiHttp);

const BASE_URL = '/api/v1/sessions/create';
const { create } = Sessions;
const {
  rightUserWithUserName,
  rightUserWithEmail,
  userWithId,
  wrongUser
} = userData;

describe('LOGIN TEST', () => {
  it('should login in user if the right email is provided', async () => {
    const response = await chai
      .request(app)
      .post(`${BASE_URL}`)
      .send(rightUserWithEmail);
    expect(response).to.have.status(200);
    // expect(res.body).to.have.key('user', 'status', 'token');
    expect(response.body.user).to.not.have.property('password');
    expect(response.body.user).to.have.any.keys(
      'id',
      'userName',
      'email',
      'status'
    );
  });

  it('should login in user if the right username is provided', async () => {
    const response = await chai
      .request(app)
      .post(`${BASE_URL}`)
      .send(rightUserWithUserName);
    expect(response).to.have.status(200);
    // expect(res.body).to.have.key('user', 'status', 'token');
    expect(response.body.user).to.not.have.property('password');
    expect(response.body.user).to.have.any.keys(
      'id',
      'userName',
      'email',
      'status'
    );
  });

  it("should not login in user if the user's id is provided", async () => {
    const response = await chai
      .request(app)
      .post(`${BASE_URL}`)
      .send(userWithId);
    expect(response).to.have.status(400);
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');
  });

  it('should not login in user with the wrong credentials', async () => {
    const response = await chai
      .request(app)
      .post(`${BASE_URL}`)
      .send(wrongUser);
    expect(response).to.have.status(403);
    expect(response.body).to.not.have.property('user, token');
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.be.a('string');
  });
});

describe('SERVER TEST', () => {
  it("should not login in user if there's a server error", async () => {
    const stubfunc = { create };
    const sandbox = sinon.createSandbox();
    sandbox.stub(stubfunc, 'create').rejects(new Error('Server Error'));

    const next = sinon.spy();
    const res = {
      status: () => ({
        json: next
      })
    };
    await create({}, res);
    sinon.assert.calledOnce(next);
  });
});

export default chai;
