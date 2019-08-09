import chai from 'chai';
import sinon from 'sinon';
import CreateSocialUser from '../../server/helpers/createSocialUsers';
import { verifiedStatusData } from './__mocks_';
import PassportError from '../../server/middlewares/passportError';

const req = {};
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
const { expect } = chai;
describe('verified Status on Social login test', () => {
  context(
    `when a user supplies valid credential to each
  of the socialLogin api`,
    () => {
      it('verifies such user successfully', async () => {
        const response = await CreateSocialUser(verifiedStatusData);
        const { verified } = response;
        expect(verified).to.be.equal(true);
      });
    }
  );
  context(
    'when user does not supply valid credential to the Social login api',
    () => {
      it('returns an error message on failure', () => {
        PassportError.passportErrors(true, req, res, () => {});
        expect(res.body.message).to.equals('Auth failed');
        expect(res.statusCode).to.equals(400);
      });
    }
  );
});
