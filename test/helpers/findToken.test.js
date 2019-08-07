import chai from 'chai';
import chaiHttp from 'chai-http';
import { findToken } from '../../server/helpers';
import getNewUser from '../users/__mocks__';
import app from '../../server';

chai.use(chaiHttp);

const { expect } = chai;
const { BASE_URL } = process.env;

let data;
before(async () => {
  const user = getNewUser();
  await chai
    .request(app)
    .post(`${BASE_URL}/users/create`)
    .send({
      ...user,
      confirmPassword: user.password
    });

  const response = await chai
    .request(app)
    .post(`${BASE_URL}/sessions/create`)
    .send({
      userLogin: user.userName,
      password: user.password
    });
  data = response.body;
});

describe('find token helper', () => {
  context('when token has expired', () => {
    it('returns false', async () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const session = await findToken(token);
      expect(session).to.equal(false);
    });
  });

  context('when token is valid', () => {
    it('will find token session', async () => {
      const { token } = data;
      const session = await findToken(token);
      expect(session.userId).to.equal(data.user.id);
      expect(session.token).to.equal(token);
    });
  });

  context('when token is invalid', () => {
    it('will not return session', async () => {
      const session = await findToken('jhrjhbejhbrjhb');
      expect(session).to.equal(null);
    });
  });
});
